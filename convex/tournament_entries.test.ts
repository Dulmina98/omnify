import {convexTest} from "convex-test";
import {expect, test} from "vitest";
import {api} from "./_generated/api";
import schema from "./schema";

const tournamentData = {
    userId: "123",
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

const playerData = {
    userId: "456",
    transactionId: undefined,
};

test("enter tournament - successful entry", async () => {
    const t = convexTest(schema);

    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    await t.mutation(api.tournament_entries.enterTournament, {
        userId: playerData.userId,
        tournamentId,
        transactionId: playerData.transactionId
    });

    const entries = await t.query(api.tournament_entries.getPlayersInTournament, {tournamentId});
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
        userId: playerData.userId,
        tournamentId,
    });
});

test("get players in tournament", async () => {
    const t = convexTest(schema);

    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    await t.mutation(api.tournament_entries.enterTournament, {
        userId: "456",
        tournamentId,
    });
    await t.mutation(api.tournament_entries.enterTournament, {
        userId: "789",
        tournamentId,
    });

    const players = await t.query(api.tournament_entries.getPlayersInTournament, {tournamentId});
    expect(players).toHaveLength(2);
    expect(players.map(p => p.userId)).toContain("456");
    expect(players.map(p => p.userId)).toContain("789");
});

test("get user tournament entry - existing entry", async () => {
    const t = convexTest(schema);

    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    await t.mutation(api.tournament_entries.enterTournament, {
        userId: playerData.userId,
        tournamentId,
    });

    const entry = await t.query(api.tournament_entries.getUserTournamentEntry, {
        tournamentId,
        userId: playerData.userId
    });

    expect(entry).toMatchObject({
        userId: playerData.userId,
        tournamentId,
    });
});

test("get user tournament entry - no entry exists", async () => {
    const t = convexTest(schema);

    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    const entry = await t.query(api.tournament_entries.getUserTournamentEntry, {
        tournamentId,
        userId: playerData.userId
    });

    expect(entry).toBeNull();
});

test("multiple players in different tournaments", async () => {
    const t = convexTest(schema);

    const tournamentId1 = await t.mutation(api.tournaments.createTournament, tournamentData);
    const tournamentId2 = await t.mutation(api.tournaments.createTournament, {
        ...tournamentData,
        tournamentName: "Second Tournament"
    });

    await t.mutation(api.tournament_entries.enterTournament, {
        userId: "456",
        tournamentId: tournamentId1,
    });

    await t.mutation(api.tournament_entries.enterTournament, {
        userId: "789",
        tournamentId: tournamentId2,
    });

    const entries1 = await t.query(api.tournament_entries.getPlayersInTournament, {tournamentId: tournamentId1});
    const entries2 = await t.query(api.tournament_entries.getPlayersInTournament, {tournamentId: tournamentId2});

    expect(entries1).toHaveLength(1);
    expect(entries1[0].userId).toBe("456");
    expect(entries2).toHaveLength(1);
    expect(entries2[0].userId).toBe("789");
});

test("enter tournament with transaction id", async () => {
    const t = convexTest(schema);

    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);

    // Create a transaction first
    const transactionId = await t.mutation(api.transactions.createTransaction, {
        transactionHash: "0xabc123",
        tournamentId,
        userId: playerData.userId,
        amount: tournamentData.entryFee,
        status: "confirmed",
        paymentType: "ENTRY_FEE",
        fromAddress: "0xfrom",
        toAddress: "0xto"
    });

    await t.mutation(api.tournament_entries.enterTournament, {
        userId: playerData.userId,
        tournamentId,
        transactionId,
    });

    const entry = await t.query(api.tournament_entries.getUserTournamentEntry, {
        tournamentId,
        userId: playerData.userId
    });

    expect(entry).toMatchObject({
        userId: playerData.userId,
        tournamentId,
        transactionId,
    });
});