import {Organizer, Player} from "@/types/users-types";

export const isPlayer = (user: Player | Organizer): user is Player => {
    return "ign" in user && "level" in user && "game" in user && "platform" in user;
};

export const isOrganizer = (user: Player | Organizer): user is Organizer => {
    return "organizationName" in user && "role" in user && "country" in user;
};
