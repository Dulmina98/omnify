"use client";

import {FormProvider, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {api} from "@/convex/_generated/api";
import {useCurrentUser} from "@/services/user-service";
import {CreateTournamentSuccessModal} from "@/app/components/modals/create-tournament-success-modal";
import {useState} from "react";
import {ethers} from "ethers";
import TournamentArtifact from "../../smart-contract/artifacts/contracts/Tournament.sol/Tournament.json"
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
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
    totalPrizePool: number;
    prizeDistributionMethod: string;
    pauseBreakRules: string;
};

export default function CreateTournament() {
    const {mutate} = useApiMutation(api.tournaments.createTournament);
    const {user} = useCurrentUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentError, setDeploymentError] = useState<string | null>(null);

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
            totalPrizePool: 0,
            prizeDistributionMethod: "",
        },
    });

    const onSubmit = async (data: TournamentFormData) => {
        try {
            if (!user) {
                console.error("User is not signed in.");
                return;
            }

            setIsDeploying(true);
            setDeploymentError(null);

            if (!window.ethereum) {
                throw new Error("Please install MetaMask or another Ethereum wallet provider.");
            }
            await window.ethereum.request({method: "eth_requestAccounts"});
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Deploy the smart contract
            const entryFeeInWei = ethers.parseEther(data.entryFee.toString() || "0");
            const factory = new ethers.ContractFactory(
                TournamentArtifact.abi,
                TournamentArtifact.bytecode,
                signer
            );
            const contract = await factory.deploy(entryFeeInWei);
            await contract.waitForDeployment();
            const contractAddress = await contract.getAddress();

            // Prepare tournament data with timestamps and contract address
            const startDateTimestamp = new Date(data.startDate).getTime();
            const endDateTimestamp = new Date(data.endDate).getTime();

            const tournamentData = {
                ...data,
                startDate: startDateTimestamp,
                endDate: endDateTimestamp,
                entryFee: parseFloat(data.entryFee) || 0,
                contractAddress,
            };

            await mutate({
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
                totalPrizePool: tournamentData.totalPrizePool,
                prizeDistributionMethod: tournamentData.prizeDistributionMethod,
                pauseBreakRules: tournamentData.pauseBreakRules,
                contractAddress: tournamentData.contractAddress,
            });

            setIsDeploying(false);
            setIsModalOpen(true);
            console.log("Tournament created successfully with contract address:", contractAddress);
        } catch (error: unknown) {
            setIsDeploying(false);
            let errorMessage = "An error occurred while creating the tournament.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setDeploymentError(errorMessage);
            console.error("Error creating tournament:", error);
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
                                                        <SelectItem value="double-elimination" disabled={true}>Double
                                                            Elimination</SelectItem>
                                                        <SelectItem value="round-robin" disabled={true}>Round
                                                            Robin</SelectItem>
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
                                                        <SelectItem value="2v2" disabled={true}>2v2</SelectItem>
                                                        <SelectItem value="5v5" disabled={true}>5v5</SelectItem>
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
                                                        <SelectItem value="8" disabled={true}>8</SelectItem>
                                                        <SelectItem value="16" disabled={true}>16</SelectItem>
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
                                                        className={"h-[46px] w-full custom-date-input"}
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
                                                        className={"h-[46px] custom-date-input"}
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

                            <div className="mt-[80px]">
                                <Button
                                    type="submit"
                                    className="w-full h-[46px] text-[16px] hover:bg-theme-crimson-dark"
                                    disabled={isDeploying}
                                >
                                    {isDeploying ? "Deploying Contract..." : "Create Tournament"}
                                </Button>
                                {deploymentError && (
                                    <p className="text-red-500 mt-2 text-center">{deploymentError}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
            <CreateTournamentSuccessModal open={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </div>
    );
}