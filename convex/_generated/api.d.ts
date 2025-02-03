/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {ApiFromModules, FilterApi, FunctionReference,} from "convex/server";
import type * as organizers from "../organizers.js";
import type * as players from "../players.js";
import type * as tournament_participants from "../tournament_participants.js";
import type * as tournaments from "../tournaments.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  organizers: typeof organizers;
  players: typeof players;
  tournament_participants: typeof tournament_participants;
  tournaments: typeof tournaments;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
