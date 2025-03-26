import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Doc, Id} from "@/convex/_generated/dataModel";
import {formatDate} from "@/utils/date-formatter";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {Button} from "@/components/ui/button";

type TournamentApprovalCardProps = {
    tournamentData: Doc<"tournaments">;
}

export function TournamentApprovalCard({tournamentData}: TournamentApprovalCardProps) {
    const tournament = useQuery(api.tournaments.getTournamentById, {tournamentId: tournamentData._id as Id<"tournaments">});
    const {mutate} = useApiMutation(api.tournaments.approveTournament)

    const handleApprove = () => {
        try {
            if (tournament) {
                mutate({
                    tournamentId: tournament._id
                })
            }
        } catch (error) {
            console.log("Failed to approve tournament: ", error)
        }
    }

    if (!tournament) {
        return <></>
    }

    return <div
        className={"py-[30px] px-[30px] w-full rounded-[10px] text-white border border-theme-crimson relative bg-black/40"}
    >
        <div
            className={"absolute top-[-75px] right-[50px] z-10 w-[400px] flex justify-center items-center h-[150px] backdrop-blur-lg px-5"}>
            {tournament.gameTitle === "mortal-kombat" &&
                <Image src={mk} alt={"mortal kombat"} width={2000} height={2000} className={"w-full"}/>}
            {tournament.gameTitle === "street-fighter" &&
                <Image src={sf} alt={"street fighter"} width={2000} height={2000} className={"w-full"}/>}
            {tournament.gameTitle === "injustice" &&
                <Image src={injustice} alt={"injustice"} width={2000} height={2000} className={"w-full"}/>}
            {tournament.gameTitle === "tekken" &&
                <Image src={tekken} alt={"tekken"} width={2000} height={2000} className={"w-full mb-5"}/>}
        </div>

        <div
            className={"w-full rounded-[10px] text-white flex relative"}
        >
            <div className={" relative z-10 w-full"}>
                <div className={"font-bold text-white text-[30px]"}>{tournament.tournamentName}</div>
                <div className={"flex gap-x-16"}>
                    <div className={"mt-5 flex flex-col gap-y-3"}>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Tournament Type:</span> {tournament.tournamentType}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Team Size:</span> {tournament.teamSize}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                <span
                                    className={"font-semibold"}>Number of Players:</span> {tournament.numberOfPlayersRequired}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Start Date:</span> {formatDate(tournament.startDate)}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>End Date:</span> {formatDate(tournament.endDate)}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Entry Fee:</span> {tournament.entryFee}
                        </li>
                    </div>
                    <div className={"mt-5 flex flex-col gap-y-3"}>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Payment Method:</span> {tournament.paymentMethod}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Deadline:</span> {formatDate(tournament.deadline)}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Total Prize Pool:</span> {tournament.totalPrizePool}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                <span
                                    className={"font-semibold"}>Prize Distribution:</span> {tournament.prizeDistributionMethod}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Game Mode:</span> {tournament.gameMode}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Stage Selection:</span> {tournament.stageSelection}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                <span
                                    className={"font-semibold"}>Character Selection:</span> {tournament.characterSelectionRules}
                        </li>
                    </div>
                    <div className={"mt-5 flex flex-col gap-y-3"}>
                        <li className={"text-white text-[16px]"}>
                                <span
                                    className={"font-semibold"}>Banned Characters/Items:</span> {tournament.bannedCharactersItems}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                <span
                                    className={"font-semibold"}>Disconnect Policy:</span> {tournament.disconnectPolicy}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Pause/Break Rules:</span> {tournament.pauseBreakRules}
                        </li>
                    </div>
                </div>
            </div>
        </div>
        <div className={"w-full flex justify-end mt-10 items-center gap-5"}>
            <Button onClick={handleApprove} disabled={tournament.isApproved}
                    className={"font-semibold text-[16px] h-[46px] w-[125px]"}>{tournament.isApproved ? "Approved" : "Approve"}</Button>
        </div>
    </div>
}