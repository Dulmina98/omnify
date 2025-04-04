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

export const getUserTournaments = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        const entries = await ctx.db
            .query("tournamentEntries")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const tournaments = await Promise.all(
            entries.map(async (entry) => {
                const tournament = await ctx.db
                    .query("tournaments")
                    .filter((q) => q.eq(q.field("_id"), entry.tournamentId))
                    .first();
                return tournament;
            })
        );

        return tournaments.filter((t): t is NonNullable<typeof t> => t !== null);
    },
});

export const getOrganizerTournaments = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tournaments")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
    },
});

export const deleteTournament = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const tournament = await ctx.db.get(args.tournamentId);

        if (!tournament) {
            throw new Error("Tournament not found");
        }

        if (tournament.userId !== args.userId) {
            throw new Error("Only the tournament organizer can delete it");
        }

        const entries = await ctx.db
            .query("tournamentEntries")
            .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
            .collect();

        if (entries.length > 0) {
            throw new Error("Cannot delete tournament with joined players");
        }

        await ctx.db.delete(args.tournamentId);
        return true;
    },
});