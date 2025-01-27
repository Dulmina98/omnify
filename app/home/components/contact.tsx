import {Button} from "@/components/ui/button";

export function Contact() {

    return (
        <div className={"relative w-full flex justify-center overflow-hidden bg-black z-10"}>
            <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-20 py-[200px]"}>
                <div className={"w-full flex justify-center"}>
                    <div
                        className={"text-[90px] text-white text-center w-full max-w-[900px] mb-[35px] leading-[105px]"}>Ready
                        to <br/>
                        <span className="text-theme-crimson"> Omnify</span> Your <span className="text-theme-crimson">Gaming Experience?</span>
                    </div>
                </div>
                <div className={"text-white text-center text-[32px] max-w-[675px] w-full mx-auto"}>Join now and be part
                    of a transparent, secure, and fair gaming ecosystem.
                </div>
                <div className="flex justify-center w-full mt-[70px]"><Button variant={"secondary"}
                                                                              className={"text-[16px] w-[200px] h-[48px]"}>Contact
                    Us</Button></div>
            </div>
            <img src="/assets/images/bg/contact-bg.png" alt="contact-bg"
                 className={"absolute bottom-0 left-0 w-full z-10"}/>
        </div>
    )
}