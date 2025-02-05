import {useCurrentUser} from "@/services/user-service";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Tournament} from "@/types/tournaments-type";
import {DashboardTournamentCard} from "@/app/user-profile/components/dashboard-tournament-card";
import {TabBar} from "@/app/components/tab-bar/tab-bar";
import {useState} from "react";
import {InvitationCard} from "@/app/user-profile/components/InvitationCard";

const tabs = [
    {name: "Pending"},
    {name: "Approved"},
];

export function Dashboard() {
    const {user, role} = useCurrentUser();
    const [activeTab, setActiveTab] = useState("Pending");
    const userTournamentsWithStatus = useQuery(
        api.tournament_entries.getPlayerTournamentsWithStatusAndPayment,
        {userId: user ? user.userId : "skip"}
    );
    const allPendingInvitations = useQuery(api.tournament_entries.getAllPendingTournamentEntries);
    const allApprovedInvitations = useQuery(api.tournament_entries.getAllApprovedTournamentEntries);

    if (!userTournamentsWithStatus) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {role === "player" && userTournamentsWithStatus.map((tournament, index) => (
                <div key={index} className="mt-20">
                    <DashboardTournamentCard tournament={tournament as Tournament} status={tournament.status}
                                             paymentStatus={tournament.paymentStatus}/>
                </div>
            ))}
            {role === "admin" && <div className={"mt-10"}>
                <TabBar
                    tabs={tabs}
                    initialActiveTab="Pending"
                    onTabChange={(tabName) => setActiveTab(tabName)}
                />
                {activeTab === "Pending" && <div className={"mt-20 flex flex-col gap-y-8 pb-20"}>
                    {allPendingInvitations && allPendingInvitations.length > 0 ? (
                        allPendingInvitations.map((invitation, index) => (
                            <InvitationCard invitationData={invitation} key={index}/>
                        ))
                    ) : (
                        <div className="text-center text-muted-white py-40">No pending invitations</div>
                    )}
                </div>}
                {activeTab === "Approved" && <div className={"mt-20 flex flex-col gap-y-8 pb-20"}>
                    {allApprovedInvitations && allApprovedInvitations.length > 0 ? (
                        allApprovedInvitations.map((invitation, index) => (
                            <InvitationCard invitationData={invitation} key={index}/>
                        ))
                    ) : (
                        <div className="text-center text-muted-white py-40">No approved invitations</div>
                    )}
                </div>}
            </div>}
        </div>
    );
}