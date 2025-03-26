'use client'

import {Button} from "@/components/ui/button";
import Image from "next/image";
import {useCurrentUser} from "@/services/user-service";
import Link from "next/link";
import {useUser} from "@clerk/nextjs";

export function Landing() {
    const {role, isSignedIn: isConvexSigned} = useCurrentUser();
    const {isClerkSigned} = useUser();

    return (
        <div className={"w-full relative flex justify-center"}>
            <img src={"/assets/images/bg/landing-bg.jpg"} className={"absolute left-0 top-0 w-full"}/>
            <div className={"max-w-[1800px] h-screen w-full px-[25px] lg:px-[100px] flex justify-center relative z-10"}>

                <div className={"w-full flex justify-center "}>
                    <div className={"relative z-10 h-screen w-fit flex flex-col justify-center"}>
                        <div
                            className={"text-theme-crimson text-[120px] min-[470px]:text-[150px] sm:text-[200px] lg:text-[275px] relative tracking-[-10px] lg:tracking-[-20px]"}>
                            Omnify
                            <div
                                className={"absolute text-white font-light text-[16px] min-[470px]:text-[20px] sm:text-[27px] lg:text-[40px] bottom-5 min-[470px]:bottom-8 lg:bottom-10 left-5 tracking-normal"}>
                                The Future of Gaming Tournaments
                            </div>
                        </div>
                        {!role && <div
                            className={"items-center w-full flex justify-center gap-[20px] mt-10 pb-40 flex-col min-[470px]:flex-row"}>
                            <Link href={"/sign-up"}><Button
                                className={"h-[40px] w-[175px] lg:h-[48px] lg:w-[215px] text-[14px]  lg:text-[18px]"}>Register</Button></Link>
                            <Link href={"/view-tournaments"}>
                                <Button
                                    className={"h-[40px] w-[175px] lg:h-[48px] lg:w-[215px]  text-[14px] lg:text-[18px]"}
                                    variant={"secondary"}>View Tournaments</Button>
                            </Link>
                        </div>}
                        {isClerkSigned && !role && <div
                            className={"items-center w-full flex justify-center gap-[20px] mt-10 pb-40 flex-col min-[470px]:flex-row"}>
                            <Link href={"/become-a-member"}><Button
                                className={"h-[40px] w-[175px] lg:h-[48px] lg:w-[215px] text-[14px]  lg:text-[18px]"}>Become
                                a Member</Button></Link>
                            <Link href={"/view-tournaments"}>
                                <Button
                                    className={"h-[40px] w-[175px] lg:h-[48px] lg:w-[215px]  text-[14px] lg:text-[18px]"}
                                    variant={"secondary"}>View Tournaments</Button>
                            </Link>
                        </div>}

                        {isConvexSigned && <div
                            className={"items-center w-full flex justify-center gap-[20px] mt-10 pb-40 flex-col min-[470px]:flex-row"}>
                            {role === "player" && <Link href={"/join-tournament"}><Button
                                className={"h-[40px] w-[175px] lg:h-[48px] lg:w-[215px] ttext-[14px]  lg:ext-[18px]"}>Join
                                a Tournament</Button></Link>}
                            {role === "organizer" && <Link href={"/join-tournament"}><Button
                                className={"h-[40px] w-[175px] lg:h-[48px] lg:w-[215px] t text-[14px] lg:ext-[18px]"}>Create
                                a Tournament</Button></Link>}
                            <Link href={"/view-tournaments"}>
                                <Button
                                    className={"h-[40px] w-[175px] lg:h-[48px] lg:w-[215px] text-[14px]  lg:text-[18px]"}
                                    variant={"secondary"}>View Tournaments</Button>
                            </Link>
                        </div>}
                    </div>
                </div>
                <div className={"w-full  h-56 absolute bottom-0 left-0 flex justify-center"}>
                    <div
                        className="max-w-[1800px] px-[25px] lg:px-[100px] flex w-full items-center gap-[20px]">
                        <Image src={"/assets/images/icons/star.png"} alt={"star-icon"} className={"w-[39px]"} width={39}
                               height={39}/>
                        <div className={"text-white opacity-70 text-[16px] w-[500px]"}>Empowering gamers and organizers
                            with
                            blockchain-powered transparency, security, and fairness.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}