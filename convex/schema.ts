import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
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
});