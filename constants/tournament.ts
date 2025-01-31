export const GAMES = [
    "Mortal Kombat",
    "Fortnite",
    "Doom Eternal",
    "Diablo",
] as const;

export const TOURNAMENT_TYPES = [
    "Single Elimination",
    "Double Elimination",
    "Round Robin",
    "Swiss Format",
    "Battle Royal"
] as const;

export const TEAM_SIZE = [
    "Solo (1v1)",
    "Duo (2 players per team)",
    "Squad (4-5 players per team)",
] as const;

export const PAYMENT_METHODS = [
    "Crypto Wallet",
    "Credit/Debit Card",
    "PayPal",
] as const;

export const PRIZE_DISTRIBUTION_METHOD = [
    "Fixed Amount for Each Rank",
    "Percentage-Based Distribution",
    "Winner Takes All",
] as const;

export type Game = typeof GAMES[number];
export type TournamentType = typeof TOURNAMENT_TYPES[number];
export type TeamSize = typeof TEAM_SIZE[number];
export type PaymentMethod = typeof PAYMENT_METHODS[number];
export type PrizeDistributionMethod = typeof PRIZE_DISTRIBUTION_METHOD[number];