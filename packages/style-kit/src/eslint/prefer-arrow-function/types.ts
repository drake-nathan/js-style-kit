import type { EslintRuleConfig } from "../types.js";

export interface PreferArrowFunctionsRules {
  "prefer-arrow-functions/prefer-arrow-functions": EslintRuleConfig<{
    allowedNames?: string[];
    allowNamedFunctions?: boolean;
    allowObjectProperties?: boolean;
    classPropertiesAllowed?: boolean;
    disallowPrototype?: boolean;
    returnStyle?: "explicit" | "implicit" | "unchanged";
    singleReturnOnly?: boolean;
  }>;
}
