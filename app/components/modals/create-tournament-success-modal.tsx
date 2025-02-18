import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import Link from "next/link";

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateTournamentSuccessModal({open, onClose}: ModalProps) {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[600px] w-full bg-black/40 backdrop-blur-lg rounded-[10px] border-theme-crimson text-white p-[40px]">
                <VisuallyHidden>
                    <DialogHeader>
                        <DialogTitle>Success</DialogTitle>
                    </DialogHeader>
                </VisuallyHidden>
                <div
                    className={" flex flex-col justify-center items-center text-white"}>
                    <Image src={"/assets/images/icons/checked.png"} alt={"check"} width={50} height={50}
                           className={"mb-8"}/>
                    <div className={"text-[40px] text-center"}>Tournament created <span
                        className={"text-theme-crimson"}>Successful!</span>
                    </div>
                    <Link href={"/view-tournaments"} className={"w-full mt-16"}>
                        <Button className={"w-full text-[16px] h-[46px]"} variant={"secondary"}>View
                            Tournaments</Button>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    )
}