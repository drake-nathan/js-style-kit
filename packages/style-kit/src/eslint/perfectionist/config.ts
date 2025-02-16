import perfectionist from "eslint-plugin-perfectionist";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { perfectionistRules } from "./rules.js";

export const perfectionistConfig: EslintConfigObject = {
  name: configNames.perfectionist,
  plugins: {
    perfectionist,
  },
  rules: perfectionistRules,
};
