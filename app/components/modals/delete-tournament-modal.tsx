import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import {useState} from "react";

interface DeleteTournamentModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    tournamentName: string;
}

export function DeleteTournamentModal({open, onClose, onConfirm, tournamentName}: DeleteTournamentModalProps) {
    const [state, setState] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleDelete = async () => {
        try {
            setState("processing");
            await onConfirm();
            setState("success");
        } catch (error: unknown) {
            setState("error");
            const message = error instanceof Error ? error.message : "Failed to delete tournament.";
            setErrorMessage(message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[700px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>Delete Tournament Confirmation</DialogTitle>
                    </VisuallyHidden>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center text-white">
                    {state === "idle" && (
                        <>
                            <Image src="/assets/images/icons/trash.png" alt="trash" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Delete <span
                                className="text-theme-crimson">Tournament</span></div>
                            <div className="mt-2 text-muted-white text-center">
                                Are you sure you want to delete <span
                                className={"font-semibold text-white"}>"{tournamentName}"</span>? This action cannot be
                                undone.
                            </div>
                            <div className="mt-8 w-full flex justify-center gap-4">
                                <Button variant="secondary" className="w-[120px] text-[16px] h-[46px]"
                                        onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button className="w-[120px] text-[16px] h-[46px]" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </div>
                        </>
                    )}
                    {state === "processing" && (
                        <>
                            <Image src="/assets/images/icons/loading.png" alt="processing" width={50} height={50}
                                   className="mb-8 animate-spin"/>
                            <div className="text-[40px] text-center">Deleting <span
                                className="text-theme-crimson">Tournament</span></div>
                            <div className="mt-2 text-muted-white text-center">Please wait while the tournament is being
                                deleted...
                            </div>
                        </>
                    )}
                    {state === "success" && (
                        <>
                            <Image src="/assets/images/icons/checked.png" alt="success" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Tournament <span
                                className="text-theme-crimson">Deleted</span></div>
                            <div className="mt-2 text-muted-white text-center">The tournament has been successfully
                                deleted.
                            </div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={onClose}>Close</Button>
                        </>
                    )}
                    {state === "error" && (
                        <>
                            <Image src="/assets/images/icons/failed.png" alt="error" width={50} height={50}
                                   className="mb-8"/>
                            <div className="text-[40px] text-center">Deletion <span
                                className="text-theme-crimson">Failed</span></div>
                            <div
                                className="mt-2 text-muted-white text-center break-words w-full max-w-md">{errorMessage}</div>
                            <Button className="mt-8 w-full text-[16px] h-[46px]" onClick={onClose}>Close</Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}