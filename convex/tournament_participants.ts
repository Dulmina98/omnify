import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";
import {Id} from "@/convex/_generated/dataModel";

export const joinTournament = mutation({
    args: {
        userId: v.string(),
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tournamentParticipants", {
            tournamentId: args.tournamentId,
            userId: args.userId,
            status: "pending",
        })
    }
})

export const getAllParticipants = query({
    args: {
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tournamentParticipants")
            .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
            .collect();
    },
});

export const getPlayerTournamentsWithStatus = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, {userId}) => {
        const participants = await ctx.db
            .query("tournamentParticipants")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const results = await Promise.all(
            participants.map(async (p) => {
                const tournament = await ctx.db.get(
                    p.tournamentId as Id<"tournaments">
                );
                if (!tournament) {
                    return null;
                }
                return {
                    ...tournament,
                    status: p.status,
                };
            })
        );

        return results.filter((t) => t !== null);
    },
});