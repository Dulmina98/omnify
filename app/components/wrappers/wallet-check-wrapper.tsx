"use client";

import {useEffect, useState} from "react";
import {useWalletCheck} from "@/hooks/use-wallet-check";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {ConnectWalletModal} from "@/app/components/modals/connect-wallet-modal";

export default function WalletCheckWrapper() {
    const {isSignedIn, isLoading, hasWalletId, shouldOpenModal, userId, isPlayer, isOrganizer} = useWalletCheck();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updatePlayerWallet = useMutation(api.players.updatePlayerWalletId);
    const updateOrganizerWallet = useMutation(api.organizers.updateOrganizerWalletId);

    useEffect(() => {
        if (isSignedIn && !isLoading && shouldOpenModal) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
    }, [isSignedIn, isLoading, shouldOpenModal]);

    const handleWalletConnected = async (walletAddress?: string) => {
        if (!walletAddress || !userId) {
            setIsModalOpen(false);
            return;
        }

        try {
            if (isPlayer) {
                await updatePlayerWallet({
                    userId,
                    walletId: walletAddress,
                });
                console.log("Player wallet updated");
            } else if (isOrganizer) {
                await updateOrganizerWallet({
                    userId,
                    walletId: walletAddress,
                });
                console.log("Organizer wallet updated");
            }
        } catch (error) {
            console.error("Error updating wallet ID:", error);
        } finally {
            setIsModalOpen(false);
        }
    };

    return <ConnectWalletModal open={isModalOpen} onClose={handleWalletConnected} hasWalletId={hasWalletId}/>;
}