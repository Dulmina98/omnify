import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export function NavigationBar() {

    return (
        <div className={"fixed top-0 left-0 w-full h-[68px] flex justify-center"}>
            <div
                className={" w-full h-full max-w-[1800px] px-[25px] lg:px-[100px] flex items-center"}>
                <Image src={"/assets/images/logo/logo.png"} alt={"logo"} height={60} width={210}
                       className={"w-[105px] cursor-pointer mr-12"}/>
                <div className={"flex justify-between w-full"}>
                    <div className={"flex gap-[25px] items-center w-full"}>
                        <Link href={"/"} className={"text-white text-[16px] font-medium"}>Home</Link>
                        <Link href={"/"} className={"text-white text-[16px] font-medium"}>Tournaments</Link>
                        <Link href={"/"} className={"text-white text-[16px] font-medium"}>Contact Us</Link>
                    </div>
                    <div className={"flex items-center gap-[20px]"}>
                        <Button className={"w-[175px] h-[36px]"}>Join a Tournament</Button>
                        <Button className={"w-[175px] h-[36px]"} variant={"secondary"}>Create a Tournament</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}