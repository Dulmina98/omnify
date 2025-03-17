import {useEffect, useState} from "react";
import {BrowserProvider, Signer} from "ethers";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";

export const useEthereum = (userId: string | undefined, role: string | undefined | null) => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);
    const [walletError, setWalletError] = useState<string | null>(null);
    const {address, isConnected} = useAccount();
    const {connect, connectors} = useConnect();
    const {disconnect} = useDisconnect();

    const updatePlayerWallet = useMutation(api.players.updatePlayerWallet);
    const updateOrganizerWallet = useMutation(api.organizers.updateOrganizerWallet);
    const savedPlayerWalletId = useQuery(api.players.getPlayerWalletId, userId ? {userId} : "skip");
    const savedOrganizerWalletId = useQuery(api.organizers.getOrganizerWalletId, userId ? {userId} : "skip");

    const savedWalletId = role === "player" ? savedPlayerWalletId : role === "organizer" ? savedOrganizerWalletId : null;

    useEffect(() => {
        if (isConnected && window.ethereum) {
            const web3Provider = new BrowserProvider(window.ethereum);
            setProvider(web3Provider);

            web3Provider.getSigner().then((signer: Signer) => {
                setSigner(signer);
            });

            if (address && userId && role) {
                if (savedWalletId) {
                    if (savedWalletId.toLowerCase() !== address.toLowerCase()) {
                        setWalletError("Incorrect wallet address. Please connect the wallet matching your saved address.");
                        disconnect();
                        return;
                    }
                    setWalletError(null);
                } else {
                    const updateWallet = async () => {
                        try {
                            if (role === "player") {
                                await updatePlayerWallet({userId, walletId: address});
                            } else if (role === "organizer") {
                                await updateOrganizerWallet({userId, walletId: address});
                            }
                        } catch (error: any) {
                            setWalletError("Failed to save wallet address: " + error.message);
                        }
                    };
                    updateWallet();
                }
            }
        } else {
            setProvider(null);
            setSigner(null);
            setWalletError(null);
        }
    }, [isConnected, address, userId, role, savedWalletId, updatePlayerWallet, updateOrganizerWallet, disconnect]);

    const connectWallet = () => {
        if (connectors.length > 0) {
            connect({connector: connectors[0]});
        }
    };

    const disconnectWallet = () => {
        disconnect();
    };

    return {
        provider,
        signer,
        address,
        isConnected,
        connectWallet,
        disconnectWallet,
        walletError,
    };
};