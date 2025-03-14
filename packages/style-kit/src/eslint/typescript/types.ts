import type { EslintRuleConfig } from "../types.js";

export type TypescriptRules = Record<
  `@typescript-eslint/${string}`,
  EslintRuleConfig
>;
