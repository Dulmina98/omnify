"use client";

import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useCurrentUser} from "@/services/user-service";
import {useUser} from "@clerk/nextjs";
import {ProfileDropdown} from "@/app/components/navigation/profile-dropdown";

export function NavigationBar() {
    const {user, isSignedIn: isConvexSigned} = useCurrentUser();
    const {isSignedIn: isClerkSigned} = useUser();

    return (
        <div className={"fixed top-0 left-0 w-full h-[68px] flex justify-center backdrop-blur-lg z-50"}>
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
                        {(isConvexSigned && isClerkSigned) && <>
                            <Link href="/sign-in" passHref>
                                <Button className={"w-[150px] h-[36px]"} variant={"secondary"}>
                                    Connect wallet
                                </Button>
                            </Link>
                        </>}
                        {isClerkSigned && !user && <Link href="/become-a-member" passHref>
                            <Button className={"w-[150px] h-[36px]"}>
                                Become a member
                            </Button>
                        </Link>}
                        {!isClerkSigned && <Link href="/sign-up" passHref>
                            <Button className={"w-[150px] h-[36px]"}>
                                Sign up
                            </Button>
                        </Link>}
                        {(isConvexSigned && isClerkSigned) && <ProfileDropdown/>}
                    </div>
                </div>
            </div>
        </div>
    )
}