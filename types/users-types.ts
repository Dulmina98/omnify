export interface Player {
    userId: string;
    firstName: string;
    lastName: string;
    mobileNum: string;
    email: string;
    ign: string;
    level: number;
    game: string;
    platform: string;
};

export interface Organizer {
    userId: string;
    firstName: string;
    lastName: string;
    mobileNum: string;
    email: string;
    organizationName: string;
    role: string;
    country: string;
    websiteUrl?: string,
    preferredCommunicationChannel?: string,
};