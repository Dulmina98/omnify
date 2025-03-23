import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const enterTournament = mutation({
    args: {
        userId: v.string(),
        tournamentId: v.string(),
        transactionId: v.optional(v.id("transactions")),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tournamentEntries", {
            tournamentId: args.tournamentId,
            userId: args.userId,
            transactionId: args.transactionId,
        });
    }
});

export const getPlayersInTournament = query({
    args: {
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tournamentEntries")
            .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
            .collect();
    },
});


export const getUserTournamentEntry = query({
    args: {
        tournamentId: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const invitations = await ctx.db
                .query("tournamentEntries")
                .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .collect();

            if (invitations.length > 0) {
                return invitations[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user invitation for tournament:", error);
            throw error;
        }
    },
});