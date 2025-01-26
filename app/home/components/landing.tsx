import {Button} from "@/components/ui/button";
import Image from "next/image";

export function Landing() {

    return (
        <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] flex justify-center"}>
            <div className={"relative z-10 h-screen w-fit flex flex-col justify-center"}>
                <div className={"text-theme-crimson text-[275px] relative tracking-[-20px]"}>
                    Omnify
                    <div className={"absolute text-white font-light text-[40px] bottom-10 left-5 tracking-normal"}>
                        The Future of Gaming Tournaments
                    </div>
                </div>
                <div className={"w-full flex justify-center gap-[20px] mt-10 pb-40"}>
                    <Button className={"h-[48px] w-[215px] text-[18px]"}>Join a Tournament</Button>
                    <Button className={"h-[48px] w-[215px] text-[18px]"} variant={"secondary"}>Create a
                        Tournament</Button>
                </div>
            </div>
            <div className={"w-full  h-56 absolute bottom-0 left-0 flex justify-center"}>
                <div
                    className="max-w-[1800px] px-[25px] lg:px-[100px] flex w-full items-center gap-[20px]">
                    <Image src={"/assets/images/icons/star.png"} alt={"star-icon"} className={"w-[39px]"} width={39}
                           height={39}/>
                    <div className={"text-white opacity-70 text-[16px] w-[500px]"}>Empowering gamers and organizers with
                        blockchain-powered transparency, security, and fairness.
                    </div>
                </div>
            </div>
        </div>
    )
}