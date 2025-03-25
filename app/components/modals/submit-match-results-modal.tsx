"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {getContractWithSigner} from "@/lib/contract";
import {Id} from "@/convex/_generated/dataModel";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    matchLabel: string;
    player1: string | null;
    player2: string | null;
    onSubmit: (winner: string) => void;
    tournamentId: Id<"tournaments">;
    matchId: string;
    player1UserId: string | null;
    player2UserId: string | null;
    submittedBy: string;
    contractAddress: string;
}

export function SubmitMatchResultsModal({
                                            open,
                                            onClose,
                                            matchLabel,
                                            player1,
                                            player2,
                                            onSubmit,
                                            tournamentId,
                                            matchId,
                                            player1UserId,
                                            player2UserId,
                                            submittedBy,
                                            contractAddress,
                                        }: ModalProps) {
    const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
    const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const submitMatchResult = useMutation(api.match_results.submitMatchResult);
    const playerDetails = useQuery(api.players.getPlayersByUserIds, {
        userIds: [player1UserId, player2UserId].filter((id): id is string => id !== null),
    });

    const handleWinnerSelect = (player: string) => {
        setSelectedWinner(player);
    };

    const handleSubmit = async () => {
        if (!selectedWinner || !player1UserId || !player2UserId || !playerDetails) {
            setErrorMessage("Please select a winner and ensure player data is complete.");
            setState("error");
            return;
        }

        setState("submitting");
        try {
            const player1Details = playerDetails.find((p) => p?.userId === player1UserId);
            const player2Details = playerDetails.find((p) => p?.userId === player2UserId);
            if (!player1Details?.walletId || !player2Details?.walletId) {
                throw new Error("Wallet addresses not found for players.");
            }

            const winnerUserId = selectedWinner === player1 ? player1UserId : player2UserId;
            const winnerWalletAddress =
                selectedWinner === player1 ? player1Details.walletId : player2Details.walletId;

            const contract = await getContractWithSigner(contractAddress);
            const matchIdNum = parseInt(matchId.replace("match-", ""));
            const tx = await contract.submitMatchResult(
                matchIdNum,
                player1Details.walletId,
                player2Details.walletId,
                winnerWalletAddress
            );
            const receipt = await tx.wait();
            const transactionHash = receipt.hash;

            await submitMatchResult({
                tournamentId,
                matchId,
                player1UserId,
                player2UserId,
                winnerUserId,
                submittedBy,
                transactionHash,
            });

            setState("success");
            onSubmit(selectedWinner);
            setTimeout(onClose, 2000);
        } catch (error) {
            setState("error");
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to submit match result. Please try again."
            );
            console.error("Failed to submit match result:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[600px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]"
            >
                <DialogHeader>
                    <DialogTitle>Submit Match Results</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center text-white">
                    <div className="text-[30px] text-center mb-8">{matchLabel}</div>
                    {player1 && player2 ? (
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-[20px]">{player1}</span>
                                <span className="text-theme-crimson">VS</span>
                                <span className="text-[20px]">{player2}</span>
                            </div>
                            {state === "idle" && (
                                <div className="flex flex-col gap-4 mt-8">
                                    <Button
                                        className={`w-full text-[16px] h-[46px] ${selectedWinner === player1 ? "bg-theme-crimson" : ""}`}
                                        variant={selectedWinner === player1 ? "default" : "secondary"}
                                        onClick={() => handleWinnerSelect(player1)}
                                    >
                                        Declare {player1} as Winner
                                    </Button>
                                    <Button
                                        className={`w-full text-[16px] h-[46px] ${selectedWinner === player2 ? "bg-theme-crimson" : ""}`}
                                        variant={selectedWinner === player2 ? "default" : "secondary"}
                                        onClick={() => handleWinnerSelect(player2)}
                                    >
                                        Declare {player2} as Winner
                                    </Button>
                                </div>
                            )}
                            {state === "submitting" && (
                                <p>Submitting to blockchain... Please confirm in MetaMask</p>
                            )}
                            {state === "success" && (
                                <p>Result submitted successfully! Closing in 2 seconds...</p>
                            )}
                            {state === "error" && (
                                <p className="text-red-400">{errorMessage}</p>
                            )}
                            <div className="w-full flex gap-5 items-center justify-between mt-8">
                                <Button
                                    className="w-full text-[16px] h-[46px] text-theme-crimson bg-transparent border-theme-crimson hover:bg-theme-crimson"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={state === "submitting"}
                                >
                                    Cancel
                                </Button>
                                {state === "idle" && (
                                    <Button
                                        className="w-full text-[16px] h-[46px]"
                                        onClick={handleSubmit}
                                        disabled={!selectedWinner || !playerDetails}
                                    >
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-[20px] text-center">Waiting for players to join...</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}