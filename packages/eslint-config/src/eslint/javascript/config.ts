import type { Linter } from "eslint";

import { baseEslintRules } from "./rules.js";

export const baseEslintConfig: Linter.Config = {
  linterOptions: { reportUnusedDisableDirectives: true },
  name: "base-eslint-config",
  rules: baseEslintRules,
};
