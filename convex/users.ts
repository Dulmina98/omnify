import {mutation} from "@/convex/_generated/server";
import {v} from "convex/values";

export const createPlayer = mutation({
    args: {
        clerkId: v.string(),
        first_name: v.string(),
        last_name: v.string(),
        mobile_num: v.string(),
        ign: v.string(),
        level: v.number(),
        game: v.string(),
        platform: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("players", {
            user_id: args.clerkId,
            first_name: args.first_name,
            last_name: args.last_name,
            mobile_num: args.mobile_num,
            ign: args.ign,
            level: args.level,
            game: args.game,
            platform: args.platform,
            email: args.email,
        });
    },
});