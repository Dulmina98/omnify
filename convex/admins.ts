import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createAdmin = mutation({
    args: {
        clerkId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        mobileNum: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("admins", {
            userId: args.clerkId,
            firstName: args.firstName,
            lastName: args.lastName,
            mobileNum: args.mobileNum,
            email: args.email,
            approved: false
        });
    },
});

export const getAdminByUserId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        return await ctx.db
            .query('admins')
            .withIndex('by_userId', (q) => q.eq('userId', args.userId))
            .unique();
    },
});