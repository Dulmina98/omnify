import {mutation} from "@/convex/_generated/server";
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