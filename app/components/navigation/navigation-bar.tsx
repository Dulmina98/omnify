"use client";

import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useCurrentUser} from "@/services/user-service";
import {useClerk, useUser} from "@clerk/nextjs";
import {ProfileDropdown} from "@/app/components/navigation/profile-dropdown";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useWallet} from "@/hooks/use-wallet";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Menu} from "lucide-react";

export function NavigationBar() {
    const {user, isSignedIn: isConvexSigned, role} = useCurrentUser();
    const {isSignedIn: isClerkSigned} = useUser();
    const {signOut} = useClerk();
    const {address, isConnected, connectWallet, disconnectWallet} = useWallet();

    return (
        <div className={"fixed top-0 left-0 w-full h-[68px] flex justify-center backdrop-blur-lg z-50"}>
            <div className={"w-full h-full max-w-[1800px] px-[25px] lg:px-[100px] flex items-center"}>
                {/* Desktop Layout */}
                <div className="hidden min-[1150px]:flex items-center w-full">
                    <Link href={"/"}>
                        <Image
                            src={"/assets/images/logo/logo.png"}
                            alt={"logo"}
                            height={60}
                            width={210}
                            className={"w-[105px] cursor-pointer mr-12"}
                        />
                    </Link>
                    <div className={"flex justify-between w-full"}>
                        <div className={"flex gap-[25px] items-center"}>
                            <Link href={"/"} className={"text-white hover:text-theme-crimson text-[16px] font-medium"}>
                                Home
                            </Link>
                            {user && role === "organizer" && (
                                <Link href={"/create-tournament"}
                                      className={"text-white hover:text-theme-crimson text-[16px] font-medium"}>
                                    Create Tournament
                                </Link>
                            )}
                            {user && role === "player" && (
                                <Link href={"/join-tournament"}
                                      className={"text-white hover:text-theme-crimson text-[16px] font-medium"}>
                                    Join Tournament
                                </Link>
                            )}
                            <Link href={"/view-tournaments"}
                                  className={"text-white hover:text-theme-crimson text-[16px] font-medium"}>
                                View Tournaments
                            </Link>
                            <Link href={"/contact-us"}
                                  className={"text-white hover:text-theme-crimson text-[16px] font-medium"}>
                                Contact Us
                            </Link>
                            <Link href={"/faq"}
                                  className={"text-white hover:text-theme-crimson text-[16px] font-medium"}>FAQ</Link>
                        </div>
                        <div className={"flex items-center gap-[20px]"}>
                            {(isConvexSigned && isClerkSigned) && (
                                <>
                                    {isConnected ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant={"secondary"} className={"w-[150px] h-[36px]"}
                                                            onClick={disconnectWallet}>
                                                        Disconnect Wallet
                                                    </Button>
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
                                                onClick={connectWallet}>
                                            Connect Wallet
                                        </Button>
                                    )}
                                </>
                            )}
                            {isClerkSigned && !user && role !== "admin" && (
                                <Link href="/become-a-member" passHref>
                                    <Button className={"w-[150px] h-[36px]"}>Become a member</Button>
                                </Link>
                            )}
                            {!isClerkSigned && (
                                <>
                                    <Link href="/sign-up" passHref>
                                        <Button className={"w-[125px] h-[36px]"}>Sign up</Button>
                                    </Link>
                                    <Link href="/sign-in" passHref>
                                        <Button className={"w-[125px] h-[36px]"} variant={"secondary"}>Sign in</Button>
                                    </Link>
                                </>
                            )}
                            {isClerkSigned && !user && (
                                <Button className={"w-[150px] h-[36px]"} onClick={() => signOut({redirectUrl: '/'})}>
                                    Log out
                                </Button>
                            )}
                            {(isConvexSigned && isClerkSigned) && <ProfileDropdown/>}
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="flex min-[1150px]:hidden items-center justify-between w-full">
                    <Link href={"/"}>
                        <Image
                            src={"/assets/images/logo/logo.png"}
                            alt={"logo"}
                            height={60}
                            width={210}
                            className={"w-[105px] cursor-pointer"}
                        />
                    </Link>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="h-[36px] w-[36px]">
                                <Menu className="size-5"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto bg-black/40 backdrop-blur-lg border-l-theme-crimson">
                            <SheetHeader>
                                <SheetTitle>
                                    <Link href={"/"}>
                                        <Image
                                            src={"/assets/images/logo/logo.png"}
                                            alt={"logo"}
                                            height={60}
                                            width={210}
                                            className={"w-[105px] cursor-pointer"}
                                        />
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 p-4">
                                <div className={"mt-8 flex justify-center w-full"}>
                                    {(isConvexSigned && isClerkSigned) &&
                                        <div className={"w-full justify-center flex-col items-center flex"}>
                                            <div
                                                className={`w-[100px] h-[100px] min-w-[100px] min-h-[100px] cursor-pointer`}>
                                                <Image
                                                    src={"/assets/images/other/user-placeholder.png"}
                                                    alt={'avatar'}
                                                    width={100}
                                                    height={100}
                                                    className={`rounded-full w-[100px] h-[100px] min-w-[100px] min-h-[100px] object-cover`}
                                                />
                                            </div>
                                            <div
                                                className={"text-white w-full flex flex-col justify-center items-center mt-5"}>
                                                <div
                                                    className={'text-base font-medium'}>{user?.firstName} {user?.lastName}</div>
                                                {role && <div
                                                    className={'text-xs font-normal capitalize'}>{role}</div>}
                                                <div
                                                    className={'text-xs font-normal text-[#897EA7] dark:text-[#70707C]'}>{user?.email}</div>
                                            </div>
                                        </div>}
                                </div>
                                <Link href={"/"}
                                      className={"text-white hover:text-theme-crimson text-[16px] border-b border-b-muted-gray mb-5 font-medium mt-8"}>
                                    Home
                                </Link>
                                {user && role === "organizer" && (
                                    <Link href={"/create-tournament"}
                                          className={"text-white hover:text-theme-crimson text-[16px] border-b border-b-muted-gray mb-5 font-medium"}>
                                        Create Tournament
                                    </Link>
                                )}
                                {user && role === "player" && (
                                    <Link href={"/join-tournament"}
                                          className={"text-white hover:text-theme-crimson text-[16px] border-b border-b-muted-gray mb-5 font-medium"}>
                                        Join Tournament
                                    </Link>
                                )}
                                <Link href={"/view-tournaments"}
                                      className={"text-white hover:text-theme-crimson text-[16px] border-b border-b-muted-gray mb-5 font-medium"}>
                                    View Tournaments
                                </Link>
                                {isConvexSigned && <Link href={"/dashboard"}
                                                         className={"text-white hover:text-theme-crimson text-[16px] border-b border-b-muted-gray font-medium mb-5"}>
                                    Dashboard
                                </Link>}
                                <Link href={"/contact-us"}
                                      className={"text-white hover:text-theme-crimson text-[16px] border-b border-b-muted-gray font-medium mb-5"}>
                                    Contact Us
                                </Link>
                                <Link href={"/faq"}
                                      className={"text-white hover:text-theme-crimson text-[16px] border-b border-b-muted-gray font-medium mb-20"}>FAQ</Link>
                                {(isConvexSigned && isClerkSigned) && (
                                    <Button
                                        variant={"secondary"}
                                        className={"w-full h-[36px]"}
                                        onClick={isConnected ? disconnectWallet : connectWallet}
                                    >
                                        {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
                                    </Button>
                                )}
                                {isClerkSigned && !user && role !== "admin" && (
                                    <Link href="/become-a-member" passHref>
                                        <Button className={"w-full h-[36px]"}>Become a member</Button>
                                    </Link>
                                )}
                                {!isClerkSigned && (
                                    <>
                                        <Link href="/sign-up" passHref>
                                            <Button className={"w-full h-[36px]"}>Sign up</Button>
                                        </Link>
                                        <Link href="/sign-in" passHref>
                                            <Button className={"w-full h-[36px]"} variant={"secondary"}>Sign in</Button>
                                        </Link>
                                    </>
                                )}
                                {isClerkSigned && !user && (
                                    <Button
                                        className={"w-full h-[36px]"}
                                        onClick={() => signOut({redirectUrl: '/'})}
                                    >
                                        Log out
                                    </Button>
                                )}
                                {isClerkSigned && <Button className={"w-full h-[36px] text-theme-crimson font-semibold"}
                                                          variant={"link"} onClick={() => signOut({redirectUrl: '/'})}>
                                    Log out
                                </Button>}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}