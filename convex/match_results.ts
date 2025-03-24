import {v} from "convex/values";
import {mutation, query} from "./_generated/server";

export const submitMatchResult = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        matchId: v.string(),
        player1UserId: v.string(),
        player2UserId: v.string(),
        winnerUserId: v.string(),
        submittedBy: v.string(),
        transactionHash: v.string(), // Added to store blockchain transaction hash
    },
    handler: async (ctx, args) => {
        const existingResult = await ctx.db
            .query("matchResults")
            .filter((q) => q.eq(q.field("matchId"), args.matchId))
            .filter((q) => q.eq(q.field("tournamentId"), args.tournamentId))
            .first();

        if (!existingResult) {
            // Insert new result into Convex
            const newResultId = await ctx.db.insert("matchResults", {
                tournamentId: args.tournamentId,
                matchId: args.matchId,
                player1UserId: args.player1UserId,
                player2UserId: args.player2UserId,
                player1Submission: args.submittedBy === args.player1UserId ? args.winnerUserId : undefined,
                player2Submission: args.submittedBy === args.player2UserId ? args.winnerUserId : undefined,
                winnerUserId: undefined,
                status: "pending" as const,
                transactionHash: args.transactionHash,
            });
            return newResultId;
        }

        const updateFields: Partial<typeof existingResult> = {
            transactionHash: args.transactionHash, // Update transaction hash
        };

        if (args.submittedBy === args.player1UserId) {
            updateFields.player1Submission = args.winnerUserId;
        } else if (args.submittedBy === args.player2UserId) {
            updateFields.player2Submission = args.winnerUserId;
        } else {
            throw new Error("Only match participants can submit results");
        }

        if (updateFields.player1Submission && existingResult.player2Submission) {
            updateFields.status = updateFields.player1Submission === existingResult.player2Submission
                ? "completed" as const
                : "disputed" as const;
            updateFields.winnerUserId = updateFields.status === "completed"
                ? updateFields.player1Submission
                : undefined;
        } else if (existingResult.player1Submission && updateFields.player2Submission) {
            updateFields.status = existingResult.player1Submission === updateFields.player2Submission
                ? "completed" as const
                : "disputed" as const;
            updateFields.winnerUserId = updateFields.status === "completed"
                ? existingResult.player1Submission
                : undefined;
        } else {
            updateFields.status = "pending" as const;
        }

        // Update Convex with final status
        await ctx.db.patch(existingResult._id, updateFields);

        return existingResult._id;
    },
});

export const getMatchResults = query({
    args: {tournamentId: v.id("tournaments")},
    handler: async (ctx, args) => {
        return await ctx.db
            .query("matchResults")
            .filter((q) => q.eq(q.field("tournamentId"), args.tournamentId))
            .collect();
    },
});

export const getMatchResultsByContract = query({
    args: {contractAddress: v.string()},
    handler: async (ctx, args) => {
        const tournament = await ctx.db
            .query("tournaments")
            .filter((q) => q.eq(q.field("contractAddress"), args.contractAddress))
            .first();
        if (!tournament) return [];
        return await ctx.db
            .query("matchResults")
            .filter((q) => q.eq(q.field("tournamentId"), tournament._id))
            .collect();
    },
});

export const resolveMatchDispute = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        matchId: v.string(),
        winnerUserId: v.string(),
        submittedBy: v.string(),
        transactionHash: v.optional(v.string()), // Optional for client-side blockchain interaction
    },
    handler: async (ctx, args) => {
        const tournament = await ctx.db.get(args.tournamentId);
        if (!tournament || tournament.userId !== args.submittedBy) {
            throw new Error("Only the tournament organizer can resolve disputes");
        }

        const existingResult = await ctx.db
            .query("matchResults")
            .filter((q) => q.eq(q.field("matchId"), args.matchId))
            .filter((q) => q.eq(q.field("tournamentId"), args.tournamentId))
            .first();

        if (!existingResult) {
            throw new Error("Match result not found");
        }

        if (existingResult.status !== "disputed") {
            throw new Error("Can only resolve disputed matches");
        }

        // Update Convex
        await ctx.db.patch(existingResult._id, {
            winnerUserId: args.winnerUserId,
            status: "completed" as const,
            transactionHash: args.transactionHash || existingResult.transactionHash, // Use provided or existing hash
        });

        return existingResult._id;
    },
});