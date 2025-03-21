import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import {getContract} from "@/lib/contract";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {api} from "@/convex/_generated/api";
import {PaymentTypes} from "@/types/payment-types";
import {ethers} from "ethers";
import {Doc} from "@/convex/_generated/dataModel";

interface JoinTournamentModalProps {
    open: boolean;
    onClose: () => void;
    tournament: Doc<'tournaments'>;
    user: Doc<"players"> | null | undefined;
}

export function JoinTournamentModal({open, onClose, tournament, user}: JoinTournamentModalProps) {
    const [state, setState] = useState<"idle" | "confirming" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const {mutate: enterTournament} = useApiMutation(api.tournament_entries.enterTournament);
    const {mutate: recordTransaction} = useApiMutation(api.transactions.createTransaction);

    useEffect(() => {
        if (open && state === "idle" && user) {
            handlePayment();
        }
    }, [open, state, user]);

    const handlePayment = async () => {
        try {
            if (!user || !user.walletId) {
                throw new Error("User is not connected or has no Ethereum address.");
            }

            setState("confirming");
            const contract = await getContract(tournament.contractAddress);
            const entryFee = await contract.entryFee();
            const tx = await contract.payEntryFee({value: entryFee});
            setState("processing");

            const receipt = await tx.wait();
            const transactionHash = receipt.hash;
            const blockNumber = receipt.blockNumber;
            const amountInEth = parseFloat(ethers.formatEther(entryFee));

            const transactionId = await recordTransaction({
                transactionHash,
                tournamentId: tournament._id,
                userId: user.userId,
                amount: amountInEth,
                status: "confirmed",
                paymentType: PaymentTypes.ENTRY_FEE,
                blockNumber,
                fromAddress: user.walletId,
                toAddress: tournament.contractAddress,
            });

            await enterTournament({
                tournamentId: tournament._id,
                userId: user.userId,
                transactionId,
            });

            setState("success");
        } catch (error: unknown) {
            setState("error");
            const message = error instanceof Error ? error.message : "Failed to join tournament. Please try again.";
            setErrorMessage(message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[700px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]">
                <VisuallyHidden>
                    <DialogHeader>Payment Required</DialogHeader>
                </VisuallyHidden>
                <div className="flex flex-col justify-center items-center text-white">
                    {state === "confirming" && (
                        <>
                            <Image src="/assets/images/icons/payment.png" alt="payment required" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Confirm <span
                                className="text-theme-crimson">Payment</span></div>
                            <div className="mt-2 text-muted-white text-center">
                                Please confirm the transaction in your wallet to pay {tournament.entryFee} ETH.
                            </div>
                        </>
                    )}
                    {state === "processing" && (
                        <>
                            <Image src="/assets/images/icons/loading.png" alt="processing" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Processing <span
                                className="text-theme-crimson">Payment</span></div>
                            <div className="mt-2 text-muted-white text-center">Please wait while your payment is being
                                processed...
                            </div>
                        </>
                    )}
                    {state === "success" && (
                        <>
                            <Image src="/assets/images/icons/success.png" alt="success" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Success!</div>
                            <div className="mt-2 text-muted-white text-center">Payment successful! You’ve joined the
                                tournament.
                            </div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={onClose}>Close</Button>
                        </>
                    )}
                    {state === "error" && (
                        <>
                            <Image src="/assets/images/icons/failed.png" alt="error" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Payment <span
                                className="text-theme-crimson">Failed</span></div>
                            <div className="mt-2 text-muted-white text-center break-words w-full max-w-md">
                                {errorMessage}
                            </div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={onClose}>Close</Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}