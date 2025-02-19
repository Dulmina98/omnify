import {mutation} from "@/convex/_generated/server";
import {v} from "convex/values";
import {PaymentTypes} from "@/types/payment-types";

export const createTransaction = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        amount: v.number(),
        fromAddress: v.string(),
        toAddress: v.string(),
        transactionHash: v.string(),
        userId: v.string(),
        paymentType: v.union(
            v.literal(PaymentTypes.ENTRY_FEE),
            v.literal(PaymentTypes.PRIZE_DISTRIBUTION),
            v.literal(PaymentTypes.SPONSORSHIP),
            v.literal(PaymentTypes.PLATFORM_FEE),
            v.literal(PaymentTypes.ORGANIZER_SHARE)
        ),
    },
    handler: async (ctx, args) => {
        return ctx.db.insert("transactions", {
            status: "confirmed",
            ...args,
        });
    },
});