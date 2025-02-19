import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import Link from "next/link";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    amount: number;
}

export function JoinTournamentModal({open, onClose, amount}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[700px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]">
                <VisuallyHidden>
                    <DialogHeader>
                        <DialogTitle>Payment Required</DialogTitle>
                    </DialogHeader>
                </VisuallyHidden>
                <div className="flex flex-col justify-center items-center text-white">
                    <Image
                        src="/assets/images/icons/payment.png"
                        alt="payment required"
                        width={50}
                        height={50}
                        className="mb-8"
                    />
                    <div className="text-[40px] text-center">
                        Secure Your <span className="text-theme-crimson">Spot</span>
                    </div>
                    <div className={"mt-2 text-muted-white text-center"}>
                        You've reserved a spot in the tournament. <span className={"text-white font-semibold"}>Pay the entry fee within 24 hours to confirm participation.</span> If
                        not paid, your spot will be automatically removed.
                    </div>
                    <div className={"flex w-full items-center gap-x-5 mt-16"}>
                        <Button
                            className={"w-full text-[16px] h-[46px]"}
                            variant={"secondary"}
                            onClick={onClose}
                        >
                            Pay Later
                        </Button>
                        <Link href="/user-profile" className={"w-full"}>
                            <Button
                                className="w-full text-[16px] h-[46px]"
                            >
                                Go to Dashboard to pay {amount}ETH
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}