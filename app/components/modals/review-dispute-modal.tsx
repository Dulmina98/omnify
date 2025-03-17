'use client';

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
    onResolveDispute: (winnerUserId: string) => void;
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

    const handleWinnerSelect = (userId: string) => {
        setSelectedWinnerId(userId);
    };

    const handleSubmit = () => {
        if (selectedWinnerId) {
            onResolveDispute(selectedWinnerId);
            onOpenChange(false);
            setSelectedWinnerId(null); // Reset selection after submit
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
                    <div className="w-full flex gap-5 items-center justify-between">
                        <Button
                            className="w-full mt-8 text-[16px] h-[46px] text-theme-crimson bg-transparent border-theme-crimson hover:bg-theme-crimson"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setSelectedWinnerId(null); // Reset selection on cancel
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full mt-8 text-[16px] h-[46px]"
                            onClick={handleSubmit}
                            disabled={!selectedWinnerId} // Disable if no winner is selected
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}