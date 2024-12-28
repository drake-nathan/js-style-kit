import type { Linter } from "eslint";

import perfectionist from "eslint-plugin-perfectionist";

import { perfectionistRules } from "./rules.js";

export const perfectionistConfig: Linter.Config = {
  plugins: {
    perfectionist,
  },
  rules: perfectionistRules,
};
