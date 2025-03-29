import {convexTest} from "convex-test";
import {expect, test} from "vitest";
import {api} from "./_generated/api";
import schema from "./schema";

const tournamentData = {
    userId: "organizer_123",
    tournamentName: "Test Tournament",
    gameTitle: "Chess",
    tournamentType: "Single Elimination",
    teamSize: "1",
    numberOfPlayersRequired: 8,
    startDate: Date.now(),
    endDate: Date.now() + 86400000,
    entryFee: 5.0,
    totalPrizePool: 100,
    prizeDistributionMethod: "Winner Takes All",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
};

const transactionData = {
    transactionHash: "0xabc123",
    userId: "player_1",
    amount: 5.0,
    status: "confirmed" as const,
    paymentType: "ENTRY_FEE" as const,
    fromAddress: "0xfrom123",
    toAddress: "0xto456",
};

test("create transaction - successful creation", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    const transactionId = await t.mutation(api.transactions.createTransaction, {
        ...transactionData,
        tournamentId,
    });

    const transactions = await t.query(api.transactions.listTransactionsByUser, {userId: transactionData.userId});
    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toMatchObject({
        transactionHash: transactionData.transactionHash,
        tournamentId,
        userId: transactionData.userId,
        amount: transactionData.amount,
        status: transactionData.status,
        paymentType: transactionData.paymentType,
        fromAddress: transactionData.fromAddress,
        toAddress: transactionData.toAddress,
    });
    expect(transactions[0]._id).toBe(transactionId);
    expect(transactions[0].tournament).toMatchObject({
        tournamentName: tournamentData.tournamentName,
    });
});

test("create transaction - with block number", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    const blockNumber = 123456;
    await t.mutation(api.transactions.createTransaction, {
        ...transactionData,
        tournamentId,
        blockNumber,
    });

    const transactions = await t.query(api.transactions.listTransactionsByUser, {userId: transactionData.userId});
    expect(transactions[0].blockNumber).toBe(blockNumber);
});

test("list transactions by user - multiple transactions", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    await t.mutation(api.transactions.createTransaction, {
        ...transactionData,
        tournamentId,
        transactionHash: "0xabc123",
    });
    await t.mutation(api.transactions.createTransaction, {
        ...transactionData,
        tournamentId,
        transactionHash: "0xdef456",
        amount: 10.0,
        paymentType: "PRIZE_DISTRIBUTION" as const,
    });

    const transactions = await t.query(api.transactions.listTransactionsByUser, {userId: transactionData.userId});
    expect(transactions).toHaveLength(2);
    expect(transactions[0].transactionHash).toBe("0xdef456"); // Should be in descending order
    expect(transactions[1].transactionHash).toBe("0xabc123");
    expect(transactions.every(tx => tx.tournament?.tournamentName === tournamentData.tournamentName)).toBe(true);
});

test("list transactions by user - no transactions", async () => {
    const t = convexTest(schema);
    const transactions = await t.query(api.transactions.listTransactionsByUser, {userId: "non_existent_user"});
    expect(transactions).toHaveLength(0);
});

test("list transactions by user - different users", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    await t.mutation(api.transactions.createTransaction, {
        ...transactionData,
        tournamentId,
        userId: "player_1",
    });
    await t.mutation(api.transactions.createTransaction, {
        ...transactionData,
        tournamentId,
        userId: "player_2",
        transactionHash: "0xdef456",
    });

    const player1Transactions = await t.query(api.transactions.listTransactionsByUser, {userId: "player_1"});
    const player2Transactions = await t.query(api.transactions.listTransactionsByUser, {userId: "player_2"});

    expect(player1Transactions).toHaveLength(1);
    expect(player1Transactions[0].transactionHash).toBe("0xabc123");
    expect(player2Transactions).toHaveLength(1);
    expect(player2Transactions[0].transactionHash).toBe("0xdef456");
});

test("create transaction - different payment types", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    const paymentTypes = [
        "ENTRY_FEE",
        "PRIZE_DISTRIBUTION",
        "SPONSORSHIP",
        "PLATFORM_FEE",
        "ORGANIZER_SHARE"
    ] as const;

    for (const paymentType of paymentTypes) {
        await t.mutation(api.transactions.createTransaction, {
            ...transactionData,
            tournamentId,
            transactionHash: `0x${paymentType.toLowerCase()}`,
            paymentType,
        });
    }

    const transactions = await t.query(api.transactions.listTransactionsByUser, {userId: transactionData.userId});
    expect(transactions).toHaveLength(5);
    expect(new Set(transactions.map(tx => tx.paymentType)).size).toBe(5);
});

test("create transaction - different statuses", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    const statuses = ["pending", "confirmed", "failed"] as const;

    for (const status of statuses) {
        await t.mutation(api.transactions.createTransaction, {
            ...transactionData,
            tournamentId,
            transactionHash: `0x${status}`,
            status,
        });
    }

    const transactions = await t.query(api.transactions.listTransactionsByUser, {userId: transactionData.userId});
    expect(transactions).toHaveLength(3);
    expect(new Set(transactions.map(tx => tx.status)).size).toBe(3);
});
