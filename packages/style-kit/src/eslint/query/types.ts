import type { EslintRuleConfig } from "../types.js";

export interface QueryRules {
  "@tanstack/query/exhaustive-deps": EslintRuleConfig;
  "@tanstack/query/infinite-query-property-order": EslintRuleConfig;
  "@tanstack/query/mutation-property-order": EslintRuleConfig;
  "@tanstack/query/no-rest-destructuring": EslintRuleConfig;
  "@tanstack/query/no-unstable-deps": EslintRuleConfig;
  "@tanstack/query/no-void-query-fn": EslintRuleConfig;
  "@tanstack/query/stable-query-client": EslintRuleConfig;
}
