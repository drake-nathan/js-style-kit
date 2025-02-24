import type { EslintRuleConfig } from "../types.js";

export type JsdocRules = Record<`jsdoc/${string}`, EslintRuleConfig> & {
  "jsdoc/check-param-names": EslintRuleConfig<{
    allowExtraTrailingParamDocs?: boolean;
    checkDestructured?: boolean;
    checkRestProperty?: boolean;
    checkTypesPattern?: string;
    disableExtraPropertyReporting?: boolean;
    disableMissingParamChecks?: boolean;
    enableFixer?: boolean;
    useDefaultObjectProperties?: boolean;
  }>;
  "jsdoc/require-jsdoc": EslintRuleConfig<{
    checkConstructors?: boolean;
    checkGetters?: boolean;
    checkSetters?: boolean;
    contexts?: (object | string)[];
    enableFixer?: boolean;
    exemptEmptyConstructors?: boolean;
    fixerMessage?: string;
    minLineCount?: number | undefined;
    publicOnly?:
      | boolean
      | {
          ancestorsOnly?: boolean;
          cjs?: boolean;
          esm?: boolean;
          window?: boolean;
        };
    require?: {
      ArrowFunctionExpression?: boolean;
      ClassDeclaration?: boolean;
      ClassExpression?: boolean;
      FunctionDeclaration?: boolean;
      FunctionExpression?: boolean;
      MethodDefinition?: boolean;
    };
  }>;
  "jsdoc/tag-lines": EslintRuleConfig<
    "always" | "any" | "never",
    {
      applyToEndTag?: boolean;
      count?: number;
      endLines?: null | number;
      startLines?: null | number;
      tags?: Record<
        string,
        {
          count?: number;
          lines?: "always" | "any" | "never";
        }
      >;
    }
  >;
};
