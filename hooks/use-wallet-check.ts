"use client";

import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useUser} from "@clerk/nextjs";

export function useWalletCheck() {
    const {user, isSignedIn, isLoaded} = useUser();

    const player = useQuery(
        api.players.getPlayerByUserId,
        user?.id ? {userId: user.id} : "skip"
    );
    const organizer = useQuery(
        api.organizers.getOrganizerByUserId,
        user?.id ? {userId: user.id} : "skip"
    );

    const hasWalletId = (player?.walletId !== undefined && player?.walletId !== null) ||
        (organizer?.walletId !== undefined && organizer?.walletId !== null);
    const isLoading = !isLoaded || player === undefined || organizer === undefined;

    return {
        isSignedIn,
        isLoading,
        hasWalletId,
        userId: user?.id,
        isPlayer: !!player,
        isOrganizer: !!organizer,
    };
}