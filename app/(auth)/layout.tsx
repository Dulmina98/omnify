'use client'

const AuthLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className={'relative bg-black flex flex-col items-center justify-center w-full h-full'}>

            <div className='z-30 flex w-full relative'>
                <div
                    className={
                        "absolute left-0 top-0 w-full md:w-1/2 min-h-screen bg-[url(/assets/images/bg/become-member-bg.jpg)] bg-cover bg-right md:relative"
                    }
                >
                    <div className={"w-full h-full flex justify-end"}>
                        <div className={"max-w-[900px] h-full w-full relative"}>
                            <div
                                className={
                                    "lg:block hidden absolute left-0 bottom-14 text-white text-[48px] px-[25px] lg:px-[100px]"
                                }
                            >Where Champions <br/>Begin Their Legacy.
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={"w-full md:w-1/2 min-h-screen h-full flex flex-col justify-center bg-black/80 backdrop-blur-lg"}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
