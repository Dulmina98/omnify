import Image from "next/image";

export function WhyOmnify() {

    return (
        <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[200px]"}>
            <div className={"text-[64px] text-white text-center w-full mb-[125px]"}>Why Choose <span
                className={"text-theme-crimson"}>Omnify?</span></div>
            <div className={"flex flex-wrap justify-between px-[125px] gap-y-[90px]"}>
                <div>
                    <div className={"flex items-center gap-[15px] mb-[35px]"}>
                        <Image src={"/assets/images/icons/why-omnify/transparency.png"} alt={"icon"} width={30}
                               height={30} className={"w-[30px] h-[30px]"}/>
                        <div className={"text-white text-[32px] "}>Transparency</div>
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>Every transaction and
                        match result is
                        recorded on the blockchain, ensuring complete transparency for all participants.
                    </div>
                </div>
                <div>
                    <div className={"flex items-center gap-[15px] mb-[35px]"}>
                        <Image src={"/assets/images/icons/why-omnify/protection.png"} alt={"icon"} width={30}
                               height={30} className={"w-[30px] h-[30px]"}/>
                        <div className={"text-white text-[32px] "}>Transparency</div>
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>Decentralized
                        architecture eliminates
                        single points of failure, protecting against hacks and fraud.
                    </div>
                </div>
                <div>
                    <div className={"flex items-center gap-[15px] mb-[35px]"}>
                        <Image src={"/assets/images/icons/why-omnify/fair.png"} alt={"icon"} width={30} height={30}
                               className={"w-[30px] h-[30px]"}/>
                        <div className={"text-white text-[32px] "}>Transparency</div>
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>Automated smart
                        contracts ensure
                        unbiased decision-making and fair prize distribution.
                    </div>
                </div>
                <div>
                    <div className={"flex items-center gap-[15px] mb-[35px]"}>
                        <Image src={"/assets/images/icons/why-omnify/speed.png"} alt={"icon"} width={30} height={30}
                               className={"w-[30px] h-[30px]"}/>
                        <div className={"text-white text-[32px] "}>Transparency</div>
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-[450px] leading-[16px]"}>Streamline tournament
                        operations like
                        player registration, match scheduling, and prize distribution with automation.
                    </div>
                </div>
            </div>
        </div>
    )
}