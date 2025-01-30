import * as React from "react"

import {cn} from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({className, type, ...props}, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-[5px] border border-outline-gray bg-black px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm text-white file:font-medium file:text-foreground placeholder:text-muted-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:text-white focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[16px]",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export {Input}
