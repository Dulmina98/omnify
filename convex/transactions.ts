import {mutation} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createTransaction = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        amount: v.number(),
        fromAddress: v.string(),
        toAddress: v.string(),
        transactionHash: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("transactions", {
            status: "pending",
            ...args,
        });
    },
});

export const confirmTransaction = mutation({
    args: {transactionHash: v.string(), blockNumber: v.number()},
    handler: async (ctx, args) => {
        const transaction = await ctx.db
            .query("transactions")
            .withIndex("by_transactionHash", (q) =>
                q.eq("transactionHash", args.transactionHash)
            )
            .unique();

        if (!transaction) {
            throw new Error("Transaction not found");
        }

        await ctx.db.patch(transaction._id, {
            status: "confirmed",
            blockNumber: args.blockNumber,
        });

        const entries = await ctx.db
            .query("tournamentEntries")
            .withIndex("by_transaction", (q) =>
                q.eq("transactionId", transaction._id)
            )
            .collect();

        await Promise.all(
            entries.map((entry) => ctx.db.patch(entry._id, {payment: true}))
        );
    },
});