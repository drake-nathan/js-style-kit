import type { EslintRuleConfig } from "../types.js";

export interface ConvexRules {
  "@convex-dev/import-wrong-runtime": EslintRuleConfig;
  "@convex-dev/no-args-without-validator": EslintRuleConfig;
  "@convex-dev/no-missing-args-validator": EslintRuleConfig;
  "@convex-dev/no-old-registered-function-syntax": EslintRuleConfig;
}
