import type { Linter } from "eslint";

import type { ConfigName } from "./constants.js";
import type { BaseRules } from "./javascript/rules.js";
import type { JsdocRules } from "./jsdoc/types.js";

export type EslintSeverity = 0 | 1 | 2 | "error" | "off" | "warn";

export type EslintRuleConfig<
  TOptions = Record<string, unknown>,
  TOptions2 = Record<string, unknown>,
> =
  | [EslintSeverity, string | TOptions | undefined]
  | [EslintSeverity, string | undefined, TOptions2 | undefined]
  | [EslintSeverity, TOptions | undefined, TOptions2 | undefined]
  | [EslintSeverity]
  | EslintSeverity;

export type FunctionStyle = "arrow" | "declaration" | "expression";

export interface EslintConfigObject extends Linter.Config {
  name: ConfigName;
}

export type Rules = BaseRules & JsdocRules;
