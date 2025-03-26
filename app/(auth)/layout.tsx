'use client'

const AuthLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className={'relative bg-black flex flex-col items-center justify-center w-full h-full'}>

            <div className='z-30 flex w-full relative'>
                <div
                    className={
                        "absolute left-0 top-0 w-full md:w-1/2 min-h-screen bg-[url(/assets/images/bg/become-member-bg.jpg)] bg-cover bg-right md:relative"
                    }
                ></div>
                <div
                    className={"w-full md:w-1/2 min-h-screen h-full flex flex-col justify-center bg-black/80 backdrop-blur-lg"}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
