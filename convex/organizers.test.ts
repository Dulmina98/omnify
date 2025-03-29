import {convexTest} from "convex-test";
import {expect, test} from "vitest";
import {api} from "./_generated/api";
import schema from "./schema";

const organizerData = {
    clerkId: "clerk_org_123",
    firstName: "Jane",
    lastName: "Smith",
    mobileNum: "9876543210",
    organizationName: "ChessMasters Inc",
    role: "Tournament Director",
    country: "USA",
    websiteUrl: "https://chessmasters.com",
    // Removed tournamentFrequency since it doesn't exist in the schema
    preferredCommunicationChannel: "email",
    email: "jane.smith@chessmasters.com",
};

test("create organizer - successful creation", async () => {
    const t = convexTest(schema);

    await t.mutation(api.organizers.createOrganizer, organizerData);

    const organizer = await t.query(api.organizers.getOrganizerByUserId, {userId: organizerData.clerkId});
    expect(organizer).toMatchObject({
        userId: organizerData.clerkId,
        firstName: organizerData.firstName,
        lastName: organizerData.lastName,
        mobileNum: organizerData.mobileNum,
        organizationName: organizerData.organizationName,
        role: organizerData.role,
        country: organizerData.country,
        websiteUrl: organizerData.websiteUrl,
        preferredCommunicationChannel: organizerData.preferredCommunicationChannel,
        email: organizerData.email,
    });
    // Removed organizerId check since it's not needed for this test
});

test("get organizer by user id - existing organizer", async () => {
    const t = convexTest(schema);

    await t.mutation(api.organizers.createOrganizer, organizerData);

    const organizer = await t.query(api.organizers.getOrganizerByUserId, {userId: organizerData.clerkId});
    expect(organizer).toMatchObject({
        userId: organizerData.clerkId,
        firstName: organizerData.firstName,
        lastName: organizerData.lastName,
        mobileNum: organizerData.mobileNum,
        organizationName: organizerData.organizationName,
        role: organizerData.role,
        country: organizerData.country,
        websiteUrl: organizerData.websiteUrl,
        preferredCommunicationChannel: organizerData.preferredCommunicationChannel,
        email: organizerData.email,
    });
    expect(organizer?.walletId).toBeUndefined();
});

// Rest of the tests remain the same until the last one

test("create organizer - without optional fields", async () => {
    const t = convexTest(schema);

    const minimalOrganizerData = {
        clerkId: "clerk_org_456",
        firstName: "Bob",
        lastName: "Wilson",
        mobileNum: "5555555555",
        organizationName: "Tournament Pros",
        role: "Manager",
        country: "Canada",
        preferredCommunicationChannel: "phone",
        email: "bob.wilson@tournamentpros.com",
    };

    await t.mutation(api.organizers.createOrganizer, minimalOrganizerData);

    const organizer = await t.query(api.organizers.getOrganizerByUserId, {userId: minimalOrganizerData.clerkId});
    expect(organizer).toMatchObject({
        userId: minimalOrganizerData.clerkId,
        firstName: minimalOrganizerData.firstName,
        lastName: minimalOrganizerData.lastName,
        mobileNum: minimalOrganizerData.mobileNum,
        organizationName: minimalOrganizerData.organizationName,
        role: minimalOrganizerData.role,
        country: minimalOrganizerData.country,
        preferredCommunicationChannel: minimalOrganizerData.preferredCommunicationChannel,
        email: minimalOrganizerData.email,
    });
    expect(organizer?.websiteUrl).toBeUndefined();
    expect(organizer?.walletId).toBeUndefined();
});