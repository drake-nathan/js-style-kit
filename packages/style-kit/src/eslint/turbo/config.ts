import turbo from "eslint-plugin-turbo";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";
import type { TurboRules } from "./types.js";

import { configNames } from "../constants.js";

/**
 * Creates an ESLint configuration for Turbo.
 *
 * @param customRules - Optional custom rules to merge with the default Turbo rules.
 * @returns ESLint configuration object for Turbo.
 */
export const turboConfig = (
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  name: configNames.turbo,
  plugins: {
    turbo,
  },
  rules:
    customRules ??
    ({
      "turbo/no-undeclared-env-vars": "warn",
    } satisfies TurboRules),
});
