import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createOrganizer = mutation({
    args: {
        clerkId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        mobileNum: v.string(),
        organizationName: v.string(),
        role: v.string(),
        country: v.string(),
        websiteUrl: v.optional(v.string()),
        tournamentFrequency: v.optional(v.string()),
        preferredCommunicationChannel: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("organizers", {
            userId: args.clerkId,
            firstName: args.firstName,
            lastName: args.lastName,
            mobileNum: args.mobileNum,
            organizationName: args.organizationName,
            role: args.role,
            country: args.country,
            websiteUrl: args.websiteUrl,
            preferredCommunicationChannel: args.preferredCommunicationChannel,
            email: args.email,
        });
    },
});

export const getOrganizerByUserId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        return await ctx.db
            .query('organizers')
            .withIndex('by_userId', (q) => q.eq('userId', args.userId))
            .unique();
    },
});

export const updateOrganizerWallet = mutation({
    args: {
        userId: v.string(),
        walletId: v.string(),
    },
    handler: async (ctx, args) => {
        const existingOrganizer = await ctx.db
            .query("organizers")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();

        if (!existingOrganizer) {
            throw new Error("Organizer not found");
        }

        if (existingOrganizer.walletId) {
            return existingOrganizer._id;
        }

        await ctx.db.patch(existingOrganizer._id, {
            walletId: args.walletId,
        });

        return existingOrganizer._id;
    },
});

export const getOrganizerWalletId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        const organizer = await ctx.db
            .query("organizers")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();
        return organizer?.walletId || null;
    },
});