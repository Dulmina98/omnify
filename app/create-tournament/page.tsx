"use client";

import {FormProvider, useForm} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

type TournamentFormData = {
    tournamentName: string;
    gameTitle: string;
    description: string;
    tournamentType: string;
    teamSize: string;
    startDate: number;
    endDate: number;
    entryFee: number;
    paymentMethod: string;
    deadline: number;
    minLevel: number;
    totalPrizePool: number;
    prizeDistributionMethod: string;
    ruleset: string;
};

export default function CreateTournament() {
    const form = useForm<TournamentFormData>({
        defaultValues: {
            tournamentName: "",
            gameTitle: "",
            description: "",
            tournamentType: "",
            teamSize: "",
            startDate: 0,
            endDate: 0,
            entryFee: 0,
            paymentMethod: "",
            deadline: 0,
            minLevel: 0,
            totalPrizePool: 0,
            prizeDistributionMethod: "",
            ruleset: "",
        },
    });

    const onSubmit = (data: TournamentFormData) => {
        console.log(data); // Handle form submission
    };

    return (
        <div className={"w-full min-h-screen bg-[url(/assets/images/bg/create-tournament-bg.jpg)] bg-cover bg-bottom"}>
            <div className={"max-w-[1800px] w-full px-[25px] lg:px-[100px] py-[150px] mx-auto"}>
                <div className={"text-[64px] text-white text-center w-full"}>
                    <span className={"text-theme-crimson"}>Organize</span> a Tournament
                </div>
                <div className={"text-white text-center text-[32px] max-w-[675px] w-full mx-auto mb-[140px]"}>
                    Set up and manage your blockchain-powered tournament with ease!
                </div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div
                            className={"border border-muted-gray rounded-[10px] px-[90px] py-[40px] bg-black/75 backdrop-blur-lg"}>
                            <div>
                                <div
                                    className={"font-semibold text-[20px] text-white w-full pb-[20px] border-b border-b-muted-gray mb-[45px]"}>
                                    Tournament Details
                                </div>
                                <div className={"flex w-full gap-[30px] flex-wrap"}>
                                    {/* Tournament Name */}
                                    <FormField
                                        control={form.control}
                                        name="tournamentName"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Tournament
                                                    Name</FormLabel>
                                                <FormControl>
                                                    <Input className={"h-[46px]"}
                                                           placeholder="Enter tournament name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Game Title (Select Input) */}
                                    <FormField
                                        control={form.control}
                                        name="gameTitle"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Game
                                                    Title</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={"h-[46px]"}>
                                                            <SelectValue placeholder="Select a game"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="game1">Game 1</SelectItem>
                                                        <SelectItem value="game2">Game 2</SelectItem>
                                                        <SelectItem value="game3">Game 3</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Tournament Description (Textarea) */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({field}) => (
                                            <FormItem className={"flex-1"}>
                                                <FormLabel
                                                    className={"text-white text-[16px] mb-[10px]"}>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter tournament description" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div
                                    className={"font-semibold text-[20px] text-white w-full pb-[20px] border-b border-b-muted-gray mb-[45px] mt-[60px]"}>Tournament
                                    Types & Format
                                </div>

                                <div className={"flex w-full gap-[30px] flex-wrap"}>
                                    {/* Tournament Type (Select Input) */}
                                    <FormField
                                        control={form.control}
                                        name="tournamentType"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Tournament
                                                    Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={"h-[46px]"}>
                                                            <SelectValue placeholder="Select tournament type"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="single-elimination">Single
                                                            Elimination</SelectItem>
                                                        <SelectItem value="double-elimination">Double
                                                            Elimination</SelectItem>
                                                        <SelectItem value="round-robin">Round Robin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Team Size (Select Input) */}
                                    <FormField
                                        control={form.control}
                                        name="teamSize"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Team
                                                    Size</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={"h-[46px]"}>
                                                            <SelectValue placeholder="Select team size"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="1v1">1v1</SelectItem>
                                                        <SelectItem value="2v2">2v2</SelectItem>
                                                        <SelectItem value="5v5">5v5</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Start Date */}
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Start
                                                    Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" className={"h-[46px]"} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* End Date */}
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>End
                                                    Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" className={"h-[46px]"} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div
                                    className={"font-semibold text-[20px] text-white w-full pb-[20px] border-b border-b-muted-gray mb-[45px] mt-[60px]"}>Entry
                                    Requirement & Registration
                                </div>

                                <div className={"flex w-full gap-[30px] flex-wrap"}>
                                    {/* Entry Fee */}
                                    <FormField
                                        control={form.control}
                                        name="entryFee"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Entry
                                                    Fee</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className={"h-[46px]"}
                                                           placeholder="Enter entry fee" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Payment Method (Select Input) */}
                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Payment
                                                    Method</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={"h-[46px]"}>
                                                            <SelectValue placeholder="Select payment method"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="crypto">Crypto</SelectItem>
                                                        <SelectItem value="credit-card">Credit Card</SelectItem>
                                                        <SelectItem value="paypal">PayPal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Deadline */}
                                    <FormField
                                        control={form.control}
                                        name="deadline"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel
                                                    className={"text-white text-[16px] mb-[10px]"}>Deadline</FormLabel>
                                                <FormControl>
                                                    <Input type="date" className={"h-[46px]"} {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Minimum Level */}
                                    <FormField
                                        control={form.control}
                                        name="minLevel"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_45%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Minimum
                                                    Level</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className={"h-[46px]"}
                                                           placeholder="Enter minimum level" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div
                                    className={"font-semibold text-[20px] text-white w-full pb-[20px] border-b border-b-muted-gray mb-[45px] mt-[60px]"}>Prize
                                    Pool & Distribution
                                </div>

                                <div className={"flex w-full gap-[30px] flex-wrap"}>
                                    {/* Total Prize Pool */}
                                    <FormField
                                        control={form.control}
                                        name="totalPrizePool"
                                        render={({field}) => (
                                            <FormItem className={"flex-1"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Total Prize
                                                    Pool</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className={"h-[46px]"}
                                                           placeholder="Enter total prize pool" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Prize Distribution Method (Select Input) */}
                                    <FormField
                                        control={form.control}
                                        name="prizeDistributionMethod"
                                        render={({field}) => (
                                            <FormItem className={"flex-1"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Prize
                                                    Distribution Method</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={"h-[46px]"}>
                                                            <SelectValue
                                                                placeholder="Select prize distribution method"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="winner-takes-all">Winner Takes
                                                            All</SelectItem>
                                                        <SelectItem value="top-3">Top 3</SelectItem>
                                                        <SelectItem value="custom">Custom</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div
                                    className={"font-semibold text-[20px] text-white w-full pb-[20px] border-b border-b-muted-gray mb-[45px] mt-[60px]"}>Match
                                    Rules & Settings
                                </div>

                                {/* Ruleset (Select Input) */}
                                <FormField
                                    control={form.control}
                                    name="ruleset"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className={"text-white text-[16px] mb-[10px]"}>Ruleset</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue placeholder="Select ruleset"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="standard">Standard</SelectItem>
                                                    <SelectItem value="custom">Custom</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-[80px]">
                                <Button type="submit"
                                        className="w-full h-[46px] text-[16px] hover:bg-theme-crimson-dark">
                                    Create Tournament
                                </Button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}