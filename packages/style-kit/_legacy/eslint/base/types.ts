import type { EslintRuleConfig } from "../types.js";

export type BaseRules = Record<string, EslintRuleConfig> & {
  camelcase?: EslintRuleConfig<{
    allow?: string[];
    ignoreDestructuring?: boolean;
    ignoreGlobals?: boolean;
    ignoreImports?: boolean;
    properties?: "always" | "never";
  }>;
  "func-style"?: EslintRuleConfig<
    "declaration" | "expression",
    {
      allowArrowFunctions?: boolean;
      overrides?: {
        namedExports?: "declaration" | "expression" | "ignore";
      };
    }
  >;
};
