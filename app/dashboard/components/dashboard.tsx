import {useCurrentUser} from "@/services/user-service";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {DashboardTournamentCard} from "@/app/dashboard/components/dashboard-tournament-card";

export function Dashboard() {
    const {user, role} = useCurrentUser();

    const tournaments = useQuery(
        role === "organizer"
            ? api.tournaments.getOrganizerTournaments
            : api.tournaments.getUserTournaments,
        {userId: user ? user.userId : "skip"}
    );

    return (
        <div className={"mt-12"}>
            <h1>
                {role === "organizer"
                    ? "Tournaments You Created"
                    : "Tournaments You Participated In"}
            </h1>
            <div>
                {tournaments && tournaments.length > 0 ? (
                    [...tournaments].reverse().map((tournament) => (
                        <DashboardTournamentCard
                            key={tournament._id}
                            tournament={tournament}
                            role={role}
                        />
                    ))
                ) : (
                    <p>No tournaments found.</p>
                )}
            </div>
        </div>
    );
}