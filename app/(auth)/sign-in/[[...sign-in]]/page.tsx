'use client'

import {SignIn} from '@clerk/nextjs'

export default function Page() {

    return (

        <div className={'min-h-[calc(100vh-200px)] flex flex-col items-center justify-center'}>
            <SignIn/>
        </div>
    )
}
