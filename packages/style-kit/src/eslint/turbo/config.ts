import turbo from "eslint-plugin-turbo";

import type { EslintConfigObject } from "../types.js";
import type { TurboRules } from "./types.js";

import { configNames } from "../constants.js";

/**
 * Creates an ESLint configuration for Turbo.
 *
 * @returns ESLint configuration object for Turbo
 */
export const turboConfig = (): EslintConfigObject => ({
  name: configNames.turbo,
  plugins: {
    turbo,
  },
  rules: {
    "turbo/no-undeclared-env-vars": "warn",
  } satisfies TurboRules,
});
