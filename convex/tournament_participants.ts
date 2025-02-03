import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";

export const joinTournament = mutation({
    args: {
        userId: v.string(),
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tournamentParticipants", {
            tournamentId: args.tournamentId,
            userId: args.userId,
            status: "pending",
        })
    }
})

export const getAllParticipants = query({
    args: {
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tournamentParticipants")
            .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
            .collect();
    },
});