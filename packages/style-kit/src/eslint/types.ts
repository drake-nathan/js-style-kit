import type { Linter } from "eslint";

import type { ConfigName } from "./constants.js";

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

export interface EslintConfigObject<
  Rules extends Linter.RulesRecord = Linter.RulesRecord,
> extends Linter.Config<Rules> {
  name: ConfigName;
}

export type FilenameCase =
  | "camelCase"
  | "kebabCase"
  | "pascalCase"
  | "snakeCase";

export type FunctionStyle = "arrow" | "declaration" | "expression";

export type ReactFramework =
  | "next"
  | "none"
  | "react-router"
  | "remix"
  | "vite";
