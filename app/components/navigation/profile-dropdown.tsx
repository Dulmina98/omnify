import {useCurrentUser} from "@/services/user-service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {LogOut, User} from "lucide-react";
import Image from "next/image";
import {useClerk} from "@clerk/nextjs";
import Link from "next/link";

export function ProfileDropdown() {
    const {user, role} = useCurrentUser();
    const {signOut} = useClerk();

    const randomImageNum = Math.floor(Math.random() * (35 - 20 + 1)) + 20;

    return (
        <>
            <div className={'hidden md:block'}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={'w-[30px] md:w-10 h-[30px] md:h-10 cursor-pointer'}>
                            <Image
                                src={`https://avatar.iran.liara.run/public/${randomImageNum}`}
                                alt={'avatar'}
                                width={40}
                                height={40}
                                className={'rounded-full'}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='min-w-56 bg-black/35 backdrop-blur-lg text-white border-muted-gray'
                        side='bottom'
                        align={'end'}
                    >
                        <DropdownMenuLabel>
                            <div className={'flex gap-2'}>
                                <div className={'w-10 h-10'}>
                                    <Image
                                        src={`https://avatar.iran.liara.run/public/${randomImageNum}`}
                                        alt={'avatar'}
                                        width={40}
                                        height={40}
                                        className={'rounded-full'}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/assets/placeholder.jpg'
                                        }}
                                    />
                                </div>
                                <div>
                                    <div
                                        className={'text-base font-medium text-main-text'}>{user?.firstName} {user?.lastName}</div>
                                    {role && <div
                                        className={'text-xs font-normal text-main-text capitalize'}>{role}</div>}
                                    <div
                                        className={'text-xs font-normal text-[#897EA7] dark:text-[#70707C]'}>{user?.email}</div>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className={'bg-background-light'}/>
                        <DropdownMenuGroup>
                            <Link href={"/user-profile"}>
                                <DropdownMenuItem
                                    className={'rounded-[10px] focus:bg-[#7047EB]/10 focus:text-brand-purple cursor-pointer'}
                                >
                                    <User className="mr-2 h-4 w-4"/>
                                    <span>My Profile</span>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className={'bg-background-light'}/>
                        <DropdownMenuItem
                            onClick={() => signOut({redirectUrl: '/'})}
                            className={'rounded-[10px] focus:bg-[#7047EB]/10 focus:text-brand-purple cursor-pointer'}
                        >
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>

    )
}