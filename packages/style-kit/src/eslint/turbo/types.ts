import type { EslintRuleConfig } from "../types.js";

export interface TurboRules {
  "turbo/no-undeclared-env-vars": EslintRuleConfig<{
    allowList?: string[];
  }>;
}
