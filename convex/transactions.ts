import {mutation} from "@/convex/_generated/server";
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