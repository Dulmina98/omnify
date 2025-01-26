export function Steps() {

    return (
        <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] relative z-10 py-[200px]"}>
            <div className={"w-full relative"}>
                <div className={"text-[64px] text-white w-full max-w-[750px] mb-[125px]"}>Your <span
                    className="text-theme-crimson">Journey</span> with Omnify in <span
                    className="text-theme-crimson">4</span> Simple <span className="text-theme-crimson">Steps</span>
                </div>
                <div className={"w-[calc(100%-525px)] absolute right-0 bottom-7 h-[1px] bg-white"}/>
            </div>
            <div className={"w-full flex items-center gap-[25px] flex-wrap justify-between"}>
                <div
                    className={"h-[415px] w-[305px] relative flex flex-col justify-center bg-[url(/assets/images/card/step-card.png)] bg-cover bg-no-repeat"}>
                    <div className={"z-10 px-[60px]"}>
                        <div
                            className={"w-[63px] h-[63px] rounded-full bg-white/10 flex items-center justify-center font-semibold text-[28px] text-white"}>1
                        </div>
                        <div className={"text-white text-[24px] mt-5"}>Create or Join a Tournament</div>
                        <div className={"text-muted-white text-[16px] mt-5"}>Organizers can set up tournaments with
                            customizable rules, while players can easily
                            register and pay entry fees.
                        </div>
                    </div>
                </div>
                <div
                    className={"h-[415px] w-[305px] relative flex flex-col justify-center bg-[url(/assets/images/card/step-card-light.png)] bg-cover bg-no-repeat"}>
                    <div className={"z-10 px-[60px]"}>
                        <div
                            className={"w-[63px] h-[63px] rounded-full bg-white/10 flex items-center justify-center font-semibold text-[28px] text-white"}>2
                        </div>
                        <div className={"text-white text-[24px] mt-5"}>Play and Verify Matches</div>
                        <div className={"text-muted-white text-[16px] mt-5"}>Match results are submitted by organizers
                            and verified by players, ensuring accuracy and fairness.
                        </div>
                    </div>
                </div>
                <div
                    className={"h-[415px] w-[305px] relative flex flex-col justify-center bg-[url(/assets/images/card/step-card.png)] bg-cover bg-no-repeat"}>
                    <div className={"z-10 px-[60px]"}>
                        <div
                            className={"w-[63px] h-[63px] rounded-full bg-white/10 flex items-center justify-center font-semibold text-[28px] text-white"}>3
                        </div>
                        <div className={"text-white text-[24px] mt-5"}>Automated Prize Distribution</div>
                        <div className={"text-muted-white text-[16px] mt-5"}>Once the tournament ends, prizes are
                            automatically distributed to winners based on pre-defined rules.
                        </div>
                    </div>
                </div>
                <div
                    className={"h-[415px] w-[305px] relative flex flex-col justify-center bg-[url(/assets/images/card/step-card-light.png)] bg-cover bg-no-repeat"}>
                    <div className={"z-10 px-[60px]"}>
                        <div
                            className={"w-[63px] h-[63px] rounded-full bg-white/10 flex items-center justify-center font-semibold text-[28px] text-white"}>4
                        </div>
                        <div className={"text-white text-[24px] mt-5"}>Play and Verify Matches</div>
                        <div className={"text-muted-white text-[16px] mt-5"}>All transactions and match results are
                            recorded on the blockchain, visible to all participants.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}