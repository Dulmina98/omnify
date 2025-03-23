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

    const isPlayer = !!player;
    const isOrganizer = !!organizer;
    const hasWalletId =
        (isPlayer && player?.walletId !== undefined && player?.walletId !== null) ||
        (isOrganizer && organizer?.walletId !== undefined && organizer?.walletId !== null);

    const isLoading = !isLoaded || player === undefined || organizer === undefined;

    const shouldOpenModal = (isPlayer || isOrganizer) && !hasWalletId;

    return {
        isSignedIn,
        isLoading,
        hasWalletId,
        shouldOpenModal,
        userId: user?.id,
        isPlayer,
        isOrganizer,
    };
}