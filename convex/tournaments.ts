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
        numberOfPlayersRequired: v.number(),
        startDate: v.number(),
        endDate: v.number(),
        entryFee: v.float64(),
        totalPrizePool: v.number(),
        prizeDistributionMethod: v.string(),
        pauseBreakRules: v.string(),
        contractAddress: v.string(),
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
            totalPrizePool: args.totalPrizePool,
            prizeDistributionMethod: args.prizeDistributionMethod,
            isApproved: false,
            contractAddress: args.contractAddress,
        });
    },
});

export const getAllTournaments = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournaments")
            .collect();
    }
});

export const getTournamentById = query({
    args: {
        tournamentId: v.id("tournaments"),
    },
    handler: async (ctx, args) => {
        const tournament = await ctx.db
            .query("tournaments")
            .filter(q => q.eq(q.field("_id"), args.tournamentId))
            .first();

        if (!tournament) {
            throw new Error("Tournament not found");
        }

        return tournament;
    },
});

export const getApprovedTournaments = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournaments")
            .filter(q => q.eq(q.field("isApproved"), true))
            .collect()
    }
})

export const getNotApprovedTournaments = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournaments")
            .filter(q => q.eq(q.field("isApproved"), false))
            .collect()
    }
})

export const approveTournament = mutation({
    args: {
        tournamentId: v.id("tournaments"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.tournamentId, {
            isApproved: true
        })
    }
})