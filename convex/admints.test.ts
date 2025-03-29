import {convexTest} from "convex-test";
import {expect, test} from "vitest";
import {api} from "./_generated/api";
import schema from "./schema";

const adminData = {
    clerkId: "clerk_admin_123",
    firstName: "Admin",
    lastName: "User",
    mobileNum: "1234567890",
    email: "admin@example.com",
};

test("create admin - successful creation", async () => {
    const t = convexTest(schema);

    const adminId = await t.mutation(api.admins.createAdmin, adminData);

    const admin = await t.query(api.admins.getAdminByUserId, {userId: adminData.clerkId});
    expect(admin).toMatchObject({
        userId: adminData.clerkId,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        mobileNum: adminData.mobileNum,
        email: adminData.email,
        approved: false, // Default value as per schema
    });
    expect(admin?._id).toBe(adminId);
});

test("get admin by user id - existing admin", async () => {
    const t = convexTest(schema);

    await t.mutation(api.admins.createAdmin, adminData);

    const admin = await t.query(api.admins.getAdminByUserId, {userId: adminData.clerkId});
    expect(admin).toMatchObject({
        userId: adminData.clerkId,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        mobileNum: adminData.mobileNum,
        email: adminData.email,
        approved: false,
    });
});

test("get admin by user id - non-existent admin", async () => {
    const t = convexTest(schema);

    const admin = await t.query(api.admins.getAdminByUserId, {userId: "non_existent_id"});
    expect(admin).toBeNull();
});

test("create multiple admins - verify separation", async () => {
    const t = convexTest(schema);

    const adminData2 = {
        ...adminData,
        clerkId: "clerk_admin_456",
        email: "admin2@example.com",
    };

    await t.mutation(api.admins.createAdmin, adminData);
    await t.mutation(api.admins.createAdmin, adminData2);

    const admin1 = await t.query(api.admins.getAdminByUserId, {userId: adminData.clerkId});
    const admin2 = await t.query(api.admins.getAdminByUserId, {userId: adminData2.clerkId});

    expect(admin1).toMatchObject({
        userId: adminData.clerkId,
        email: adminData.email,
    });
    expect(admin2).toMatchObject({
        userId: adminData2.clerkId,
        email: adminData2.email,
    });
    expect(admin1?._id).not.toBe(admin2?._id);
});

test("create admin - required fields validation", async () => {
    const t = convexTest(schema);

    // Test with missing required field (email)
    const invalidAdminData = {
        clerkId: "clerk_admin_789",
        firstName: "Test",
        lastName: "Admin",
        mobileNum: "9876543210",
        // email is missing
    };

    // Type assertion needed since we're intentionally testing invalid input
    await expect(
        t.mutation(api.admins.createAdmin, invalidAdminData as any)
    ).rejects.toThrow();
});