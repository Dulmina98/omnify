import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {formatDate, getRemainingDays} from "@/utils/date-formatter";
import {Button} from "@/components/ui/button";
import {Tournament} from "@/types/tournaments-type";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {api} from "@/convex/_generated/api";
import {useCurrentUser} from "@/services/user-service";
import {useQuery} from "convex/react";
import Link from "next/link";

type JoinTournamentCardProps = {
    tournament: Tournament
}

export function JoinTournamentCard({tournament}: JoinTournamentCardProps) {
    const {mutate} = useApiMutation(api.tournament_entries.enterTournament);
    const {user, role} = useCurrentUser();

    const allParticipants = useQuery(
        api.tournament_entries.getPlayersInTournament,
        {tournamentId: tournament._id}
    );

    const handleJoinPress = async () => {
        try {
            if (!user) {
                console.error("User is not signed in.");
                return;
            }

            if (role !== "player") {
                console.log("Only players can joined to the tournaments");
                return;
            }

            mutate({
                tournamentId: tournament._id,
                userId: user.userId,
            }).then(() => {
                console.log("Player joined to tournament successfully!")
            })
        } catch (error) {
            console.log(error)
        }
    }

    return <div
        className={"w-full rounded-[10px] text-white border border-theme-crimson flex relative bg-black/40"}
    >
        {/* Game Banner */}
        <div
            className={"absolute top-[-75px] right-[50px] z-0 w-[400px] flex justify-center items-center h-[150px] backdrop-blur-lg px-5"}>
            {tournament.gameTitle === "Mortal Kombat 1" &&
                <Image src={mk} alt={"mortal kombat"} width={2000} height={2000} className={"w-full"}/>}
            {tournament.gameTitle === "Street Fighter 6" &&
                <Image src={sf} alt={"street fighter"} width={2000} height={2000} className={"w-full"}/>}
            {tournament.gameTitle === "Injustice 2" &&
                <Image src={injustice} alt={"injustice"} width={2000} height={2000} className={"w-full"}/>}
            {tournament.gameTitle === "Tekken 8" &&
                <Image src={tekken} alt={"tekken"} width={2000} height={2000} className={"w-full mb-5"}/>}
        </div>

        {/* Tournament Details */}
        <div className={"py-[30px] px-[30px] relative z-10 w-full"}>
            {/* Tournament Name */}
            <div className={"font-bold text-white text-[30px]"}>{tournament.tournamentName}</div>

            {/* Tournament Description */}
            <div className={"text-muted-white text-[16px] mt-4"}>{tournament.description}</div>

            <div className={"flex justify-between mt-8"}>
                {/* Basic Info Section */}
                <div className={"my-5"}>
                    <div className={"text-white text-[20px] font-semibold mb-3"}>Basic Info</div>
                    <div className={"flex flex-col gap-y-2"}>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Game:</span> {tournament.gameTitle}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Start Date:</span> {formatDate(tournament.startDate)}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>End Date:</span> {formatDate(tournament.endDate)}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Tournament Type:</span> {tournament.tournamentType}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Team Size:</span> {tournament.teamSize}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Players Required:</span> {tournament.numberOfPlayersRequired}
                        </li>
                    </div>
                </div>


                {/* Entry Requirements Section */}
                <div className={"my-5"}>
                    <div className={"text-white text-[20px] font-semibold mb-3"}>Entry Requirements</div>
                    <div className={"flex flex-col gap-y-2"}>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Entry Fee:</span> {tournament.entryFee}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Payment Method:</span> {tournament.paymentMethod}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Deadline:</span> {formatDate(tournament.deadline)}
                        </li>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Minimum Level:</span> {tournament.minLevel}
                        </li>
                    </div>
                </div>

                {/* Prize Pool & Distribution Section */}
                <div className={"my-5"}>
                    <div className={"text-white text-[20px] font-semibold mb-3"}>Prize Pool & Distribution</div>
                    <div className={"flex flex-col gap-y-2"}>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Total Prize Pool:</span> {tournament.totalPrizePool}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Prize Distribution:</span> {tournament.prizeDistributionMethod}
                        </li>
                    </div>
                </div>

                {/* Match Rules & Settings Section */}
                <div className={"my-5"}>
                    <div className={"text-white text-[20px] font-semibold mb-3"}>Match Rules & Settings</div>
                    <div className={"flex flex-col gap-y-2"}>
                        <li className={"text-white text-[16px]"}>
                            <span className={"font-semibold"}>Game Mode:</span> {tournament.gameMode}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Stage Selection:</span> {tournament.stageSelection}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Character Selection Rules:</span> {tournament.characterSelectionRules}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Banned Characters/Items:</span> {tournament.bannedCharactersItems}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Disconnect Policy:</span> {tournament.disconnectPolicy}
                        </li>
                        <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Pause/Break Rules:</span> {tournament.pauseBreakRules}
                        </li>
                    </div>
                </div>
            </div>

            {/* Join Button */}
            <div className={"w-full flex justify-end mt-16 items-center gap-10"}>
                <div className={"text-theme-crimson font-bold italic text-[20px]"}>
                    {(tournament.numberOfPlayersRequired - (allParticipants?.length ?? 0))} seats left.&nbsp;
                    {getRemainingDays(tournament.deadline)} days left. Hurry Up!
                </div>
                <Link href={`/view-tournaments/${tournament._id}`}>
                    <Button className="text-[16px]">View Tournament</Button>
                </Link>
                {!allParticipants?.some(participant => participant.userId === user?.userId) && (
                    <Button
                        className={"text-[16px]"}
                        onClick={handleJoinPress}
                        disabled={(allParticipants?.length || 0) >= tournament.numberOfPlayersRequired}
                    >
                        Join Tournament
                    </Button>
                )}
                {allParticipants?.some(participant => participant.userId === user?.userId) && (
                    <Link href={"/user-profile"}>
                        <Button
                            className={"text-[16px]"}
                        >
                            View Status
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    </div>;
}