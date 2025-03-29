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
    endDate: Date.now() + 86400000, // 1 day later
    entryFee: 5.0,
    totalPrizePool: 100,
    prizeDistributionMethod: "Winner Takes All",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
};

test("create tournament", async () => {
    const t = convexTest(schema);
    await t.mutation(api.tournaments.createTournament, tournamentData);
    const tournaments = await t.query(api.tournaments.getAllTournaments);
    expect(tournaments).toHaveLength(1);
    expect(tournaments[0]).toMatchObject({
        ...tournamentData,
        isApproved: false,
    });
});

test("get tournament by id", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);
    const tournament = await t.query(api.tournaments.getTournamentById, {tournamentId});
    expect(tournament).toMatchObject(tournamentData);
});

test("get organizer tournaments", async () => {
    const t = convexTest(schema);
    await t.mutation(api.tournaments.createTournament, tournamentData);
    await t.mutation(api.tournaments.createTournament, {
        ...tournamentData,
        userId: "456", // Different user
        tournamentName: "Another Tournament",
    });

    const organizerTournaments = await t.query(api.tournaments.getOrganizerTournaments, {
        userId: "123"
    });
    expect(organizerTournaments).toHaveLength(1);
    expect(organizerTournaments[0].userId).toBe("123");
});

test("delete tournament - success case", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);
    await t.mutation(api.tournaments.deleteTournament, {
        tournamentId,
        userId: "123"
    });
    const tournaments = await t.query(api.tournaments.getAllTournaments);
    expect(tournaments).toHaveLength(0);
});

test("delete tournament - unauthorized user", async () => {
    const t = convexTest(schema);
    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);
    await expect(
        t.mutation(api.tournaments.deleteTournament, {
            tournamentId,
            userId: "456" // Wrong user
        })
    ).rejects.toThrow("Only the tournament organizer can delete it");
});

test("get non-existent tournament", async () => {
    const t = convexTest(schema);

    const tournamentId = await t.mutation(api.tournaments.createTournament, tournamentData);
    await t.mutation(api.tournaments.deleteTournament, {
        tournamentId,
        userId: tournamentData.userId
    });

    await expect(
        t.query(api.tournaments.getTournamentById, {
            tournamentId
        })
    ).rejects.toThrow("Tournament not found");
});

test("create and get multiple tournaments", async () => {
    const t = convexTest(schema);
    await t.mutation(api.tournaments.createTournament, tournamentData);
    await t.mutation(api.tournaments.createTournament, {
        ...tournamentData,
        tournamentName: "Second Tournament",
    });

    const allTournaments = await t.query(api.tournaments.getAllTournaments);
    expect(allTournaments).toHaveLength(2);
    expect(allTournaments.map(t => t.tournamentName)).toContain("Test Tournament");
    expect(allTournaments.map(t => t.tournamentName)).toContain("Second Tournament");
});