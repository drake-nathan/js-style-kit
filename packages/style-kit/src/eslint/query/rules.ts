import type { QueryRules } from "./types.js";

export const queryRules: QueryRules = {
  "@tanstack/query/exhaustive-deps": "warn",
  "@tanstack/query/infinite-query-property-order": "warn",
  "@tanstack/query/mutation-property-order": "warn",
  "@tanstack/query/no-rest-destructuring": "warn",
  "@tanstack/query/no-unstable-deps": "warn",
  "@tanstack/query/no-void-query-fn": "warn",
  "@tanstack/query/stable-query-client": "warn",
};
