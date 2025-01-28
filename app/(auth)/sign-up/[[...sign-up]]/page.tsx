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
            // Redirect to the desired page after sign-up is complete
            router.push('/become-a-member');
        }
    }, [isLoaded, isSignedIn, router]);

    return (
        <div className={'min-h-[calc(100vh-200px)] flex flex-col items-center justify-center'}>
            {!signUpComplete ? (
                <SignUp/>
            ) : (
                <div className='flex justify-center items-center'>
                    <Loading/>
                </div>
            )}
        </div>
    );
}