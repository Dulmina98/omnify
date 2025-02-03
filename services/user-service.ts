import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";

export const useCurrentUser = () => {
    const {user, isLoaded, isSignedIn} = useUser();
    const userId = user?.id;

    // Fetch player and organizer data
    const player = useQuery(api.players.getPlayerByUserId, userId ? {userId} : 'skip');
    const organizer = useQuery(api.organizers.getOrganizerByUserId, userId ? {userId} : 'skip');

    // Ensure everything is loaded
    if (!isLoaded || (userId && player === undefined && organizer === undefined)) {
        return {user: null, isLoaded: false, isSignedIn: false};
    }

    // Prioritize player if available, otherwise return organizer
    const userData = player || organizer || null;

    return {
        user: userData,
        isLoaded: true,
        isSignedIn: !!userData,
    };
};