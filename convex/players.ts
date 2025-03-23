import {mutation, query} from "@/convex/_generated/server";
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

export const getPlayerByUserId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        return await ctx.db
            .query('players')
            .withIndex('by_userId', (q) => q.eq('userId', args.userId))
            .unique();
    },
})

export const getPlayersByUserIds = query({
    args: {userIds: v.array(v.string())},
    handler: async (ctx, args) => {
        return await Promise.all(
            args.userIds.map(userId =>
                ctx.db
                    .query('players')
                    .withIndex('by_userId', (q) => q.eq('userId', userId))
                    .unique()
            )
        );
    },
});

export const updatePlayerWalletId = mutation({
    args: {
        userId: v.string(),
        walletId: v.string(),
    },
    handler: async (ctx, args) => {
        const existingPlayer = await ctx.db
            .query("players")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();

        if (!existingPlayer) {
            throw new Error("Player not found");
        }

        if (existingPlayer.walletId) {
            return existingPlayer._id;
        }

        await ctx.db.patch(existingPlayer._id, {
            walletId: args.walletId,
        });

        return existingPlayer._id;
    },
});

export const getPlayerWalletId = query({
    args: {userId: v.string()},
    handler: async (ctx, args) => {
        const player = await ctx.db
            .query("players")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .unique();
        return player?.walletId || null;
    },
});