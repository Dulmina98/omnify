'use client';

import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {JoinTournamentCard} from "@/app/join-tournament/components/join-tournament-card";
import {Tournament} from "@/types/tournaments-type";

export default function JoinTournament() {
    const allTournaments = useQuery(api.tournaments.getAllTournaments);

    return(
        <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] py-[150px]"}>
            <div className={"text-[64px] text-white text-center w-full"}>
                <span className={"text-theme-crimson"}>Battle</span> for Glory
            </div>
            <div className={"text-white text-center text-[32px] max-w-[675px] w-full mx-auto mb-[140px]"}>
                Join the ultimate blockchain-powered tournaments and rise to the top!
            </div>
            {allTournaments?.map((tournament, index) => (
                <JoinTournamentCard key={index} tournament={tournament as Tournament}/>
            ))}
        </div>
    )
}