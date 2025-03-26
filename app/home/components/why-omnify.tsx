import Image from "next/image";

export function WhyOmnify() {

    return (
        <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[100px] md:py-[200px]"}>
            <div className={"text-[45px] md:text-[64px] text-white sm:text-center w-full mb-[60px] md:mb-[125px]"}>Why
                Choose <span
                className={"text-theme-crimson"}>Omnify?</span></div>
            <div
                className={"flex flex-wrap justify-between gap-y-[35px] sm:gap-y-[90px] w-full max-w-[1000px] mx-auto"}>
                <div className={"flex flex-wrap justify-between w-full gap-x-[20px] gap-y-[50px]"}>
                    <div className={"w-full sm:w-[calc(50%-20px)]"}>
                        <div className={"flex items-center gap-[15px] mb-[35px]"}>
                            <Image src={"/assets/images/icons/why-omnify/transparency.png"} alt={"icon"} width={30}
                                   height={30} className={"w-7 h-7 md:w-[30px] md:h-[30px]"}/>
                            <div className={"text-white text-[25px] md:text-[32px]"}>Transparency</div>
                        </div>
                        <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>
                            Every transaction and match result is recorded on the blockchain, ensuring complete
                            transparency for all participants.
                        </div>
                    </div>
                    <div className={"w-full sm:w-[calc(50%-20px)]"}>
                        <div className={"flex items-center gap-[15px] mb-[35px]"}>
                            <Image src={"/assets/images/icons/why-omnify/protection.png"} alt={"icon"} width={30}
                                   height={30} className={"w-7 h-7 md:w-[30px] md:h-[30px]"}/>
                            <div className={"text-white text-[25px] md:text-[32px]"}>Protection</div>
                        </div>
                        <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>
                            Decentralized architecture eliminates single points of failure, protecting against hacks and
                            fraud.
                        </div>
                    </div>
                </div>

                <div className={"flex flex-wrap justify-between w-full gap-x-[20px] gap-y-[50px]"}>
                    <div className={"w-full sm:w-[calc(50%-20px)]"}>
                        <div className={"flex items-center gap-[15px] mb-[35px]"}>
                            <Image src={"/assets/images/icons/why-omnify/fair.png"} alt={"icon"} width={30} height={30}
                                   className={"w-7 h-7 md:w-[30px] md:h-[30px]"}/>
                            <div className={"text-white text-[25px] md:text-[32px]"}>Fairness</div>
                        </div>
                        <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>
                            Automated smart contracts ensure unbiased decision-making and fair prize distribution.
                        </div>
                    </div>
                    <div className={"w-full sm:w-[calc(50%-20px)]"}>
                        <div className={"flex items-center gap-[15px] mb-[35px]"}>
                            <Image src={"/assets/images/icons/why-omnify/speed.png"} alt={"icon"} width={30} height={30}
                                   className={"w-7 h-7 md:w-[30px] md:h-[30px]"}/>
                            <div className={"text-white text-[25px] md:text-[32px]"}>Speed</div>
                        </div>
                        <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>
                            Streamline tournament operations like player registration, match scheduling, and prize
                            distribution with automation.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}