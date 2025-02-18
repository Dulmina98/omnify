'use client';

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Tournament} from "@/types/tournaments-type";
import {ViewTournamentCard} from "@/app/view-tournaments/components/view-tournament-card";

export default function ViewTournaments() {
    const allTournaments = useQuery(api.tournaments.getApprovedTournaments);

    return (
        <div className="min-h-screen text-white bg-[url(/assets/images/bg/view-tournament-bg.jpg)] bg-cover bg-left">
            <div className={"max-w-[1800px] mx-auto w-full px-[25px] lg:px-[100px] py-[150px]"}>
                <div className={"text-[64px] text-white text-center w-full"}>
                    <span className={"text-theme-crimson"}>Battle</span> for Glory
                </div>
                <div className={"text-white text-center text-[32px] max-w-[675px] w-full mx-auto mb-[140px]"}>
                    Join the ultimate blockchain-powered tournaments and rise to the top!
                </div>
                {allTournaments?.map((tournament, index) => (
                    <ViewTournamentCard key={index} tournament={tournament as Tournament}/>
                ))}
            </div>
        </div>
    )
}