import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
import {PaymentTypes} from "@/types/payment-types";

export default defineSchema({
    admins: defineTable({
        userId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        mobileNum: v.string(),
        email: v.string(),
        approved: v.boolean(),
    }).index('by_userId', ['userId']),

    players: defineTable({
        userId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        mobileNum: v.string(),
        ign: v.string(),
        level: v.number(),
        game: v.string(),
        platform: v.string(),
        email: v.string(),
        walletId: v.optional(v.string()),
    }).index('by_userId', ['userId']),

    organizers: defineTable({
        userId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        mobileNum: v.string(),
        organizationName: v.string(),
        role: v.string(),
        country: v.string(),
        websiteUrl: v.optional(v.string()),
        preferredCommunicationChannel: v.string(),
        email: v.string(),
        walletId: v.optional(v.string()),
    }).index('by_userId', ['userId']),

    tournaments: defineTable({
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
        isApproved: v.boolean(),
        winnerUserId: v.optional(v.string()),
        contractAddress: v.string(),
    }),

    tournamentEntries: defineTable({
        tournamentId: v.string(),
        userId: v.string(),
        transactionId: v.optional(v.id("transactions")),
    })
        .index("by_tournament", ["tournamentId"])
        .index("by_user", ["userId"])
        .index("by_transaction", ["transactionId"]),

    transactions: defineTable({
        transactionHash: v.string(),
        tournamentId: v.id("tournaments"),
        userId: v.string(),
        amount: v.number(),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("failed")
        ),
        paymentType: v.union(
            v.literal(PaymentTypes.ENTRY_FEE),
            v.literal(PaymentTypes.PRIZE_DISTRIBUTION),
            v.literal(PaymentTypes.SPONSORSHIP),
            v.literal(PaymentTypes.PLATFORM_FEE),
            v.literal(PaymentTypes.ORGANIZER_SHARE)
        ),
        blockNumber: v.optional(v.number()),
        fromAddress: v.string(),
        toAddress: v.string()
    })
        .index("by_transactionHash", ["transactionHash"])
        .index("by_tournament", ["tournamentId"])
        .index("by_user", ["userId"])
        .index("by_status", ["status"])
        .index("by_paymentType", ["paymentType"]),

    matchResults: defineTable({
        tournamentId: v.id("tournaments"),
        matchId: v.string(),
        player1UserId: v.string(),
        player2UserId: v.string(),
        player1Submission: v.optional(v.string()),
        player2Submission: v.optional(v.string()),
        winnerUserId: v.optional(v.string()),
        status: v.union(
            v.literal("pending"),
            v.literal("completed"),
            v.literal("disputed")
        ),
    })
        .index("by_tournament", ["tournamentId"])
        .index("by_matchId", ["matchId"]),
});