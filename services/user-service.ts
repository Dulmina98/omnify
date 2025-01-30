// services/userService.ts
import {useQuery} from 'convex/react';
import {useUser} from '@clerk/nextjs';
import {api} from '@/convex/_generated/api';

export const useCurrentUser = () => {
    const {user, isLoaded, isSignedIn} = useUser();
    const userId = user?.id;

    const player = useQuery(api.players.getPlayerByUserId, userId ? {userId} : 'skip');
    const organizer = useQuery(api.organizers.getOrganizerByUserId, userId ? {userId} : 'skip');

    if (!isLoaded) {
        return {user: null, isLoaded: false, isSignedIn: false};
    }

    if (!isSignedIn) {
        return {user: null, isLoaded: true, isSignedIn: false};
    }

    return {
        user: player || organizer,
        isLoaded: true,
        isSignedIn: true,
    };
};