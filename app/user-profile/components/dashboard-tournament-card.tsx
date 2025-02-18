import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {Tournament} from "@/types/tournaments-type";
import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {getRemainingDays} from "@/utils/date-formatter";
import {Button} from "@/components/ui/button";
import {useTournamentPayment} from "@/hooks/use-tournament-payment";

type JoinTournamentCardProps = {
    tournament: Tournament
    status: string;
    paymentStatus: boolean
}

export function DashboardTournamentCard({tournament, status, paymentStatus}: JoinTournamentCardProps) {
    const allParticipants = useQuery(
        api.tournament_entries.getPlayersInTournament,
        {tournamentId: tournament._id}
    );
    const {payEntryFee, isLoading, isSuccess, hasPaid} = useTournamentPayment(
        tournament._id,
        tournament.entryFee
    )

    const handlePay = async () => {
        try {
            await payEntryFee?.()
        } catch (error) {
            console.error('Payment error:', error)
        }
    }

    return <div
        className={"w-full rounded-[10px] text-white border border-theme-crimson flex relative bg-black/30 backdrop-blur-lg"}
    >
        <div
            className="absolute top-[-75px] right-[50px] z-0 w-[400px] flex justify-center items-center h-[150px] px-5">
            {tournament.gameTitle === "mortal-kombat" && (
                <Image src={mk} alt="mortal kombat" width={2000} height={2000} className="w-full image-border"/>
            )}
            {tournament.gameTitle === "street-fighter" && (
                <Image src={sf} alt="street fighter" width={2000} height={2000} className="w-full image-border"/>
            )}
            {tournament.gameTitle === "injustice" && (
                <Image src={injustice} alt="injustice" width={2000} height={2000} className="w-full image-border"/>
            )}
            {tournament.gameTitle === "tekken" && (
                <Image src={tekken} alt="tekken" width={2000} height={2000} className="w-full mb-5 image-border"/>
            )}
        </div>


        <div className={"py-[30px] px-[30px] relative z-10 w-full text-white"}>
            <div className={"font-bold text-white text-[30px]"}>{tournament.tournamentName}</div>
            <div className={"text-muted-white text-[16px] mt-4"}>{tournament.description}</div>
            <div className={"w-full flex justify-between mt-16 items-center gap-10"}>
                <div className={"flex items-center gap-x-5"}>
                    <div>
                        Available seats: {(tournament.numberOfPlayersRequired - (allParticipants?.length ?? 0))}
                    </div>
                    <div>
                        Remaining days: {getRemainingDays(tournament.deadline)}
                    </div>
                </div>
                <div className={"flex gap-x-5"}>
                    {paymentStatus && <div
                        className={`capitalize h-[46px] rounded-[5px]  border  flex justify-center items-center px-8 font-bold text-green-500 bg-green-500/10 border-green-500`}>
                        Entry Confirmed
                    </div>}
                    {paymentStatus && <div>Entry Confirmed</div>}
                    {!hasPaid && !paymentStatus && (
                        <Button
                            className={"font-semibold text-[16px] h-[46px]"}
                            onClick={handlePay}
                            disabled={status !== "approved" || isLoading}
                        >
                            {isLoading ? 'Processing...' : `Pay ${tournament.entryFee} ETH`}
                        </Button>
                    )}
                    {!paymentStatus && !isLoading && <div>Payment pending confirmation...</div>}
                    <div
                        className={`capitalize h-[46px] rounded-[5px]  border  flex justify-center items-center px-8 font-bold ${status === "pending" && "text-yellow-500 bg-yellow-500/10 border-yellow-500"} ${status === "approved" && "text-green-500 bg-green-500/10 border-green-500"}`}>
                        {status}
                    </div>
                </div>
            </div>
        </div>
    </div>;
}