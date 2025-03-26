import Image from "next/image";

export function WhyLoveOmnify() {

    return (
        <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-20 py-[100px] md:py-[200px]"}>
            <div className={"w-full flex justify-center"}>
                <div className={"text-[45px] md:text-[64px] text-white md:text-center w-[750px] mb-[125px]"}><span
                    className="text-theme-crimson">Why</span> Gamers and Organizers <span
                    className="text-theme-crimson">Love Omnify?</span></div>
            </div>
            <div
                className={"flex flex-col md:flex-row flex-wrap justify-between xl:px-[125px] gap-x-[20px] gap-y-[90px]"}>
                <div className={" lg:w-[calc(50%-20px)]"}>
                    <div className={"text-white mb-[35px] text-[32px]"}>Players</div>
                    <div className={"text-muted-white text-[16px] max-w-fit]"}>Transparent and fair tournaments with
                        no biased decisions.
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-fit] py-5"}>Secure prize distribution with no
                        delays.
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-fit]"}>Easy registration and participation
                        process.
                    </div>
                </div>
                <div className={" lg:w-[calc(50%-20px)]"}>
                    <div className={"text-white mb-[35px] text-[32px]"}>Organizers</div>
                    <div className={"text-muted-white text-[16px] max-w-fit]"}>Automated tournament management reduces
                        manual workload.
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-fit] py-5"}>Increased trust and credibility
                        among participants.
                    </div>
                    <div className={"text-muted-white text-[16px] max-w-fit]"}>Secure and tamper-proof record-keeping.
                    </div>
                </div>
            </div>
            <div className={"flex items-center justify-center gap-[20px] mt-[145px]"}>
                <Image src={"/assets/images/icons/star.png"} alt={"star-icon"} className={"w-[39px]"} width={39}
                       height={39}/>
                <div className={"text-[25px] lg:text-[35px] text-white"}>Transparency, Security, Automation – All in One
                    Platform.
                </div>
            </div>
        </div>
    )
}