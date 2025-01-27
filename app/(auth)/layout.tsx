'use client'

const AuthLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className={'relative bg-black flex flex-col items-center justify-center w-full h-full'}>

            <div className='z-30'>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout
