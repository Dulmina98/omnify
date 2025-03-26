import Image from "next/image";

export function Footer() {

    return (
        <div className={"bg-black w-full flex justify-center"}>
            <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-20 py-[90px]"}>
                <Image src={"/assets/images/logo/logo.png"} alt={"logo"} height={60} width={210}
                       className={"w-[105px] cursor-pointer mb-[40px]"}/>
                <div className={"text-muted-white text-[18px] leading-[30px] w-full max-w-[595px] mb-[100px]"}>Omnify is
                    revolutionizing gaming tournaments with blockchain-powered transparency, security, and fairness.
                    Join us in building a future where every match is fair, every prize is secure, and every player is
                    empowered.
                </div>
                <div className="block md:flex justify-between items-end">
                    <div className={"block gap-10 lg:gap-[125px] md:hidden"}>
                        <div>
                            <div className={"text-[24px] text-white font-medium mb-[20px]"}>Contact Us</div>
                            <div className={"text-[20px] text-muted-white"}>+94 76 12 34 567</div>
                            <div className={"text-[20px] text-muted-white"}>hello@omnify.com</div>
                        </div>
                        <div>
                            <div className={"text-[24px] text-white font-medium mb-[20px]"}>Location</div>
                            <div className={"text-[20px] text-muted-white"}>Omnify Pvt Ltd,</div>
                            <div className={"text-[20px] text-muted-white"}>Sri Lanka.</div>
                        </div>
                    </div>
                    <div className={"text-muted-white text-[18px] mt-10 md:mt-0"}>© 2025 Omnify. All Right Reserved
                    </div>
                    <div className={"md:flex gap-10 lg:gap-[125px] hidden"}>
                        <div>
                            <div className={"text-[24px] text-white font-medium mb-[20px]"}>Contact Us</div>
                            <div className={"text-[20px] text-muted-white"}>+94 76 12 34 567</div>
                            <div className={"text-[20px] text-muted-white"}>hello@omnify.com</div>
                        </div>
                        <div>
                            <div className={"text-[24px] text-white font-medium mb-[20px]"}>Location</div>
                            <div className={"text-[20px] text-muted-white"}>Omnify Pvt Ltd,</div>
                            <div className={"text-[20px] text-muted-white"}>Sri Lanka.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}