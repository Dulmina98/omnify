'use client'

import {useForm} from "react-hook-form";
import TabBar from "@/app/components/tab-bar/tab-bar";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type FormData = {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    gameAlias: string;
    gameLevel: string;
    preferredGame: string;
    platform: string;
};

export default function Page() {
    const tabs = [
        {name: "Players"},
        {name: "Organizers"},
    ];

    const form = useForm<FormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            mobileNumber: "",
            gameAlias: "",
            gameLevel: "",
            preferredGame: "",
            platform: "",
        },
    });

    const onSubmit = (data: FormData) => {
        console.log("Form submitted with data:", data);
    };

    return (
        <div className={"w-full min-h-screen relative flex "}>
            <div
                className={"w-1/2 bg-red-700 min-h-screen bg-[url(/assets/images/bg/become-member-bg.jpg)] bg-cover bg-right relative"}>
                <div className={"w-full h-full flex justify-end"}>
                    <div className={"max-w-[900px] h-full w-full  relative"}>
                        <div className={"absolute left-0 bottom-14 text-white text-[48px] px-[25px] lg:px-[100px]"}>Your
                            Gateway to the
                            World
                            of Competitive Gaming.
                        </div>
                    </div>
                </div>
            </div>
            <div className={"w-1/2 min-h-screen h-full flex flex-col justify-center"}>
                <div className={"max-w-[900px] w-full px-[25px] lg:px-[100px] py-[100px]"}>
                    <div className={"mb-[60px]"}>
                        <div className={"text-[64px] text-white"}>Become a member</div>
                        <TabBar
                            tabs={tabs}
                            initialActiveTab="Players"
                        />
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[35px]">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>First Name</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your first name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Last Name</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your last name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobileNumber"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Mobile
                                            Number</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your mobile number" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gameAlias"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Game Alias/ID (In-game
                                            name)</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your game alias/ID" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gameLevel"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Game
                                            Level/Rank</FormLabel>
                                        <FormControl>
                                            <Input className={"h-[46px]"}
                                                   placeholder="Enter your game level/rank" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="preferredGame"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Preferred
                                            Game(s)</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={"h-[46px]"}>
                                                    <SelectValue placeholder="Select your preferred game"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="doomEternal">Doom Eternal</SelectItem>
                                                    <SelectItem value="mortalKombat">Mortal Kombat</SelectItem>
                                                    <SelectItem value="starCraftII">StarCraft II</SelectItem>
                                                    <SelectItem value="fifa">Fifa</SelectItem>
                                                    <SelectItem value="tetris">Tetris</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="platform"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={"text-white text-[16px] mb-[10px]"}>Platform</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={"h-[46px]"}>
                                                    <SelectValue className={"text-muted-gray"}
                                                                 placeholder="Select your platform"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="pc">PC</SelectItem>
                                                    <SelectItem value="console">Console</SelectItem>
                                                    <SelectItem value="mobile">Mobile</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className={"flex  gap-[20px] pt-[60px]"}>
                                <Button className={"h-[46px] w-[215px] text-[18px]"} variant={"secondary"}>Connect
                                    Wallet</Button>
                                <Button className={"h-[46px] w-[215px] text-[18px]"} type={"submit"}>Become a
                                    member</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}