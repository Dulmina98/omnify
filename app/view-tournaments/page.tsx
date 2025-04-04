'use client';

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {ViewTournamentCard} from "@/app/view-tournaments/components/view-tournament-card";
import {Doc} from "@/convex/_generated/dataModel";
import Image from "next/image";

export default function ViewTournaments() {
    const allTournaments = useQuery(api.tournaments.getAllTournaments);

    return (
        <div className="min-h-screen text-white bg-[url(/assets/images/bg/view-tournament-2.jpg)] bg-cover bg-left">
            <div className={"max-w-[1800px] mx-auto w-full px-[25px] lg:px-[100px] py-[150px]"}>
                <div className={"text-[45px] md:text-[64px] text-white text-center w-full"}>
                    <span className={"text-theme-crimson"}>Witness</span> the Clash
                </div>
                <div
                    className={"text-white text-center text-[25px] md:text-[32px] max-w-[675px] w-full mx-auto mb-[140px]"}>
                    Explore epic blockchain battles unfolding now!
                </div>
                {allTournaments && allTournaments?.length > 0 ? (
                    [...allTournaments].reverse().map((tournament, index) => (
                        <ViewTournamentCard key={index} tournament={tournament as Doc<'tournaments'>}/>
                    ))
                ) : (
                    <div
                        className={"w-[600px] mx-auto rounded-[10px] text-white border border-theme-crimson flex relative bg-black/40 mb-20"}
                    >
                        <div className="flex flex-col items-center justify-center gap-6 p-10  mx-auto">
                            <Image src="/assets/images/icons/no-items.png" alt="error" width={50} height={50}
                                   className="mb-2"/>
                            <h3 className="text-[36px] text-theme-crimson">
                                No Battles Yet!
                            </h3>
                            <p className="text-[20px] text-white text-center ">
                                The arena is quiet for now. Stay tuned for epic tournaments coming soon!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}