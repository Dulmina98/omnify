'use client';

import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import mk from "@/public/assets/images/games/mk.jpg"
import sf from "@/public/assets/images/games/street-fighter.jpg"
import injustice from "@/public/assets/images/games/injustice.png"
import tekken from "@/public/assets/images/games/tekken.png"
import Image from "next/image";

export default function JoinTournemnt() {
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
                <div className={"w-full overflow-hidden rounded-[5px] text-white border border-theme-crimson flex relative h-[400px]"} key={index}>
                    <div className={"absolute top-0 left-0 z-0 w-[60%] h-full"}>
                        {tournament.gameTitle === "Mortal Kombat 1" && <Image src={mk} alt={"mortal kombat"} width={2000} height={2000} className={"w-full opacity-30"}/>}
                        {tournament.gameTitle === "Street Fighter 6" && <Image src={sf} alt={"street fighter"} width={2000} height={2000} className={"w-full opacity-30"}/>}
                        {tournament.gameTitle === "Injustice 2" && <Image src={injustice} alt={"injustice"} width={2000} height={2000} className={"w-full opacity-30"}/>}
                        {tournament.gameTitle === "Tekken 8" && <Image src={tekken} alt={"tekken"} width={2000} height={2000} className={"w-full opacity-30"}/>}
                    </div>
                    <div className={"py-[30px] px-[30px] relative z-10"}>
                        <div>{tournament.tournamentName}</div>
                        <div></div>
                    </div>
                </div>
            ))}
        </div>
    )
}