'use client'

import {SignUp, useUser} from '@clerk/nextjs';
import {useEffect, useState} from 'react';
import {Loading} from "@/app/components/Loading";
import {useRouter} from 'next/navigation';

export default function Page() {
    const {isLoaded, isSignedIn} = useUser();
    const [signUpComplete, setSignUpComplete] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setSignUpComplete(true);
            router.push('/become-a-member');
        }
    }, [isLoaded, isSignedIn, router]);

    return (
        <div
            className={'min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-[25px] xl:px-[100px] my-[100px]'}>
            <div className={"text-[45px] md:text-[64px] text-white w-full text-center"}>Sign Up
            </div>
            <div
                className={"text-white text-center text-[25px] md:text-[32px] max-w-[675px] w-full mx-auto mb-[35px] lg:mb-[75px]"}>Join
                us today!
            </div>
            {!signUpComplete ? (
                <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                />
            ) : (
                <div className='flex justify-center items-center'>
                    <Loading/>
                </div>
            )}
        </div>
    );
}