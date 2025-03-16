// SubmitMatchResultsModal.tsx
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {useState} from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    matchLabel: string;
    player1: string | null;
    player2: string | null;
    onSubmit: (winner: string) => void;
}

export function SubmitMatchResultsModal({
                                            open,
                                            onClose,
                                            matchLabel,
                                            player1,
                                            player2,
                                            onSubmit
                                        }: ModalProps) {
    const [selectedWinner, setSelectedWinner] = useState<string | null>(null);

    const handleWinnerSelect = (player: string) => {
        setSelectedWinner(player);
    };

    const handleSubmit = () => {
        if (selectedWinner) {
            onSubmit(selectedWinner);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[600px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]"
            >
                <VisuallyHidden>
                    <DialogHeader>
                        <DialogTitle>Submit Match Results</DialogTitle>
                    </DialogHeader>
                </VisuallyHidden>
                <div className="flex flex-col justify-center items-center text-white">
                    <div className="text-[30px] text-center mb-8">
                        {matchLabel}
                    </div>
                    {(player1 && player2) ? (
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-[20px]">{player1}</span>
                                <span className="text-theme-crimson">VS</span>
                                <span className="text-[20px]">{player2}</span>
                            </div>
                            <div className="flex flex-col gap-4 mt-8">
                                <Button
                                    className={`w-full text-[16px] h-[46px] ${
                                        selectedWinner === player1
                                            ? "bg-theme-crimson"
                                            : ""
                                    }`}
                                    variant={selectedWinner === player1 ? "default" : "secondary"}
                                    onClick={() => handleWinnerSelect(player1)}
                                >
                                    Declare {player1} as Winner
                                </Button>
                                <Button
                                    className={`w-full text-[16px] h-[46px] ${
                                        selectedWinner === player2
                                            ? "bg-theme-crimson"
                                            : ""
                                    }`}
                                    variant={selectedWinner === player2 ? "default" : "secondary"}
                                    onClick={() => handleWinnerSelect(player2)}
                                >
                                    Declare {player2} as Winner
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-[20px] text-center">
                            Waiting for players to join...
                        </div>
                    )}
                    <div className="w-full flex gap-5 items-center justify-between">
                        <Button
                            className="w-full mt-8 text-[16px] h-[46px] text-theme-crimson bg-transparent border-theme-crimson hover:bg-theme-crimson"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-full mt-8 text-[16px] h-[46px]"
                            onClick={handleSubmit}
                            disabled={!selectedWinner} // Disable if no winner is selected
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}