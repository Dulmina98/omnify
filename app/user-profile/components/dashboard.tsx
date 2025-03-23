import {useCurrentUser} from "@/services/user-service";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {TabBar} from "@/app/components/tab-bar/tab-bar";
import {useState} from "react";
import {TournamentApprovalCard} from "@/app/user-profile/components/TournamentApprovalCard";

const tabs = [
    {name: "Pending"},
    {name: "Approved"},
];

export function Dashboard() {
    const {user, role} = useCurrentUser();
    const [activeTab, setActiveTab] = useState("Pending");
    const approvedTournaments = useQuery(api.tournaments.getApprovedTournaments)
    const notApprovedTournaments = useQuery(api.tournaments.getNotApprovedTournaments)


    return (
        <div>
            {/*<DashboardTournamentCard tournament={tournament as Tournament} status={tournament.status}
                                     transactionId={tournament.transactionId}/>*/}
            {role === "admin" && <div className={"mt-10"}>
                <TabBar
                    tabs={tabs}
                    initialActiveTab="Pending"
                    onTabChange={(tabName) => setActiveTab(tabName)}
                />
                {activeTab === "Pending" && <div className={"mt-20 flex flex-col gap-y-8 pb-20"}>
                    {notApprovedTournaments && notApprovedTournaments.length > 0 ? (
                        notApprovedTournaments.map((tournament, index) => (
                            <TournamentApprovalCard tournamentData={tournament} key={index}/>
                        ))
                    ) : (
                        <div className="text-center text-muted-white py-40">No pending invitations</div>
                    )}
                </div>}
                {activeTab === "Approved" && <div className={"mt-20 flex flex-col gap-y-8 pb-20"}>
                    {approvedTournaments && approvedTournaments.length > 0 ? (
                        approvedTournaments.map((tournament, index) => (
                            <TournamentApprovalCard tournamentData={tournament} key={index}/>
                        ))
                    ) : (
                        <div className="text-center text-muted-white py-40">No approved invitations</div>
                    )}
                </div>}
            </div>}

        </div>
    );
}