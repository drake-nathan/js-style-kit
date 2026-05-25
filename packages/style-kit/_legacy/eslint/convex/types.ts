import type { EslintRuleConfig } from "../types.js";

export interface ConvexRules {
  "@convex-dev/import-wrong-runtime": EslintRuleConfig;
  "@convex-dev/no-old-registered-function-syntax": EslintRuleConfig;
  "@convex-dev/require-args-validator": EslintRuleConfig;
}
