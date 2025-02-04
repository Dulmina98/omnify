import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";

export const useCurrentUser = () => {
    const {user, isLoaded, isSignedIn} = useUser();
    const userId = user?.id;

    // Fetch player, organizer, and admin data
    const player = useQuery(api.players.getPlayerByUserId, userId ? {userId} : 'skip');
    const organizer = useQuery(api.organizers.getOrganizerByUserId, userId ? {userId} : 'skip');
    const admin = useQuery(api.admins.getAdminByUserId, userId ? {userId} : 'skip');

    // Ensure everything is loaded
    if (!isLoaded || (userId && player === undefined && organizer === undefined && admin === undefined)) {
        return {user: null, isLoaded: false, isSignedIn: false, role: null};
    }

    // Determine the user role
    let role: "admin" | "player" | "organizer" | null = null;
    let userData = null;

    if (admin) {
        role = "admin";
        userData = admin;
    } else if (player) {
        role = "player";
        userData = player;
    } else if (organizer) {
        role = "organizer";
        userData = organizer;
    }

    return {
        user: userData,
        isLoaded: true,
        isSignedIn: !!userData,
        role,
    };
};
