import {Id} from "@/convex/_generated/dataModel";

export interface Tournament {
    _id: Id<"tournaments">
    tournamentName: string;
    gameTitle: string;
    description: string;
    tournamentType: string;
    teamSize: string;
    numberOfPlayersRequired: number;
    startDate: number;
    endDate: number;
    entryFee: number;
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
}