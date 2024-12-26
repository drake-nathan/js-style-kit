import type { Linter } from "eslint";

import { javascriptEslintRules } from "./rules.js";

export const javascriptEslintObj = {
  linterOptions: { reportUnusedDisableDirectives: true },
  name: "javascript",
  rules: javascriptEslintRules,
} satisfies Linter.Config;
