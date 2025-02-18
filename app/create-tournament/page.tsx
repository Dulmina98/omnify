"use client";

import {FormProvider, useForm} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {api} from "@/convex/_generated/api";
import {useCurrentUser} from "@/services/user-service";
import {GameTypes} from "@/types/game-types";

type TournamentFormData = {
    tournamentName: string;
    gameTitle: string;
    description: string;
    tournamentType: string;
    teamSize: string;
    numberOfPlayersRequired: number;
    startDate: number;
    endDate: number;
    entryFee: string;
    paymentMethod: string;
    deadline: number;
    totalPrizePool: number;
    prizeDistributionMethod: string;
    gameMode: string;
    stageSelection: string;
    characterSelectionRules: string;
    bannedCharactersItems: string;
    disconnectPolicy: string;
    matchDisputeResolution: string;
    pauseBreakRules: string;
};
export default function CreateTournament() {
    const {mutate} = useApiMutation(api.tournaments.createTournament);
    const {user} = useCurrentUser();

    const form = useForm<TournamentFormData>({
        defaultValues: {
            tournamentName: "",
            gameTitle: "",
            description: "",
            tournamentType: "",
            teamSize: "",
            numberOfPlayersRequired: 0,
            startDate: 0,
            endDate: 0,
            entryFee: "",
            paymentMethod: "",
            deadline: 0,
            totalPrizePool: 0,
            prizeDistributionMethod: "",
            gameMode: "",
            stageSelection: "",
            characterSelectionRules: "",
            bannedCharactersItems: "",
            disconnectPolicy: "",
            matchDisputeResolution: "",
            pauseBreakRules: "",
        },
    });

    const onSubmit = (data: TournamentFormData) => {
        try {
            if (!user) {
                console.error("User is not signed in.");
                return;
            }

            const startDateTimestamp = new Date(data.startDate).getTime();
            const endDateTimestamp = new Date(data.endDate).getTime();
            const deadlineTimestamp = new Date(data.deadline).getTime();

            const tournamentData = {
                ...data, startDate: startDateTimestamp,
                endDate: endDateTimestamp,
                deadline: deadlineTimestamp,
                entryFee: parseFloat(data.entryFee) || 0,
            };

            mutate({
                userId: user.userId,
                tournamentName: tournamentData.tournamentName,
                gameTitle: tournamentData.gameTitle,
                description: tournamentData.description,
                tournamentType: tournamentData.tournamentType,
                teamSize: tournamentData.teamSize,
                numberOfPlayersRequired: tournamentData.numberOfPlayersRequired,
                startDate: tournamentData.startDate,
                endDate: tournamentData.endDate,
                entryFee: tournamentData.entryFee,
                paymentMethod: tournamentData.paymentMethod,
                deadline: tournamentData.deadline,
                totalPrizePool: tournamentData.totalPrizePool,
                prizeDistributionMethod: tournamentData.prizeDistributionMethod,
                gameMode: tournamentData.gameMode,
                stageSelection: tournamentData.stageSelection,
                characterSelectionRules: tournamentData.characterSelectionRules,
                bannedCharactersItems: tournamentData.bannedCharactersItems,
                disconnectPolicy: tournamentData.disconnectPolicy,
                matchDisputeResolution: tournamentData.matchDisputeResolution,
                pauseBreakRules: tournamentData.pauseBreakRules,
            }).then(() => {
                console.log("Tournament created successfully")
            });
        } catch (error) {
            console.log(error)
        }
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
                                                        {Object.entries(GameTypes).map(([key, value]) => (
                                                            <SelectItem key={key} value={value}>
                                                                {value.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Tournament Description (Textarea) */}

                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem className={"flex-1 mt-10"}>
                                            <FormLabel
                                                className={"text-white text-[16px] mb-[10px]"}>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter tournament description" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

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
                                            <FormItem className={"flex-[1_1_30%]"}>
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
                                            <FormItem className={"flex-[1_1_30%]"}>
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

                                    {/* Number of Players Required (Select Dropdown) */}
                                    <FormField
                                        control={form.control}
                                        name="numberOfPlayersRequired"
                                        render={({field}) => (
                                            <FormItem className={"flex-[1_1_30%]"}>
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>
                                                    Number of Players Required
                                                </FormLabel>
                                                <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                                                    <FormControl>
                                                        <SelectTrigger className={"h-[46px]"}>
                                                            <SelectValue placeholder="Select number of players"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="4">4</SelectItem>
                                                        <SelectItem value="8">8</SelectItem>
                                                        <SelectItem value="16">16</SelectItem>
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
                                                    <Input
                                                        type="date"
                                                        className={"h-[46px]"}
                                                        {...field}
                                                        value={field.value || ""}
                                                    />
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
                                                    <Input
                                                        type="date"
                                                        className={"h-[46px]"}
                                                        {...field}
                                                        value={field.value || ""}
                                                    />
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
                                                <FormLabel className={"text-white text-[16px] mb-[10px]"}>Entry Fee
                                                    (ETH)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        className={"h-[46px]"}
                                                        placeholder="Enter entry fee (e.g., 0.005)"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^-?\d*\.?\d*$/.test(value)) {
                                                                field.onChange(value === '' ? '' : value);
                                                            } else {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        value={field.value === '' ? '0' : field.value}
                                                    />
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
                                                    <Input
                                                        type="date"
                                                        className={"h-[46px]"}
                                                        {...field}
                                                        value={field.value || ""}
                                                    />
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
                                                    <Input
                                                        type="number"
                                                        className={"h-[46px]"}
                                                        placeholder="Enter total prize pool"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    />
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
                            </div>

                            <div
                                className={"font-semibold text-[20px] text-white w-full pb-[20px] border-b border-b-muted-gray mb-[45px] mt-[60px]"}>Match
                                Rules & Settings
                            </div>

                            <div className={"flex w-full gap-[30px] flex-wrap"}>

                                {/* Game Mode/Ruleset (Select Input) */}
                                <FormField
                                    control={form.control}
                                    name="gameMode"
                                    render={({field}) => (
                                        <FormItem className={"flex-[1_1_45%]"}>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Game
                                                Mode/Ruleset</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue placeholder="Select game mode"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="bo3">Best of 3 (BO3)</SelectItem>
                                                    <SelectItem value="bo5">Best of 5 (BO5)</SelectItem>
                                                    <SelectItem value="time-limit">Time Limit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Stage Selection (Select Input) */}
                                <FormField
                                    control={form.control}
                                    name="stageSelection"
                                    render={({field}) => (
                                        <FormItem className={"flex-[1_1_45%]"}>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Stage
                                                Selection</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue placeholder="Select stage selection"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="random">Random</SelectItem>
                                                    <SelectItem value="players-choice">Player’s Choice</SelectItem>
                                                    <SelectItem value="pre-selected">Pre-Selected (Organizer
                                                        Decides)</SelectItem>
                                                    <SelectItem value="register-order">Register Order</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Character Selection Rules (Select Input) */}
                                <FormField
                                    control={form.control}
                                    name="characterSelectionRules"
                                    render={({field}) => (
                                        <FormItem className={"flex-[1_1_45%]"}>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Character
                                                Selection Rules</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue placeholder="Select character selection rules"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="any-character">Any Character Allowed</SelectItem>
                                                    <SelectItem value="same-character">Same Character for Entire
                                                        Tournament</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Banned Characters/Items (Select Input) */}
                                <FormField
                                    control={form.control}
                                    name="bannedCharactersItems"
                                    render={({field}) => (
                                        <FormItem className={"flex-[1_1_45%]"}>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Banned
                                                Characters/Items</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue placeholder="Select banned characters/items"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="no-guest-characters">No Guest
                                                        Characters</SelectItem>
                                                    <SelectItem value="no-special-characters">No Special
                                                        Characters</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Disconnect Policy (Select Input) */}
                                <FormField
                                    control={form.control}
                                    name="disconnectPolicy"
                                    render={({field}) => (
                                        <FormItem className={"flex-[1_1_45%]"}>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Disconnect
                                                Policy</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue placeholder="Select disconnect policy"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="immediate-loss">Immediate Loss</SelectItem>
                                                    <SelectItem value="rematch-before-round-1">Rematch if Occurs Before
                                                        Round 1 Ends</SelectItem>
                                                    <SelectItem value="organizer-decision">Organizer
                                                        Decision</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />


                                {/* Pause/Break Rules (Select Input) */}
                                <FormField
                                    control={form.control}
                                    name="pauseBreakRules"
                                    render={({field}) => (
                                        <FormItem className={"flex-[1_1_45%]"}>
                                            <FormLabel className={"text-white text-[16px] mb-[10px]"}>Pause/Break
                                                Rules</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className={"h-[46px]"}>
                                                        <SelectValue placeholder="Select pause/break rules"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="technical-issues-only">Pausing is only allowed
                                                        for technical issues</SelectItem>
                                                    <SelectItem value="one-pause-per-match">One pause per
                                                        match</SelectItem>
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