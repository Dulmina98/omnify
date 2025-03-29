import {convexTest} from "convex-test";
import {expect, test} from "vitest";
import {api} from "./_generated/api";
import schema from "./schema";

const playerData = {
    clerkId: "clerk_123",
    firstName: "John",
    lastName: "Doe",
    mobileNum: "1234567890",
    ign: "PlayerOne",
    level: 10,
    game: "Chess",
    platform: "PC",
    email: "john.doe@example.com",
};

test("create player - successful creation", async () => {
    const t = convexTest(schema);

    const playerId = await t.mutation(api.players.createPlayer, playerData);

    const player = await t.query(api.players.getPlayerByUserId, {userId: playerData.clerkId});
    expect(player).toMatchObject({
        userId: playerData.clerkId, // Changed from clerkId to userId
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        mobileNum: playerData.mobileNum,
        ign: playerData.ign,
        level: playerData.level,
        game: playerData.game,
        platform: playerData.platform,
        email: playerData.email,
        // Removed walletId: undefined since it won't be present in the response
    });
    expect(player?._id).toBe(playerId);
});

test("get player by user id - existing player", async () => {
    const t = convexTest(schema);

    await t.mutation(api.players.createPlayer, playerData);

    const player = await t.query(api.players.getPlayerByUserId, {userId: playerData.clerkId});
    expect(player).toMatchObject({
        userId: playerData.clerkId, // Changed from clerkId to userId
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        mobileNum: playerData.mobileNum,
        ign: playerData.ign,
        level: playerData.level,
        game: playerData.game,
        platform: playerData.platform,
        email: playerData.email,
    });
    expect(player?.walletId).toBeUndefined();
});

test("get player by user id - non-existent player", async () => {
    const t = convexTest(schema);

    const player = await t.query(api.players.getPlayerByUserId, {userId: "non_existent_id"});
    expect(player).toBeNull();
});

test("get players by user ids - multiple players", async () => {
    const t = convexTest(schema);

    const playerData2 = {
        ...playerData,
        clerkId: "clerk_456",
        email: "jane.doe@example.com",
    };

    await t.mutation(api.players.createPlayer, playerData);
    await t.mutation(api.players.createPlayer, playerData2);

    const players = await t.query(api.players.getPlayersByUserIds, {
        userIds: [playerData.clerkId, playerData2.clerkId],
    });

    expect(players).toHaveLength(2);
    expect(players.map(p => p?.userId)).toContain(playerData.clerkId);
    expect(players.map(p => p?.userId)).toContain(playerData2.clerkId);
});

test("update player wallet id - new wallet", async () => {
    const t = convexTest(schema);

    await t.mutation(api.players.createPlayer, playerData);
    const walletId = "wallet_123";

    await t.mutation(api.players.updatePlayerWalletId, {
        userId: playerData.clerkId,
        walletId,
    });

    const updatedPlayer = await t.query(api.players.getPlayerByUserId, {userId: playerData.clerkId});
    expect(updatedPlayer?.walletId).toBe(walletId);
});

test("update player wallet id - existing wallet", async () => {
    const t = convexTest(schema);

    await t.mutation(api.players.createPlayer, playerData);
    const initialWalletId = "wallet_initial";
    await t.mutation(api.players.updatePlayerWalletId, {
        userId: playerData.clerkId,
        walletId: initialWalletId,
    });

    const newWalletId = "wallet_new";
    await t.mutation(api.players.updatePlayerWalletId, {
        userId: playerData.clerkId,
        walletId: newWalletId,
    });

    const player = await t.query(api.players.getPlayerByUserId, {userId: playerData.clerkId});
    expect(player?.walletId).toBe(initialWalletId); // Should keep original wallet
});

test("update player wallet id - non-existent player", async () => {
    const t = convexTest(schema);

    await expect(
        t.mutation(api.players.updatePlayerWalletId, {
            userId: "non_existent_id",
            walletId: "wallet_123",
        })
    ).rejects.toThrow("Player not found");
});

test("get player wallet id - with wallet", async () => {
    const t = convexTest(schema);

    await t.mutation(api.players.createPlayer, playerData);
    const walletId = "wallet_123";
    await t.mutation(api.players.updatePlayerWalletId, {
        userId: playerData.clerkId,
        walletId,
    });

    const retrievedWalletId = await t.query(api.players.getPlayerWalletId, {
        userId: playerData.clerkId,
    });
    expect(retrievedWalletId).toBe(walletId);
});

test("get player wallet id - without wallet", async () => {
    const t = convexTest(schema);

    await t.mutation(api.players.createPlayer, playerData);

    const walletId = await t.query(api.players.getPlayerWalletId, {
        userId: playerData.clerkId,
    });
    expect(walletId).toBeNull();
});

test("get player wallet id - non-existent player", async () => {
    const t = convexTest(schema);

    const walletId = await t.query(api.players.getPlayerWalletId, {
        userId: "non_existent_id",
    });
    expect(walletId).toBeNull();
});