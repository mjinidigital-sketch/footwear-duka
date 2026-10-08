/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as PasswordWithRole from "../PasswordWithRole.js";
import type * as auth from "../auth.js";
import type * as cart from "../cart.js";
import type * as categories from "../categories.js";
import type * as http from "../http.js";
import type * as mpesa from "../mpesa.js";
import type * as mpesaUtils from "../mpesaUtils.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as products from "../products.js";
import type * as reset from "../reset.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  PasswordWithRole: typeof PasswordWithRole;
  auth: typeof auth;
  cart: typeof cart;
  categories: typeof categories;
  http: typeof http;
  mpesa: typeof mpesa;
  mpesaUtils: typeof mpesaUtils;
  orders: typeof orders;
  payments: typeof payments;
  products: typeof products;
  reset: typeof reset;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
