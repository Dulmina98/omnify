import {mutation, query} from "@/convex/_generated/server";
import {v} from "convex/values";
import {Id} from "@/convex/_generated/dataModel";

export const enterTournament = mutation({
    args: {
        userId: v.string(),
        tournamentId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("tournamentEntries", {
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
            .query("tournamentEntries")
            .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
            .collect();
    },
});

export const getPlayerTournamentsWithStatusAndPayment = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, {userId}) => {
        const participants = await ctx.db
            .query("tournamentEntries")
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
                    transactionId: p.transactionId,
                };
            })
        );

        return results.filter((t) => t !== null);
    },
});

export const getAllPendingTournamentEntries = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournamentEntries")
            .filter((q) => q.eq(q.field("status"), "pending"))
            .collect();
    }
});

export const getAllApprovedTournamentEntries = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("tournamentEntries")
            .filter((q) => q.eq(q.field("status"), "approved"))
            .collect();
    }
});

export const getUserTournamentEntry = query({
    args: {
        tournamentId: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const invitations = await ctx.db
                .query("tournamentEntries")
                .withIndex("by_tournament", (q) => q.eq("tournamentId", args.tournamentId))
                .filter((q) => q.eq(q.field("userId"), args.userId))
                .collect();

            if (invitations.length > 0) {
                return invitations[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user invitation for tournament:", error);
            throw error;
        }
    },
});

export const approveEntry = mutation({
    args: {
        invitationId: v.id("tournamentEntries")
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.invitationId, {
            status: "approved",
        });
    }
});

export const updateTransactionId = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        userId: v.string(),
        transactionId: v.id("transactions")
    },
    handler: async (ctx, args) => {
        const entry = await ctx.db
            .query("tournamentEntries")
            .withIndex("by_user", q => q.eq("userId", args.userId))
            .filter(q => q.eq(q.field("tournamentId"), args.tournamentId))
            .unique();

        if (!entry) throw new Error("Tournament entry not found");

        await ctx.db.patch(entry._id, {
            transactionId: args.transactionId,
            status: "approved"
        });
    }
});
