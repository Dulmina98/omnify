"use client";

import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useCurrentUser} from "@/services/user-service";
import {useUser} from "@clerk/nextjs";
import {ProfileDropdown} from "@/app/components/navigation/profile-dropdown";
import {useEthereum} from "@/hooks/use-ethereum";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export function NavigationBar() {
    const {user, isSignedIn: isConvexSigned, role} = useCurrentUser();
    const {isSignedIn: isClerkSigned} = useUser();
    const {provider, signer, address, isConnected, connectWallet, disconnectWallet} = useEthereum();

    return (
        <div className={"fixed top-0 left-0 w-full h-[68px] flex justify-center backdrop-blur-lg z-50"}>
            <div
                className={" w-full h-full max-w-[1800px] px-[25px] lg:px-[100px] flex items-center"}>
                <Link href={"/"}><Image src={"/assets/images/logo/logo.png"} alt={"logo"} height={60} width={210}
                                        className={"w-[105px] cursor-pointer mr-12"}/></Link>
                <div className={"flex justify-between w-full"}>
                    <div className={"flex gap-[25px] items-center w-full"}>
                        <Link href={"/"} className={"text-white text-[16px] font-medium"}>Home</Link>
                        {user && role === "organizer" &&
                            <Link href={"/"} className={"text-white text-[16px] font-medium"}>Create Tournament</Link>}
                        {user && role === "player" &&
                            <Link href={"/join-tournament"} className={"text-white text-[16px] font-medium"}>Join
                                Tournament</Link>}
                        <Link href={"/"} className={"text-white text-[16px] font-medium"}>Contact Us</Link>
                    </div>
                    <div className={"flex items-center gap-[20px]"}>
                        {(isConvexSigned && isClerkSigned) && <>
                            <>
                                {isConnected ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant={"secondary"} className={"w-[150px] h-[36px]"}
                                                        onClick={disconnectWallet}>Disconnect Wallet</Button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                className={"bg-black/35 backdrop-blur-lg text-white border-muted-gray"}
                                                side={"bottom"} align={"end"}>
                                                <div>{address}</div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (

                                    <Button variant={"secondary"} className={"w-[150px] h-[36px]"}
                                            onClick={connectWallet}>Connect Wallet</Button>

                                )}
                            </>
                        </>}
                        {isClerkSigned && !user && role !== "admin" && <Link href="/become-a-member" passHref>
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