"use client";

import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {useUser} from "@clerk/nextjs";
import {api} from "@/convex/_generated/api";
import {TabBar} from "@/app/components/tab-bar/tab-bar";
import {useState} from "react";

type PlayersFormData = {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    gameAlias: string;
    gameLevel: number;
    preferredGame: string;
    platform: string;
};

type OrganizersFormData = {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    organizationName: string;
    roleInOrganization: string;
    countryRegion: string;
    websiteUrl: string;
    preferredCommunicationChannel: string;
};

export default function Page() {
    const {mutate: playerMutate} = useApiMutation(api.players.createPlayer);
    const {mutate: organizerMutate} = useApiMutation(api.organizers.createOrganizer);
    const {user, isLoaded, isSignedIn} = useUser();
    const [activeTab, setActiveTab] = useState("Players");

    const tabs = [
        {name: "Players"},
        {name: "Organizers"},
    ];

    const form = useForm<PlayersFormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            mobileNumber: "",
            gameAlias: "",
            gameLevel: 0,
            preferredGame: "",
            platform: "",
        },
    });

    const organizersForm = useForm<OrganizersFormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            mobileNumber: "",
            organizationName: "",
            roleInOrganization: "",
            countryRegion: "",
            websiteUrl: "",
            preferredCommunicationChannel: "",
        },
    });


    const onSubmit = async (data: PlayersFormData) => {
        try {
            if (!user) {
                console.error("User is not signed in.");
                return;
            }

            const userEmail =
                user.emailAddresses?.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ?? "";

            await playerMutate({
                clerkId: user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                mobileNum: data.mobileNumber,
                ign: data.gameAlias,
                level: data.gameLevel,
                game: data.preferredGame,
                platform: data.platform,
                email: userEmail,
            });

        } catch (error) {
            console.error("Error creating player:", error);
        }
    };

    const onOrganizersSubmit = async (data: OrganizersFormData) => {
        try {
            if (!user) {
                console.error("User is not signed in.");
                return;
            }

            const userEmail =
                user.emailAddresses?.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ?? "";

            await organizerMutate({
                clerkId: user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                mobileNum: data.mobileNumber,
                organizationName: data.organizationName,
                role: data.roleInOrganization,
                country: data.countryRegion,
                websiteUrl: data.websiteUrl,
                preferredCommunicationChannel: data.preferredCommunicationChannel,
                email: userEmail,
            });

        } catch (error) {
            console.error("Error creating organizer:", error);
        }
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <div>Please sign in to become a member.</div>;
    }

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
                <div className={"max-w-[900px] w-full px-[25px] lg:px-[100px] py-[200px]"}>
                    <div className={"mb-[60px]"}>
                        <div
                            className={"text-[64px] text-white"}>Become {activeTab === "Players" ? "a Player" : "an Organizer"}</div>
                        <TabBar
                            tabs={tabs}
                            initialActiveTab="Players"
                            onTabChange={(tabName) => setActiveTab(tabName)} // Pass the handler
                        />
                    </div>

                    {activeTab === "Players" && <Form {...form}>
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
                                            <Input
                                                type="number"
                                                className="h-[46px]"
                                                placeholder="Enter your game level/rank"
                                                value={field.value}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                            />
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
                                <Button className={"h-[46px] w-[215px] text-[18px]"} type={"submit"}>Become a
                                    player</Button>
                            </div>
                        </form>
                    </Form>
                    }
                    {activeTab === "Organizers" && (
                        <Form {...organizersForm}>
                            <form onSubmit={organizersForm.handleSubmit(onOrganizersSubmit)} className="space-y-[35px]">
                                <FormField
                                    control={organizersForm.control}
                                    name="firstName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>First
                                                Name</FormLabel>
                                            <FormControl>
                                                <Input className={"h-[46px]"}
                                                       placeholder="Enter your first name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizersForm.control}
                                    name="lastName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Last
                                                Name</FormLabel>
                                            <FormControl>
                                                <Input className={"h-[46px]"}
                                                       placeholder="Enter your last name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizersForm.control}
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
                                    control={organizersForm.control}
                                    name="organizationName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Organization/Company
                                                Name</FormLabel>
                                            <FormControl>
                                                <Input className={"h-[46px]"}
                                                       placeholder="Enter your organization/company name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizersForm.control}
                                    name="roleInOrganization"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Role/Position in
                                                the Organization</FormLabel>
                                            <FormControl>
                                                <Input className={"h-[46px]"}
                                                       placeholder="Enter your role/position" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizersForm.control}
                                    name="countryRegion"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className={"text-white text-[16px] mb-[10px]"}>Country/Region</FormLabel>
                                            <FormControl>
                                                <Input className={"h-[46px]"}
                                                       placeholder="Enter your country/region" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizersForm.control}
                                    name="websiteUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Website URL (if
                                                applicable)</FormLabel>
                                            <FormControl>
                                                <Input className={"h-[46px]"}
                                                       placeholder="Enter your website URL" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={organizersForm.control}
                                    name="preferredCommunicationChannel"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Preferred
                                                Communication Channel</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue
                                                            placeholder="Select your preferred communication channel"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="email">Email</SelectItem>
                                                        <SelectItem value="discord">Discord</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className={"flex gap-[20px] pt-[60px]"}>
                                    <Button className={"h-[46px] w-[215px] text-[18px]"} type={"submit"}>Become an
                                        organizer</Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}