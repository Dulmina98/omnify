import {Doc} from "@/convex/_generated/dataModel";

type UserDoc = Doc<"players"> | Doc<"organizers"> | Doc<"admins">;

export const isPlayer = (user: UserDoc): user is Doc<"players"> => {
    return "ign" in user && "level" in user && "game" in user && "platform" in user;
};

export const isOrganizer = (user: UserDoc): user is Doc<"organizers"> => {
    return "organizationName" in user && "role" in user && "country" in user;
};