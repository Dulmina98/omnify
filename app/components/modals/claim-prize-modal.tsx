import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import {getContractWithSigner} from "@/lib/contract";
import {ethers} from "ethers";
import {Doc} from "@/convex/_generated/dataModel";
import {Loading} from "@/app/components/Loading";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {PaymentTypes} from "@/types/payment-types";

interface ClaimPrizeModalProps {
    open: boolean;
    onClose: () => void;
    tournament: Doc<"tournaments">;
    winnerUserId: string;
    winnerWalletId: string;
    winnerIgn: string;
    totalPrizePool: string | number | bigint;
    prizeDistributionMethod: string;
}

export function ClaimPrizeModal({
                                    open,
                                    onClose,
                                    tournament,
                                    winnerUserId,
                                    winnerWalletId,
                                    winnerIgn,
                                    totalPrizePool,
                                    prizeDistributionMethod,
                                }: ClaimPrizeModalProps) {
    const [state, setState] = useState<"idle" | "confirming" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const createTransaction = useMutation(api.transactions.createTransaction);

    const prizePoolInWei = typeof totalPrizePool === "number" && totalPrizePool < 1
        ? ethers.parseEther(totalPrizePool.toString())
        : BigInt(totalPrizePool);

    const handleClaimPrize = async () => {
        try {
            setState("confirming");
            const contract = await getContractWithSigner(tournament.contractAddress);
            const tx = await contract.claimPrize();
            setState("processing");
            const receipt = await tx.wait();

            await createTransaction({
                transactionHash: receipt.transactionHash,
                tournamentId: tournament._id,
                userId: winnerUserId,
                amount: Number(ethers.formatEther(prizePoolInWei)),
                status: "confirmed",
                paymentType: PaymentTypes.PRIZE_DISTRIBUTION,
                blockNumber: receipt.blockNumber,
                fromAddress: tournament.contractAddress,
                toAddress: winnerWalletId,
            });

            setState("success");
        } catch (error: unknown) {
            setState("error");
            const message = error instanceof Error ? error.message : "Failed to claim prize. Please try again.";
            setErrorMessage(message);
        }
    };

    useEffect(() => {
        if (open) {
            setState("idle");
            setErrorMessage("");
        }
    }, [open]);

    if (prizeDistributionMethod === "Top3") {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent
                    className="max-w-[700px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]">
                    <DialogHeader>
                        <VisuallyHidden>
                            <DialogTitle>Claim Prize</DialogTitle>
                        </VisuallyHidden>
                    </DialogHeader>
                    <div className="flex flex-col justify-center items-center text-white">
                        <div className="text-[40px] text-center">
                            Top3 Distribution <span className="text-theme-crimson">Not Supported</span>
                        </div>
                        <div className="mt-2 text-muted-white text-center">
                            This tournament bracket does not support Top3 prize claiming. Only WinnerTakesAll is
                            supported.
                        </div>
                        <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[700px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Claim Prize</DialogTitle>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center text-white">
                    {state === "idle" && (
                        <>
                            <div className="text-[40px] text-center">
                                Claim Your <span className="text-theme-crimson">Prize</span>
                            </div>
                            <div className="mt-4 text-center">Winner: {winnerIgn}</div>
                            <div className="mt-2 text-center">
                                Prize Amount: {ethers.formatEther(prizePoolInWei)} ETH
                            </div>
                            <div className="mt-2 text-center break-all">Your Wallet: {winnerWalletId}</div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={handleClaimPrize}>
                                Claim Prize
                            </Button>
                        </>
                    )}
                    {state === "confirming" && (
                        <>
                            <Image src="/assets/images/icons/payment.png" alt="confirming" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">
                                Confirming <span className="text-theme-crimson">Transaction</span>
                            </div>
                            <div className="mt-2 text-muted-white text-center">
                                Please confirm the transaction in your wallet.
                            </div>
                        </>
                    )}
                    {state === "processing" && (
                        <>
                            <Loading/>
                            <div className="text-[40px] text-center">
                                Processing <span className="text-theme-crimson">Claim</span>
                            </div>
                            <div className="mt-2 text-muted-white text-center">
                                Please wait while the transaction is being processed...
                            </div>
                        </>
                    )}
                    {state === "success" && (
                        <>
                            <Image src="/assets/images/icons/checked.png" alt="success" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Success!</div>
                            <div className="mt-2 text-muted-white text-center">
                                Your prize has been successfully claimed and sent to your wallet.
                            </div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={onClose}>
                                Close
                            </Button>
                        </>
                    )}
                    {state === "error" && (
                        <>
                            <Image src="/assets/images/icons/failed.png" alt="error" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">
                                Claim <span className="text-theme-crimson">Failed</span>
                            </div>
                            <div className="mt-2 text-muted-white text-center break-words w-full max-w-md">
                                {errorMessage}
                            </div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={onClose}>
                                Close
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}