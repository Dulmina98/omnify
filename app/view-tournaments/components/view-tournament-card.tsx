import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {formatDate} from "@/utils/date-formatter";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Doc} from "@/convex/_generated/dataModel";

type ViewTournamentCardProps = {
    tournament: Doc<'tournaments'>
}

export function ViewTournamentCard({tournament}: ViewTournamentCardProps) {
    return (
        <div
            className={"w-full rounded-[10px] text-white border border-theme-crimson flex relative bg-black/40 mb-20"}
        >
            <div
                className={"absolute top-[-75px] right-[50px] z-0 w-[400px] flex justify-center items-center h-[150px] backdrop-blur-lg px-5"}
            >
                {tournament.gameTitle === "mortal-kombat" &&
                    <Image src={mk} alt={"mortal kombat"} width={2000} height={2000} className={"w-full"}/>}
                {tournament.gameTitle === "street-fighter" &&
                    <Image src={sf} alt={"street fighter"} width={2000} height={2000} className={"w-full"}/>}
                {tournament.gameTitle === "injustice" &&
                    <Image src={injustice} alt={"injustice"} width={2000} height={2000} className={"w-full"}/>}
                {tournament.gameTitle === "tekken" &&
                    <Image src={tekken} alt={"tekken"} width={2000} height={2000} className={"w-full mb-5"}/>}
            </div>
            <div className={"py-[30px] px-[30px] relative z-10 w-full"}>
                <div className={"font-bold text-white text-[30px]"}>{tournament.tournamentName}</div>
                <div className={"text-muted-white text-[16px] mt-4"}>{tournament.description}</div>
                <div className={"flex justify-between mt-8 gap-x-5"}>
                    <div className={"w-1/2 pr-6"}>
                        <div
                            className={"text-theme-crimson text-[24px] font-bold tracking-tight mb-4 uppercase opacity-90"}>
                            Basic Info
                        </div>
                        <div className={"flex flex-col gap-y-3"}>
                            <div className={"text-white text-[16px] flex justify-between items-center"}>
                                <span className={"font-semibold text-whiten"}>Game</span>
                                <span
                                    className={"text-white/90 capitalize"}>{tournament.gameTitle.replace("-", " ")}</span>
                            </div>
                            <div className={"text-white text-[16px] flex justify-between items-center"}>
                                <span className={"font-semibold text-whiten"}>Start Date</span>
                                <span className={"text-white/90"}>{formatDate(tournament.startDate)}</span>
                            </div>
                            <div className={"text-white text-[16px] flex justify-between items-center"}>
                                <span className={"font-semibold text-whiten"}>End Date</span>
                                <span className={"text-white/90"}>{formatDate(tournament.endDate)}</span>
                            </div>
                            <div className={"text-white text-[16px] flex justify-between items-center"}>
                                <span className={"font-semibold text-whiten"}>Type</span>
                                <span className={"text-white/90 capitalize"}>{tournament.tournamentType}</span>
                            </div>
                        </div>
                    </div>
                    <div className={"w-1/2 pl-6"}>
                        <div
                            className={"text-theme-crimson text-[24px] font-bold tracking-tight mb-4 uppercase opacity-90"}>
                            Prize Pool
                        </div>
                        <div className={"flex flex-col gap-y-3"}>
                            <div className={"text-white text-[16px] flex justify-between items-center"}>
                                <span className={"font-semibold text-whiten"}>Total Prize</span>
                                <span className={"text-white/90 capitalize"}>{tournament.totalPrizePool} ETH</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"w-full flex justify-end mt-8 items-center gap-10"}>
                    <Link href={`/view-tournaments/${tournament._id}`}>
                        <Button className="text-[16px]">View Tournament</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}