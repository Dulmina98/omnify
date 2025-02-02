import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createTournament = mutation({
    args: {
        userId: v.string(),
        tournamentName: v.string(),
        gameTitle: v.string(),
        description: v.optional(v.string()),
        tournamentType: v.string(),
        teamSize: v.string(),
        numberOfPlayersRequired: v.string(),
        startDate: v.number(),
        endDate: v.number(),
        entryFee: v.number(),
        paymentMethod: v.string(),
        deadline: v.number(),
        minLevel: v.number(),
        totalPrizePool: v.number(),
        prizeDistributionMethod: v.string(),
        gameMode: v.string(),
        stageSelection: v.string(),
        characterSelectionRules: v.string(),
        bannedCharactersItems: v.string(),
        disconnectPolicy: v.string(),
        matchDisputeResolution: v.string(),
        pauseBreakRules: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tournaments", {
            userId: args.userId,
            tournamentName: args.tournamentName,
            gameTitle: args.gameTitle,
            description: args.description,
            tournamentType: args.tournamentType,
            teamSize: args.teamSize,
            numberOfPlayersRequired: args.numberOfPlayersRequired,
            startDate: args.startDate,
            endDate: args.endDate,
            entryFee: args.entryFee,
            paymentMethod: args.paymentMethod,
            deadline: args.deadline,
            minLevel: args.minLevel,
            totalPrizePool: args.totalPrizePool,
            prizeDistributionMethod: args.prizeDistributionMethod,
            gameMode: args.gameMode,
            stageSelection: args.stageSelection,
            characterSelectionRules: args.characterSelectionRules,
            bannedCharactersItems: args.bannedCharactersItems,
            disconnectPolicy: args.disconnectPolicy,
            matchDisputeResolution: args.matchDisputeResolution,
            pauseBreakRules: args.pauseBreakRules,
            isApproved: false,
        })
    }
})

export const getAllTournaments = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournaments")
            .collect();
    }
});