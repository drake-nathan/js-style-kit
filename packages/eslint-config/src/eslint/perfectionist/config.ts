import type { Linter } from "eslint";

import perfectionist from "eslint-plugin-perfectionist";

import { configNames } from "../constants.js";
import { perfectionistRules } from "./rules.js";

export const perfectionistConfig: Linter.Config = {
  name: configNames.perfectionist,
  plugins: {
    perfectionist,
  },
  rules: perfectionistRules,
};
