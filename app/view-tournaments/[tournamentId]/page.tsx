'use client';

import {useParams} from 'next/navigation';
import {useMutation, useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {Button} from "@/components/ui/button";
import {SubmitMatchResultsModal} from "@/app/components/modals/submit-match-results-modal";
import {useState} from "react";
import {useCurrentUser} from "@/services/user-service";
import {ReviewDisputeModal} from "@/app/components/modals/review-dispute-modal";
import TournamentDetails from "@/app/components/smart-contracts/tournament-details";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

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

    const {user, role} = useCurrentUser();
    const currentUserId = user?.userId;
    const isOrganizer = role === "organizer"; // Assuming role is a string like "organizer", "player", etc.

    const tournamentQuery = useQuery(api.tournaments.getTournamentById, {tournamentId: tournamentId as Id<"tournaments">});
    const playersInTournamentQuery = useQuery(api.tournament_entries.getPlayersInTournament, {tournamentId: tournamentId as Id<"tournaments">});
    const playerDetailsQuery = useQuery(api.players.getPlayersByUserIds, {
        userIds: playersInTournamentQuery?.map(player => player.userId) || []
    });
    const matchResults = useQuery(api.match_results.getMatchResults, {tournamentId: tournamentId as Id<"tournaments">});
    const submitMatchResult = useMutation(api.match_results.submitMatchResult);
    const resolveMatchDispute = useMutation(api.match_results.resolveMatchDispute);

    if (!tournamentId) {
        return <div>Invalid Tournament ID</div>;
    }

    if (!tournamentQuery || !playersInTournamentQuery || !playerDetailsQuery || !matchResults) {
        return <div>Loading...</div>;
    }

    if ('error' in tournamentQuery || 'error' in playersInTournamentQuery || 'error' in playerDetailsQuery || 'error' in matchResults) {
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

    const bracket = [
        {
            match: 1,
            label: "Semi Final 1",
            player1: playersInTournament[0] || null,
            player2: playersInTournament[1] || null,
            winner: null
        },
        {
            match: 2,
            label: "Semi Final 2",
            player1: playersInTournament[2] || null,
            player2: playersInTournament[3] || null,
            winner: null
        },
        {match: 3, label: "Grand Final", player1: null, player2: null, winner: null},
    ];

    const handleOpenSubmitModal = (match: Match) => {
        setSelectedMatch(match);
        setIsSubmitModalOpen(true);
    };

    const handleOpenReviewModal = (match: Match) => {
        setSelectedMatch(match);
        setIsReviewModalOpen(true);
    };

    const handleSubmitResult = async (winner: string) => {
        if (!selectedMatch) return;
        if (!selectedMatch.player1 || !selectedMatch.player2) {
            console.error("Cannot submit result: Missing player information");
            return;
        }
        if (!currentUserId) {
            console.error("Cannot submit result: User not authenticated");
            return;
        }

        const player1Name = getPlayerName(selectedMatch.player1);
        const player2Name = getPlayerName(selectedMatch.player2);
        const winnerUserId = winner === player1Name ? selectedMatch.player1.userId : selectedMatch.player2.userId;

        try {
            await submitMatchResult({
                tournamentId: tournamentId as Id<"tournaments">,
                matchId: `match-${selectedMatch.match}`,
                player1UserId: selectedMatch.player1.userId,
                player2UserId: selectedMatch.player2.userId,
                winnerUserId,
                submittedBy: currentUserId,
            });
            console.log(`Result submitted for ${selectedMatch.label} by ${currentUserId}`);
            setIsSubmitModalOpen(false);
        } catch (error) {
            console.error("Failed to submit match result:", error);
        }
    };

    const handleResolveDispute = async (winnerUserId: string) => {
        if (!selectedMatch) return;
        if (!selectedMatch.player1 || !selectedMatch.player2) {
            console.error("Cannot resolve dispute: Missing player information");
            return;
        }
        if (!currentUserId) {
            console.error("Cannot resolve dispute: User not authenticated");
            return;
        }

        try {
            await resolveMatchDispute({
                tournamentId: tournamentId as Id<"tournaments">,
                matchId: `match-${selectedMatch.match}`,
                winnerUserId,
                submittedBy: currentUserId,
            });
            console.log(`Dispute resolved for ${selectedMatch.label} by ${currentUserId}`);
            setIsReviewModalOpen(false);
        } catch (error) {
            console.error("Failed to resolve dispute:", error);
        }
    };

    const getPlayerName = (player: { userId: string; status?: string } | null): string | null => {
        if (!player) return null;
        const ign = playerIgnMap.get(player.userId) || 'Unknown Player';
        return status === "pending" ? `${ign} (pending)` : ign;
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
            const winnerIgn = playerIgnMap.get(result.winnerUserId) || 'Unknown Player';
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
            player1Submission: result.player1Submission ? playerIgnMap.get(result.player1Submission) || 'Unknown' : null,
            player2Submission: result.player2Submission ? playerIgnMap.get(result.player2Submission) || 'Unknown' : null,
        };
    };

    return (
        <div>
            <div
                className="min-h-screen text-white bg-[url(/assets/images/bg/view-tournament-bg.jpg)] bg-cover bg-left">
                <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[100px] mx-auto"}>
                    <div className={"w-full flex flex-col items-center justify-center"}>
                        {tournament.gameTitle === "mortal-kombat" &&
                            <Image src={mk} alt={"mortal kombat"} width={2000} height={2000} className={"w-[700px]"}/>}
                        {tournament.gameTitle === "street-fighter" &&
                            <Image src={sf} alt={"street fighter"} width={2000} height={2000} className={"w-[700px]"}/>}
                        {tournament.gameTitle === "injustice" &&
                            <Image src={injustice} alt={"injustice"} width={2000} height={2000}
                                   className={"w-[700px]"}/>}
                        {tournament.gameTitle === "tekken" &&
                            <Image src={tekken} alt={"tekken"} width={2000} height={2000} className={"w-[700px]"}/>}
                        <div className={"flex gap-x-5 items-center"}>
                            <div className={"text-[40px]"}>{tournament.tournamentName} - <span
                                className={"text-theme-crimson"}>Semi Finals</span></div>
                        </div>
                    </div>

                    <div className={"mt-16 max-w-[1300px] mx-auto"}>
                        {/* Semi-finals matches in a row */}
                        <div className="flex justify-between gap-5">
                            {bracket.slice(0, 2).map((match, index) => (
                                <div key={index}
                                     className="border border-theme-crimson bg-black/40 backdrop-blur-lg p-[40px] rounded-lg flex-1 h-[340px] flex flex-col">
                                    <h2 className="text-[26px] font-semibold text-center">{match.label}</h2>
                                    <div className="flex justify-between items-center w-full relative flex-1">
                                        <div className={"text-[20px] w-[37%] text-center"}>
                                            {match.player1 ? playerIgnMap.get(match.player1.userId) || 'Unknown Player' :
                                                <span
                                                    className="text-muted-white text-[20px]">Waiting for player...</span>}
                                        </div>
                                        <div className={"absolute w-full flex justify-center h-full items-center"}>
                                            <Image src={"/assets/images/versus/vs.png"} alt={"vs"} height={150}
                                                   width={150}/>
                                        </div>
                                        <div className={"text-[20px] w-[37%] text-center"}>
                                            {match.player2 ? playerIgnMap.get(match.player2.userId) || 'Unknown Player' :
                                                <span
                                                    className="text-muted-white text-[20px]">Waiting for player...</span>}
                                        </div>
                                    </div>

                                    <div className="text-center text-[16px] mt-4">{getMatchStatus(match)}</div>
                                    {isCurrentUserParticipant(match) && (
                                        <div className={"w-full mt-4"}>
                                            <Button
                                                className={"w-full"}
                                                variant={"secondary"}
                                                onClick={() => handleOpenSubmitModal(match)}
                                                disabled={hasUserSubmittedResult(match)}
                                            >
                                                {hasUserSubmittedResult(match) ? "Match Results Submitted" : "Submit Match Results"}
                                            </Button>
                                        </div>
                                    )}
                                    {isTournamentOrganizer && getMatchStatus(match) === "Results in Dispute" && (
                                        <div className={"w-full mt-4"}>
                                            <Button
                                                className={"w-full"}
                                                variant={"secondary"}
                                                onClick={() => handleOpenReviewModal(match)}
                                            >
                                                Resolve Dispute
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Final match at the bottom */}
                        <div className="mt-5">
                            <div
                                className="border border-theme-crimson bg-black/40 backdrop-blur-lg p-[40px] rounded-lg flex-1 h-[340px] flex flex-col">
                                <h2 className="text-[26px] font-semibold text-center">{bracket[2].label}</h2>
                                <div className="flex justify-between items-center w-full relative flex-1">
                                    <div className={"text-[20px] w-[37%] text-center"}>
                                        {bracket[2].player1 ? playerIgnMap.get(bracket[2].player1.userId) || 'Unknown Player' :
                                            <span className="text-muted-white text-[20px]">Waiting for player...</span>}
                                    </div>
                                    <div className={"absolute w-full flex justify-center h-full items-center"}><Image
                                        src={"/assets/images/versus/vs.png"} alt={"vs"} height={150} width={150}/></div>
                                    <div className={"text-[20px] w-[37%] text-center"}>
                                        {bracket[2].player2 ? playerIgnMap.get(bracket[2].player2.userId) || 'Unknown Player' :
                                            <span className="text-muted-white text-[20px]">Waiting for player...</span>}
                                    </div>
                                </div>
                                <div className="text-center text-[16px] mt-4">{getMatchStatus(bracket[2])}</div>
                                {isCurrentUserParticipant(bracket[2]) && (
                                    <div className={"w-full mt-4"}>
                                        <Button
                                            className={"w-full"}
                                            variant={"secondary"}
                                            onClick={() => handleOpenSubmitModal(bracket[2])}
                                            disabled={hasUserSubmittedResult(bracket[2])}
                                        >
                                            {hasUserSubmittedResult(bracket[2]) ? "Match Results Submitted" : "Submit Match Results"}
                                        </Button>
                                    </div>
                                )}
                                {isTournamentOrganizer && getMatchStatus(bracket[2]) === "Results in Dispute" && (
                                    <div className={"w-full mt-4"}>
                                        <Button
                                            className={"w-full"}
                                            variant={"outline"}
                                            onClick={() => handleOpenReviewModal(bracket[2])}
                                        >
                                            Resolve Dispute
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Accordion type="single" collapsible className={"mt-20"}>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>More Details</AccordionTrigger>
                                <AccordionContent>
                                    <TournamentDetails contractAddress={tournament.contractAddress}/>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </div>
                </div>

                {/* Submit Match Results Modal */}
                <SubmitMatchResultsModal
                    open={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    matchLabel={selectedMatch?.label || ''}
                    player1={selectedMatch?.player1 ? getPlayerName(selectedMatch.player1) : null}
                    player2={selectedMatch?.player2 ? getPlayerName(selectedMatch.player2) : null}
                    onSubmit={handleSubmitResult}
                />

                {/* Review Dispute Modal */}
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