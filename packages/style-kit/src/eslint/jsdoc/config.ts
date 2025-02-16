import jsdoc from "eslint-plugin-jsdoc";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { jsdocRules } from "./rules.js";

export const jsdocConfig = (requireJsdoc = false): EslintConfigObject => ({
  name: configNames.jsdoc,
  plugins: {
    jsdoc,
  },
  rules: jsdocRules(requireJsdoc),
});
