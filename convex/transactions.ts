import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createTransaction = mutation({
    args: {
        tournamentId: v.string(),
        userId: v.string(),
        amount: v.number(),
        role: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            return await ctx.db.insert("transactions", {
                tournamentId: args.tournamentId,
                userId: args.userId,
                amount: args.amount,
                role: args.role,
                type: args.type
            });
        } catch (error) {
            console.error("Error inserting transaction:", error);
            throw error;
        }
    }
});

export const getUserPaymentForTournament = query({
    args: {
        tournamentId: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const transactions = await ctx.db
                .query("transactions")
                .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .collect();

            if (transactions.length > 0) {
                return transactions[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user payment for tournament:", error);
            throw error;
        }
    },
});