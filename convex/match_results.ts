import {v} from "convex/values";
import {mutation, query} from "@/convex/_generated/server";

export const submitMatchResult = mutation({
    args: {
        tournamentId: v.id("tournaments"),
        matchId: v.string(),
        player1UserId: v.string(),
        player2UserId: v.string(),
        winnerUserId: v.string(), // The userId of the winner according to the submitter
        submittedBy: v.string(),  // The userId of the player submitting
    },
    handler: async (ctx, args) => {
        // Check if match result already exists
        const existingResult = await ctx.db
            .query("matchResults")
            .filter(q => q.eq(q.field("matchId"), args.matchId))
            .filter(q => q.eq(q.field("tournamentId"), args.tournamentId))
            .first();

        if (!existingResult) {
            // Create new result if it doesn’t exist
            const newResult = {
                tournamentId: args.tournamentId,
                matchId: args.matchId,
                player1UserId: args.player1UserId,
                player2UserId: args.player2UserId,
                player1Submission: args.submittedBy === args.player1UserId ? args.winnerUserId : undefined,
                player2Submission: args.submittedBy === args.player2UserId ? args.winnerUserId : undefined,
                winnerUserId: undefined,
                status: "pending" as const,
            };
            return await ctx.db.insert("matchResults", newResult);
        }

        // Update existing result
        const updateFields: Partial<typeof existingResult> = {};

        if (args.submittedBy === args.player1UserId) {
            updateFields.player1Submission = args.winnerUserId;
        } else if (args.submittedBy === args.player2UserId) {
            updateFields.player2Submission = args.winnerUserId;
        } else {
            throw new Error("Only match participants can submit results");
        }

        // Determine status and winner
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

        return await ctx.db.patch(existingResult._id, updateFields);
    },
});

export const getMatchResults = query({
    args: {tournamentId: v.id("tournaments")},
    handler: async (ctx, args) => {
        return await ctx.db
            .query("matchResults")
            .filter(q => q.eq(q.field("tournamentId"), args.tournamentId))
            .collect();
    },
});