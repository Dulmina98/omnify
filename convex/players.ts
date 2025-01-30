import {mutation} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createPlayer = mutation({
    args: {
        clerkId: v.string(),
        firstName: v.string(),
        lastName: v.string(),
        mobileNum: v.string(),
        ign: v.string(),
        level: v.number(),
        game: v.string(),
        platform: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("players", {
            userId: args.clerkId,
            firstName: args.firstName,
            lastName: args.lastName,
            mobileNum: args.mobileNum,
            ign: args.ign,
            level: args.level,
            game: args.game,
            platform: args.platform,
            email: args.email,
        });
    },
});