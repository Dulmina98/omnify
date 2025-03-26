'use client'

import {SignIn} from '@clerk/nextjs'

export default function Page() {

    return (

        <div className={'min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-[25px] xl:px-[100px]'}>
            <div className={"text-[45px] md:text-[64px] text-white text-center w-full"}><span
                className={"text-theme-crimson"}>Sign</span> In
            </div>
            <div
                className={"text-white text-center text-[25px] md:text-[32px] max-w-[675px] w-full mx-auto mb-[75px]"}>
                Welcome back!
            </div>
            <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
            />
        </div>
    )
}
