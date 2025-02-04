import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";
import {Id} from "@/convex/_generated/dataModel";

export const sendInvitation = mutation({
    args: {
        userId: v.string(),
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tournamentInvitations", {
            tournamentId: args.tournamentId,
            userId: args.userId,
            status: "pending",
        })
    }
})

export const getPlayersInTournament = query({
    args: {
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tournamentInvitations")
            .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
            .collect();
    },
});

export const getPlayerTournamentsWithStatus = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, {userId}) => {
        const participants = await ctx.db
            .query("tournamentInvitations")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const results = await Promise.all(
            participants.map(async (p) => {
                const tournament = await ctx.db.get(
                    p.tournamentId as Id<"tournaments">
                );
                if (!tournament) {
                    return null;
                }
                return {
                    ...tournament,
                    status: p.status,
                };
            })
        );

        return results.filter((t) => t !== null);
    },
});

export const getAllPendingTournamentInvitations = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournamentInvitations")
            .filter((q) => q.eq(q.field("status"), "pending"))
            .collect();
    }
});

export const getAllApprovedTournamentInvitations = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournamentInvitations")
            .filter((q) => q.eq(q.field("status"), "approved"))
            .collect();
    }
});

export const approveInvitation = mutation({
    args: {
        invitationId: v.id("tournamentInvitations")
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.invitationId, {
            status: "approved",
        });
    }
});
