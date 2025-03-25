"use client";

import {useParams} from "next/navigation";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {useCurrentUser} from "@/services/user-service";
import {ReviewDisputeModal} from "@/app/components/modals/review-dispute-modal";
import TournamentDetails from "@/app/components/smart-contracts/tournament-details";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {getContractWithSigner} from "@/lib/contract";
import {SubmitMatchResultsModal} from "@/app/components/modals/submit-match-results-modal";

interface Match {
    match: number;
    label: string;
    player1: { userId: string; status?: string } | null;
    player2: { userId: string; status?: string } | null;
    winner: string | null;
}

export default function TournamentInfo() {
    const params = useParams();
    const {tournamentId} = params;
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [dynamicBracket, setDynamicBracket] = useState<Match[]>([]);

    const {user, role} = useCurrentUser();
    const currentUserId = user?.userId;
    const isOrganizer = role === "organizer";

    const tournamentQuery = useQuery(api.tournaments.getTournamentById, {
        tournamentId: tournamentId as Id<"tournaments">,
    });
    const playersInTournamentQuery = useQuery(api.tournament_entries.getPlayersInTournament, {
        tournamentId: tournamentId as Id<"tournaments">,
    });
    const playerDetailsQuery = useQuery(api.players.getPlayersByUserIds, {
        userIds: playersInTournamentQuery?.map((player) => player.userId) || [],
    });
    const matchResults = useQuery(api.match_results.getMatchResults, {
        tournamentId: tournamentId as Id<"tournaments">,
    });
    const submitMatchResult = useMutation(api.match_results.submitMatchResult);
    const resolveMatchDispute = useMutation(api.match_results.resolveMatchDispute);

    // Initialize the bracket once playersInTournamentQuery is available
    useEffect(() => {
        if (!playersInTournamentQuery) return;

        const initialBracket: Match[] = [
            {
                match: 1,
                label: "Semi Final 1",
                player1: playersInTournamentQuery[0] || null,
                player2: playersInTournamentQuery[1] || null,
                winner: null,
            },
            {
                match: 2,
                label: "Semi Final 2",
                player1: playersInTournamentQuery[2] || null,
                player2: playersInTournamentQuery[3] || null,
                winner: null,
            },
            {
                match: 3,
                label: "Grand Final",
                player1: null,
                player2: null,
                winner: null,
            },
        ];
        setDynamicBracket(initialBracket);
    }, [playersInTournamentQuery]);

    // Update the bracket based on match results
    useEffect(() => {
        if (!matchResults || !dynamicBracket.length) return;

        // Create a fresh copy of the bracket
        const updatedBracket = dynamicBracket.map(match => ({...match}));

        // Update semi-final winners
        matchResults.forEach((result) => {
            const matchNumber = parseInt(result.matchId.replace("match-", ""), 10);
            const matchIndex = updatedBracket.findIndex((m) => m.match === matchNumber);
            if (matchIndex !== -1 && result.status === "completed" && result.winnerUserId) {
                updatedBracket[matchIndex].winner = result.winnerUserId;
            }
        });

        // Propagate winners to Grand Final
        const semi1Winner = updatedBracket.find(m => m.match === 1)?.winner;
        const semi2Winner = updatedBracket.find(m => m.match === 2)?.winner;
        const grandFinalIndex = updatedBracket.findIndex(m => m.match === 3);

        if (grandFinalIndex !== -1) {
            if (semi1Winner && semi2Winner) {
                updatedBracket[grandFinalIndex].player1 = {userId: semi1Winner};
                updatedBracket[grandFinalIndex].player2 = {userId: semi2Winner};
            } else if (semi1Winner) {
                updatedBracket[grandFinalIndex].player1 = {userId: semi1Winner};
            } else if (semi2Winner) {
                updatedBracket[grandFinalIndex].player2 = {userId: semi2Winner};
            }
        }

        // Debugging: Uncomment to check bracket state
        // console.log("Match Results:", matchResults);
        // console.log("Updated Bracket:", updatedBracket);

        // Only update state if there are changes to avoid infinite loops
        if (JSON.stringify(updatedBracket) !== JSON.stringify(dynamicBracket)) {
            setDynamicBracket(updatedBracket);
        }
    }, [matchResults, dynamicBracket]);

    if (!tournamentId) {
        return <div>Invalid Tournament ID</div>;
    }

    if (
        !tournamentQuery ||
        !playersInTournamentQuery ||
        !playerDetailsQuery ||
        !matchResults ||
        dynamicBracket.length === 0
    ) {
        return <div>Loading...</div>;
    }

    if (
        "error" in tournamentQuery ||
        "error" in playersInTournamentQuery ||
        "error" in playerDetailsQuery ||
        "error" in matchResults
    ) {
        return <div>Error loading tournament details.</div>;
    }

    const tournament = tournamentQuery;
    const playersInTournament = playersInTournamentQuery;
    const playerDetails = playerDetailsQuery;

    const playerIgnMap = new Map<string, string>();
    playerDetails.forEach((player) => {
        if (player) {
            playerIgnMap.set(player.userId, player.ign);
        }
    });

    const isTournamentOrganizer = isOrganizer && currentUserId === tournament.userId;

    const handleOpenSubmitModal = (match: Match) => {
        setSelectedMatch(match);
        setIsSubmitModalOpen(true);
    };

    const handleOpenReviewModal = (match: Match) => {
        setSelectedMatch(match);
        setIsReviewModalOpen(true);
    };

    const handleSubmitResult = (winner: string) => {
        if (!selectedMatch) return;
        console.log(`Result submitted for ${selectedMatch.label}: Winner is ${winner}`);
        setIsSubmitModalOpen(false);
    };

    const handleResolveDispute = async (winnerUserId: string) => {
        if (!selectedMatch || !selectedMatch.player1 || !selectedMatch.player2 || !currentUserId) {
            console.error("Cannot resolve dispute: Missing required information");
            return;
        }

        try {
            const player1Details = playerDetails?.find(p => p?.userId === selectedMatch.player1?.userId);
            const player2Details = playerDetails?.find(p => p?.userId === selectedMatch.player2?.userId);
            const winnerDetails = playerDetails?.find(p => p?.userId === winnerUserId);

            if (!player1Details?.walletId || !player2Details?.walletId || !winnerDetails?.walletId) {
                throw new Error("Wallet addresses not found for players.");
            }

            const contract = await getContractWithSigner(tournament.contractAddress);
            const matchIdNum = parseInt(selectedMatch.match.toString());
            const tx = await contract.resolveDispute(matchIdNum, winnerDetails.walletId);
            const receipt = await tx.wait();
            const transactionHash = receipt.hash;

            await resolveMatchDispute({
                tournamentId: tournamentId as Id<"tournaments">,
                matchId: `match-${selectedMatch.match}`,
                winnerUserId,
                submittedBy: currentUserId,
                transactionHash,
            });

            console.log(`Dispute resolved for ${selectedMatch.label}`);
            setIsReviewModalOpen(false);
        } catch (error) {
            console.error("Failed to resolve dispute:", error);
        }
    };

    const getPlayerName = (player: { userId: string; status?: string } | null): string | null => {
        if (!player) return null;
        const ign = playerIgnMap.get(player.userId) || "Unknown Player";
        return player.status === "pending" ? `${ign} (pending)` : ign;
    };

    const isCurrentUserParticipant = (match: Match) => {
        if (!currentUserId || !match.player1 || !match.player2) return false;
        return match.player1.userId === currentUserId || match.player2.userId === currentUserId;
    };

    const hasUserSubmittedResult = (match: Match) => {
        if (!currentUserId || !match.player1 || !match.player2) return false;
        const matchId = `match-${match.match}`;
        const result = matchResults.find((mr) => mr.matchId === matchId);
        if (!result) return false;
        return (
            (currentUserId === match.player1.userId && result.player1Submission !== undefined) ||
            (currentUserId === match.player2.userId && result.player2Submission !== undefined)
        );
    };

    const getMatchStatus = (match: Match) => {
        const matchId = `match-${match.match}`;
        const result = matchResults.find((mr) => mr.matchId === matchId);
        if (!result) return "Awaiting Results";
        if (result.status === "pending") return "Awaiting Results";
        if (result.status === "completed" && result.winnerUserId) {
            const winnerIgn = playerIgnMap.get(result.winnerUserId) || "Unknown Player";
            return `Winner: ${winnerIgn}`;
        }
        if (result.status === "disputed") return "Results in Dispute";
        return "Awaiting Results";
    };

    const getSubmittedResults = (match: Match) => {
        const matchId = `match-${match.match}`;
        const result = matchResults.find((mr) => mr.matchId === matchId);
        if (!result) return {player1Submission: null, player2Submission: null};
        return {
            player1Submission: result.player1Submission
                ? playerIgnMap.get(result.player1Submission) || "Unknown"
                : null,
            player2Submission: result.player2Submission
                ? playerIgnMap.get(result.player2Submission) || "Unknown"
                : null,
        };
    };

    return (
        <div>
            <div
                className="一定会min-h-screen text-white bg-[url(/assets/images/bg/view-tournament-bg.jpg)] bg-cover bg-left">
                <div className="max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[100px] mx-auto">
                    <div className="w-full flex flex-col items-center justify-center">
                        {tournament.gameTitle === "mortal-kombat" && (
                            <Image src={mk} alt="mortal kombat" width={2000} height={2000} className="w-[700px]"/>
                        )}
                        {tournament.gameTitle === "street-fighter" && (
                            <Image src={sf} alt="street fighter" width={2000} height={2000} className="w-[700px]"/>
                        )}
                        {tournament.gameTitle === "injustice" && (
                            <Image src={injustice} alt="injustice" width={2000} height={2000} className="w-[700px]"/>
                        )}
                        {tournament.gameTitle === "tekken" && (
                            <Image src={tekken} alt="tekken" width={2000} height={2000} className="w-[700px]"/>
                        )}
                        <div className="flex gap-x-5 items-center">
                            <div className="text-[40px]">
                                {tournament.tournamentName} -{" "}
                                <span className="text-theme-crimson">Semi Finals</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 max-w-[1300px] mx-auto">
                        <div className="flex justify-between gap-5">
                            {dynamicBracket.slice(0, 2).map((match, index) => (
                                <div
                                    key={index}
                                    className="border border-theme-crimson bg-black/40 backdrop-blur-lg p-[40px] rounded-lg flex-1 h-[340px] flex flex-col"
                                >
                                    <h2 className="text-[26px] font-semibold text-center">{match.label}</h2>
                                    <div className="flex justify-between items-center w-full relative flex-1">
                                        <div className="text-[20px] w-[37%] text-center">
                                            {match.player1
                                                ? playerIgnMap.get(match.player1.userId) || "Unknown Player"
                                                : <span
                                                    className="text-muted-white text-[20px]">Waiting for player...</span>}
                                        </div>
                                        <div className="absolute w-full flex justify-center h-full items-center">
                                            <Image src="/assets/images/versus/vs.png" alt="vs" height={150}
                                                   width={150}/>
                                        </div>
                                        <div className="text-[20px] w-[37%] text-center">
                                            {match.player2
                                                ? playerIgnMap.get(match.player2.userId) || "Unknown Player"
                                                : <span
                                                    className="text-muted-white text-[20px]">Waiting for player...</span>}
                                        </div>
                                    </div>

                                    <div className="text-center text-[16px] mt-4">{getMatchStatus(match)}</div>
                                    {isCurrentUserParticipant(match) && (
                                        <div className="w-full mt-4">
                                            <Button
                                                className="w-full"
                                                variant="secondary"
                                                onClick={() => handleOpenSubmitModal(match)}
                                                disabled={hasUserSubmittedResult(match)}
                                            >
                                                {hasUserSubmittedResult(match)
                                                    ? "Match Results Submitted"
                                                    : "Submit Match Results"}
                                            </Button>
                                        </div>
                                    )}
                                    {isTournamentOrganizer && getMatchStatus(match) === "Results in Dispute" && (
                                        <div className="w-full mt-4">
                                            <Button
                                                className="w-full"
                                                variant="secondary"
                                                onClick={() => handleOpenReviewModal(match)}
                                            >
                                                Resolve Dispute
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-5">
                            <div
                                className="border border-theme-crimson bg-black/40 backdrop-blur-lg p-[40px] rounded-lg flex-1 h-[340px] flex flex-col">
                                <h2 className="text-[26px] font-semibold text-center">{dynamicBracket[2].label}</h2>
                                <div className="flex justify-between items-center w-full relative flex-1">
                                    <div className="text-[20px] w-[37%] text-center">
                                        {dynamicBracket[2].player1
                                            ? playerIgnMap.get(dynamicBracket[2].player1.userId) || "Unknown Player"
                                            :
                                            <span className="text-muted-white text-[20px]">Waiting for player...</span>}
                                    </div>
                                    <div className="absolute w-full flex justify-center h-full items-center">
                                        <Image src="/assets/images/versus/vs.png" alt="vs" height={150} width={150}/>
                                    </div>
                                    <div className="text-[20px] w-[37%] text-center">
                                        {dynamicBracket[2].player2
                                            ? playerIgnMap.get(dynamicBracket[2].player2.userId) || "Unknown Player"
                                            :
                                            <span className="text-muted-white text-[20px]">Waiting for player...</span>}
                                    </div>
                                </div>
                                <div className="text-center text-[16px] mt-4">{getMatchStatus(dynamicBracket[2])}</div>
                                {isCurrentUserParticipant(dynamicBracket[2]) && (
                                    <div className="w-full mt-4">
                                        <Button
                                            className="w-full"
                                            variant="secondary"
                                            onClick={() => handleOpenSubmitModal(dynamicBracket[2])}
                                            disabled={hasUserSubmittedResult(dynamicBracket[2])}
                                        >
                                            {hasUserSubmittedResult(dynamicBracket[2])
                                                ? "Match Results Submitted"
                                                : "Submit Match Results"}
                                        </Button>
                                    </div>
                                )}
                                {isTournamentOrganizer && getMatchStatus(dynamicBracket[2]) === "Results in Dispute" && (
                                    <div className="w-full mt-4">
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            onClick={() => handleOpenReviewModal(dynamicBracket[2])}
                                        >
                                            Resolve Dispute
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Accordion type="single" collapsible className="mt-20">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>More Details</AccordionTrigger>
                                <AccordionContent>
                                    <TournamentDetails contractAddress={tournament.contractAddress}/>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                <SubmitMatchResultsModal
                    open={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    matchLabel={selectedMatch?.label || ""}
                    player1={selectedMatch?.player1 ? getPlayerName(selectedMatch.player1) : null}
                    player2={selectedMatch?.player2 ? getPlayerName(selectedMatch.player2) : null}
                    onSubmit={handleSubmitResult}
                    tournamentId={tournamentId as Id<"tournaments">}
                    matchId={selectedMatch ? `match-${selectedMatch.match}` : ""}
                    player1UserId={selectedMatch?.player1?.userId || null}
                    player2UserId={selectedMatch?.player2?.userId || null}
                    submittedBy={currentUserId || ""}
                    contractAddress={tournament.contractAddress}
                />

                <ReviewDisputeModal
                    open={isReviewModalOpen}
                    onOpenChange={setIsReviewModalOpen}
                    matchLabel={selectedMatch?.label || ""}
                    player1Name={selectedMatch?.player1 ? getPlayerName(selectedMatch.player1) : null}
                    player2Name={selectedMatch?.player2 ? getPlayerName(selectedMatch.player2) : null}
                    player1UserId={selectedMatch?.player1?.userId || null}
                    player2UserId={selectedMatch?.player2?.userId || null}
                    player1Submission={selectedMatch ? getSubmittedResults(selectedMatch).player1Submission : null}
                    player2Submission={selectedMatch ? getSubmittedResults(selectedMatch).player2Submission : null}
                    onResolveDispute={handleResolveDispute}
                />
            </div>
        </div>
    );
}