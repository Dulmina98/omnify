'use client';

import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import {useWallet} from "@/hooks/use-wallet";
import {Loading} from "@/app/components/Loading";

interface ConnectWalletModalProps {
    open: boolean;
    onClose: (walletAddress?: string) => void;
}

export function ConnectWalletModal({open, onClose}: ConnectWalletModalProps) {
    const {connectWallet, address, isConnected} = useWallet();
    const [state, setState] = useState<"idle" | "connecting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleConnect = async () => {
        setState("connecting");
        try {
            await connectWallet();
        } catch (error) {
            setState("error");
            setErrorMessage("Failed to connect wallet. Please try again.");
            console.error(error);
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            setState("success");
        }
    }, [isConnected, address]);

    const handleClose = () => {
        if (state === "success" && address) {
            onClose(address);
        } else {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className="max-w-[700px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Connect Wallet</DialogTitle>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center text-white">
                    {state === "idle" && (
                        <>
                            <Image src="/assets/images/icons/wallet.png" alt="connect wallet" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">
                                Connect <span className="text-theme-crimson">Wallet</span>
                            </div>
                            <div className="mt-2 text-muted-white text-center">
                                Please connect your wallet to continue.
                            </div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={handleConnect}>
                                Connect Wallet
                            </Button>
                        </>
                    )}
                    {state === "connecting" && (
                        <>
                            <Loading/>
                            <div className="text-[40px] text-center">
                                Connecting <span className="text-theme-crimson">Wallet</span>
                            </div>
                            <div className="mt-2 text-muted-white text-center">Please confirm the connection in your
                                wallet...
                            </div>
                        </>
                    )}
                    {state === "success" && (
                        <>
                            <Image src="/assets/images/icons/checked.png" alt="success" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Success!</div>
                            <div className="mt-2 text-muted-white text-center">Wallet connected successfully!</div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={handleClose}>
                                Continue
                            </Button>
                        </>
                    )}
                    {state === "error" && (
                        <>
                            <Image src="/assets/images/icons/failed.png" alt="error" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">
                                Connection <span className="text-theme-crimson">Failed</span>
                            </div>
                            <div
                                className="mt-2 text-muted-white text-center break-words w-full max-w-md">{errorMessage}</div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={handleClose}>
                                Close
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}