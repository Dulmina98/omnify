import {useCurrentUser} from "@/services/user-service";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Tournament} from "@/types/tournaments-type";
import {DashboardTournamentCard} from "@/app/user-profile/components/dashboard-tournament-card";

export function Dashboard() {
    const {user} = useCurrentUser();

    const userTournamentsWithStatus = useQuery(
        api.tournament_participants.getPlayerTournamentsWithStatus,
        {userId: user ? user.userId : "skip"}
    );

    if (!userTournamentsWithStatus) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {userTournamentsWithStatus.map((tournament, index) => (
                <div key={index} className="mt-20">
                    <DashboardTournamentCard tournament={tournament as Tournament} status={tournament.status}/>
                </div>
            ))}
        </div>
    );
}