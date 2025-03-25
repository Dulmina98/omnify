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
        transactionHash: v.string(),
    },
    handler: async (ctx, args) => {
        const existingResult = await ctx.db
            .query("matchResults")
            .filter((q) => q.eq(q.field("matchId"), args.matchId))
            .filter((q) => q.eq(q.field("tournamentId"), args.tournamentId))
            .first();

        if (!existingResult) {
            const newResultId = await ctx.db.insert("matchResults", {
                tournamentId: args.tournamentId,
                matchId: args.matchId,
                player1UserId: args.player1UserId,
                player2UserId: args.player2UserId,
                player1Submission: args.submittedBy === args.player1UserId ? args.winnerUserId : undefined,
                player2Submission: args.submittedBy === args.player2UserId ? args.winnerUserId : undefined,
                player1TransactionHash: args.submittedBy === args.player1UserId ? args.transactionHash : undefined,
                player2TransactionHash: args.submittedBy === args.player2UserId ? args.transactionHash : undefined,
                winnerUserId: undefined,
                status: "pending" as const,
            });
            return newResultId;
        }

        const updateFields: Partial<typeof existingResult> = {};

        if (args.submittedBy === args.player1UserId) {
            updateFields.player1Submission = args.winnerUserId;
            updateFields.player1TransactionHash = args.transactionHash;
        } else if (args.submittedBy === args.player2UserId) {
            updateFields.player2Submission = args.winnerUserId;
            updateFields.player2TransactionHash = args.transactionHash;
        } else {
            throw new Error("Only match participants can submit results");
        }

        if (updateFields.player1Submission && existingResult.player2Submission) {
            updateFields.status = updateFields.player1Submission === existingResult.player2Submission
                ? "completed"
                : "disputed";
            updateFields.winnerUserId = updateFields.status === "completed"
                ? updateFields.player1Submission
                : undefined;
        } else if (existingResult.player1Submission && updateFields.player2Submission) {
            updateFields.status = existingResult.player1Submission === updateFields.player2Submission
                ? "completed"
                : "disputed";
            updateFields.winnerUserId = updateFields.status === "completed"
                ? existingResult.player1Submission
                : undefined;
        } else {
            updateFields.status = "pending";
        }

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
        transactionHash: v.string(),
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

        await ctx.db.patch(existingResult._id, {
            winnerUserId: args.winnerUserId,
            status: "completed" as const,
            resolutionTransactionHash: args.transactionHash,
            resolvedBy: args.submittedBy,
        });

        return existingResult._id;
    },
});