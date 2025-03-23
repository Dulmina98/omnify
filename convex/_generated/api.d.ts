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
import type * as admins from "../admins.js";
import type * as match_results from "../match_results.js";
import type * as organizers from "../organizers.js";
import type * as players from "../players.js";
import type * as tournament_entries from "../tournament_entries.js";
import type * as tournaments from "../tournaments.js";
import type * as transactions from "../transactions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admins: typeof admins;
  match_results: typeof match_results;
  organizers: typeof organizers;
  players: typeof players;
  tournament_entries: typeof tournament_entries;
  tournaments: typeof tournaments;
  transactions: typeof transactions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
