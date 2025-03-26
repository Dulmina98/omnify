import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";
import {PaymentTypes} from "@/types/payment-types";

export const createTransaction = mutation({
    args: {
        transactionHash: v.string(),
        tournamentId: v.id("tournaments"),
        userId: v.string(),
        amount: v.number(),
        status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("failed")),
        paymentType: v.union(
            v.literal(PaymentTypes.ENTRY_FEE),
            v.literal(PaymentTypes.PRIZE_DISTRIBUTION),
            v.literal(PaymentTypes.SPONSORSHIP),
            v.literal(PaymentTypes.PLATFORM_FEE),
            v.literal(PaymentTypes.ORGANIZER_SHARE)
        ),
        blockNumber: v.optional(v.number()),
        fromAddress: v.string(),
        toAddress: v.string(),
    },
    handler: async (ctx, args) => {
        const transactionId = await ctx.db.insert("transactions", {
            transactionHash: args.transactionHash,
            tournamentId: args.tournamentId,
            userId: args.userId,
            amount: args.amount,
            status: args.status,
            paymentType: args.paymentType,
            blockNumber: args.blockNumber,
            fromAddress: args.fromAddress,
            toAddress: args.toAddress,
        });

        return transactionId;
    },
});

export const listTransactionsByUser = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        const transactions = await ctx.db
            .query("transactions")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        const transactionsWithTournaments = await Promise.all(
            transactions.map(async (tx) => {
                const tournament = await ctx.db
                    .query("tournaments")
                    .filter((q) => q.eq(q.field("_id"), tx.tournamentId))
                    .first();
                return {...tx, tournament};
            })
        );

        return transactionsWithTournaments;
    },
});