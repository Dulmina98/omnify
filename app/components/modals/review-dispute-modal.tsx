"use client";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useState} from "react";

interface ReviewDisputeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    matchLabel: string;
    player1Name: string | null;
    player2Name: string | null;
    player1UserId: string | null;
    player2UserId: string | null;
    player1Submission: string | null;
    player2Submission: string | null;
    onResolveDispute: (winnerUserId: string) => Promise<void>; // Updated to reflect async nature
}

export function ReviewDisputeModal({
                                       open,
                                       onOpenChange,
                                       matchLabel,
                                       player1Name,
                                       player2Name,
                                       player1UserId,
                                       player2UserId,
                                       player1Submission,
                                       player2Submission,
                                       onResolveDispute,
                                   }: ReviewDisputeModalProps) {
    const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
    const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleWinnerSelect = (userId: string) => {
        setSelectedWinnerId(userId);
    };

    const handleSubmit = async () => {
        if (!selectedWinnerId) {
            setErrorMessage("Please select a winner.");
            setState("error");
            return;
        }

        setState("submitting");
        try {
            await onResolveDispute(selectedWinnerId);
            setState("success");
            setTimeout(() => {
                onOpenChange(false);
                setSelectedWinnerId(null);
                setState("idle");
            }, 2000); // Close after 2 seconds, like SubmitMatchResultsModal
        } catch (error) {
            setState("error");
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to resolve dispute. Please try again."
            );
            console.error("Failed to resolve dispute:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[600px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]"
            >
                <DialogHeader>
                    <DialogTitle className="text-[30px] text-center">
                        Resolve Dispute: {matchLabel}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="text-[20px] text-center">
                        <p>
                            Player 1 ({player1Name || "Unknown"}):{" "}
                            <span className="text-theme-crimson font-semibold">
                                {player1Submission || "Not Submitted"}
                            </span>
                        </p>
                        <p>
                            Player 2 ({player2Name || "Unknown"}):{" "}
                            <span className="text-theme-crimson font-semibold">
                                {player2Submission || "Not Submitted"}
                            </span>
                        </p>
                    </div>
                    {state === "idle" && (
                        <div className="flex flex-col gap-4 mt-4">
                            {player1UserId && (
                                <Button
                                    className={`w-full text-[16px] h-[46px] ${
                                        selectedWinnerId === player1UserId ? "bg-theme-crimson" : ""
                                    }`}
                                    variant={selectedWinnerId === player1UserId ? "default" : "secondary"}
                                    onClick={() => handleWinnerSelect(player1UserId)}
                                >
                                    Declare {player1Name || "Player 1"} as Winner
                                </Button>
                            )}
                            {player2UserId && (
                                <Button
                                    className={`w-full text-[16px] h-[46px] ${
                                        selectedWinnerId === player2UserId ? "bg-theme-crimson" : ""
                                    }`}
                                    variant={selectedWinnerId === player2UserId ? "default" : "secondary"}
                                    onClick={() => handleWinnerSelect(player2UserId)}
                                >
                                    Declare {player2Name || "Player 2"} as Winner
                                </Button>
                            )}
                        </div>
                    )}
                    {state === "submitting" && (
                        <p className="text-center mt-4">Submitting to blockchain... Please confirm in MetaMask</p>
                    )}
                    {state === "success" && (
                        <p className="text-center mt-4">Dispute resolved successfully! Closing in 2 seconds...</p>
                    )}
                    {state === "error" && (
                        <p className="text-red-400 text-center mt-4">{errorMessage}</p>
                    )}
                    <div className="w-full flex gap-5 items-center justify-between mt-8">
                        <Button
                            className="w-full text-[16px] h-[46px] text-theme-crimson bg-transparent border-theme-crimson hover:bg-theme-crimson"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setSelectedWinnerId(null);
                                setState("idle");
                                setErrorMessage("");
                            }}
                            disabled={state === "submitting"}
                        >
                            Cancel
                        </Button>
                        {state === "idle" && (
                            <Button
                                className="w-full text-[16px] h-[46px]"
                                onClick={handleSubmit}
                                disabled={!selectedWinnerId}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}