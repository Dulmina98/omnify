import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

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
        entryFee: v.number(),
        paymentMethod: v.string(),
        deadline: v.number(),
        minLevel: v.number(),
        totalPrizePool: v.number(),
        prizeDistributionMethod: v.string(),
        gameMode: v.string(),
        stageSelection: v.string(),
        characterSelectionRules: v.string(),
        bannedCharactersItems: v.string(),
        disconnectPolicy: v.string(),
        matchDisputeResolution: v.string(),
        pauseBreakRules: v.string(),
        isApproved: v.boolean(),
    }),
    tournamentEntries: defineTable({
        tournamentId: v.string(),
        userId: v.string(),
        status: v.string(),
        payment: v.optional(v.boolean()),
    })
        .index("by_tournament", ["tournamentId"])
        .index("by_user", ["userId"]),
    transactions: defineTable({
        tournamentId: v.string(),
        userId: v.string(),
        amount: v.number(),
        role: v.string(),
        type: v.string()
    })
        .index('by_tournament', ['tournamentId'])
        .index('by_user', ['userId'])
});