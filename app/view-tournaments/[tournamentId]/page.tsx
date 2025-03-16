'use client';

import {useParams} from 'next/navigation';
import {useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';
import {Id} from "@/convex/_generated/dataModel";
import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {getRemainingDays} from "@/utils/date-formatter";
import {Button} from "@/components/ui/button";

export default function TournamentInfo() {
    const params = useParams();
    const {tournamentId} = params;

    // Fetch tournament details
    const tournamentQuery = useQuery(api.tournaments.getTournamentById, {tournamentId: tournamentId as Id<"tournaments">});

    // Fetch players in the tournament
    const playersInTournamentQuery = useQuery(api.tournament_entries.getPlayersInTournament, {tournamentId: tournamentId as Id<"tournaments">});

    // Fetch player details for each player in the tournament
    const playerDetailsQuery = useQuery(api.players.getPlayersByUserIds, {
        userIds: playersInTournamentQuery?.map(player => player.userId) || []
    });

    if (!tournamentId) {
        return <div>Invalid Tournament ID</div>;
    }

    if (!tournamentQuery || !playersInTournamentQuery || !playerDetailsQuery) {
        return <div>Loading...</div>;
    }

    if ('error' in tournamentQuery || 'error' in playersInTournamentQuery || 'error' in playerDetailsQuery) {
        return <div>Error loading tournament details.</div>;
    }

    const tournament = tournamentQuery;
    const playersInTournament = playersInTournamentQuery;
    const playerDetails = playerDetailsQuery;

    // Create a map of userId to ign for easy lookup
    const playerIgnMap = new Map<string, string>();
    playerDetails.forEach((player) => {
        if (player) {
            playerIgnMap.set(player.userId, player.ign);
        }
    });

    // Create the bracket with placeholders if players are missing
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
        {match: 3, label: "Grand Final", player1: null, player2: null, winner: null}, // Final match
    ];

    return (
        <div className="min-h-screen text-white bg-[url(/assets/images/bg/view-tournament-bg.jpg)] bg-cover bg-left">
            <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[100px] mx-auto"}>
                <div className={"w-full flex flex-col items-center justify-center"}>
                    {tournament.gameTitle === "mortal-kombat" &&
                        <Image src={mk} alt={"mortal kombat"} width={2000} height={2000} className={"w-[700px]"}/>}
                    {tournament.gameTitle === "street-fighter" &&
                        <Image src={sf} alt={"street fighter"} width={2000} height={2000} className={"w-[700px]"}/>}
                    {tournament.gameTitle === "injustice" &&
                        <Image src={injustice} alt={"injustice"} width={2000} height={2000} className={"w-[700px]"}/>}
                    {tournament.gameTitle === "tekken" &&
                        <Image src={tekken} alt={"tekken"} width={2000} height={2000} className={"w-[700px]"}/>}
                    <div className={"flex gap-x-5 items-center"}>
                        <div className={"text-[40px]"}>{tournament.tournamentName} - <span
                            className={"text-theme-crimson"}>Semi Finals</span></div>
                    </div>
                    <div className={"text-white font-bold italic text-[20px]"}>
                        Tournament Begins in <span
                        className={"text-theme-crimson"}>{getRemainingDays(tournament.deadline)} Days.</span>
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
                                        {match.player1 ?
                                            (playerIgnMap.get(match.player1.userId) || 'Unknown Player') +
                                            (playersInTournament.find(p => p.userId === match.player1.userId)?.status === "pending" ? " (pending)" : "")
                                            :
                                            <span className="text-muted-white text-[20px]">Waiting for player...</span>}
                                    </div>
                                    <div className={"absolute w-full flex justify-center h-full items-center"}><Image
                                        src={"/assets/images/versus/vs.png"} alt={"vs"} height={150} width={150}/></div>
                                    <div className={"text-[20px] w-[37%] text-center"}>
                                        {match.player2 ?
                                            (playerIgnMap.get(match.player2.userId) || 'Unknown Player') +
                                            (playersInTournament.find(p => p.userId === match.player2.userId)?.status === "pending" ? " (pending)" : "")
                                            :
                                            <span className="text-muted-white text-[20px]">Waiting for player...</span>}
                                    </div>
                                </div>
                                <div className={"w-full mt-8"}><Button className={"w-full"} variant={"secondary"}>Submit
                                    Match Results</Button></div>
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
                            <div className={"w-full mt-8"}><Button className={"w-full"} variant={"secondary"}>Submit
                                Match Results</Button></div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}