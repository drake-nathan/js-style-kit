import type { EslintRuleConfig } from "../types.js";

export type ReactFunctionDefinitions =
  | "arrow-function"
  | "function-declaration"
  | "function-expression";

export type ReactRules = Record<
  `${"react" | "react-hooks"}/${string}`,
  EslintRuleConfig
> & {
  "react/destructuring-assignment"?: EslintRuleConfig<
    "always" | "never",
    {
      destructureInSignature?: "always" | "ignore";
      ignoreClassFields?: boolean;
    }
  >;
  "react/function-component-definition"?: EslintRuleConfig<{
    namedComponents?: ReactFunctionDefinitions | ReactFunctionDefinitions[];
    unnamedComponents?:
      | "arrow-function"
      | "function-expression"
      | ("arrow-function" | "function-expression")[];
  }>;
};
