'use client'

import {SignUp, useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'
import {Loading} from "@/app/components/Loading";

export default function Page() {
    const {isLoaded, isSignedIn} = useUser()
    const [signUpComplete, setSignUpComplete] = useState(false)

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            setSignUpComplete(true)
        }
    }, [isLoaded, isSignedIn])

    return (
        <div className={'min-h-[calc(100vh-200px)] flex flex-col items-center justify-center'}>
            {!signUpComplete ? (
                <SignUp fallbackRedirectUrl={'/'}/>
            ) : (
                <div className='flex justify-center items-center'>
                    <Loading/>
                </div>
            )}
        </div>
    )
}
