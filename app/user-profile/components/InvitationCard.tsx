import Image from "next/image";
import mk from "@/public/assets/images/games/mk.png";
import sf from "@/public/assets/images/games/street-fighter.png";
import injustice from "@/public/assets/images/games/injustice.png";
import tekken from "@/public/assets/images/games/tekken.png";
import {InvitationTypes} from "@/types/invitation-types";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
import {useApiMutation} from "@/hooks/use-api-mutation";

type InvitationCardProps = {
    invitationData: InvitationTypes;
}

export function InvitationCard({invitationData}: InvitationCardProps) {
    const tournament = useQuery(api.tournaments.getTournamentById, {tournamentId: invitationData.tournamentId as Id<"tournaments">});
    const user = useQuery(api.players.getPlayerByUserId, {userId: invitationData.userId});
    const {mutate} = useApiMutation(api.tournament_invitations.approveInvitation);

    const handleApprove = async () => {
        try {
            await mutate({invitationId: invitationData._id as Id<"tournamentEntries">});
            alert("Invitation approved successfully!");
        } catch (error) {
            console.error("Error approving invitation:", error);
            alert("Failed to approve the invitation. Please try again.");
        }
    };

    if (!tournament) {
        return <></>
    }

    if (!user) {
        return <></>
    }

    return <div
        className={"w-full rounded-[10px] text-white border border-theme-crimson flex relative bg-[#DA006D]/5"}
    >
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

        <div className={"py-[30px] px-[30px] relative z-10 w-full"}>
            <div className={"font-bold text-white text-[30px]"}>{tournament.tournamentName}</div>
            <div className={"flex gap-x-16"}>
                <div className={"mt-5 flex flex-col gap-y-3"}>
                    <li className={"text-white text-[16px]"}>
                        <span className={"font-semibold"}>User:</span> {user.firstName} {user.lastName}
                    </li>
                    <li className={"text-white text-[16px]"}>
                        <span className={"font-semibold"}>User Id:</span> {user.userId}
                    </li>
                    <li className={"text-white text-[16px]"}>
                        <span className={"font-semibold"}>Email:</span> {user.email}
                    </li>
                </div>
                <div className={"mt-5 flex flex-col gap-y-3"}>
                    <li className={"text-white text-[16px]"}>
                        <span className={"font-semibold"}>Level:</span> {user.level}
                    </li>
                    <li className={"text-white text-[16px]"}>
                        <span className={"font-semibold"}>Game alias/ID:</span> {user.ign}
                    </li>
                </div>
            </div>
            <div className={"w-full flex justify-end mt-10 items-center gap-5"}>
                {invitationData.status === "pending" && <Button onClick={handleApprove}
                                                                className={"font-semibold text-[16px] h-[46px] w-[125px]"}>Approve</Button>}
                <div
                    className={`capitalize h-[46px] rounded-[5px]  border  flex justify-center items-center px-8 font-bold ${invitationData.status === "pending" && "text-yellow-500 bg-yellow-500/10 border-yellow-500"} ${invitationData.status === "approved" && "text-green-500 bg-green-500/10 border-green-500"}`}>
                    {invitationData.status}
                </div>
            </div>
        </div>
    </div>;
}