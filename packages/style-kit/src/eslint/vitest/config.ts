import vitest from "eslint-plugin-vitest";

import type { EslintConfigObject } from "../types.js";

import { configNames } from "../constants.js";
import { vitestRules } from "./rules.js";

/**
 * Creates an ESLint configuration object for Vitest.
 *
 * @param options - Configuration options
 * @param options.files - Files to include in the configuration
 * @param options.filenamePattern - ".test" or ".spec" filename pattern
 * @param options.itOrTest - "it" or "test"
 * @returns ESLint configuration object
 */
export const vitestConfig = (
  {
    filenamePattern,
    files,
    itOrTest,
  }: {
    filenamePattern?: "spec" | "test";
    files?: string[];
    itOrTest?: "it" | "test";
  } = {
    filenamePattern: "test",
    itOrTest: "test",
  },
): EslintConfigObject => ({
  files: files ?? ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
  languageOptions: {
    globals: {
      ...vitest.environments.env.globals,
    },
  },
  name: configNames.vitest,
  plugins: {
    vitest,
  },
  rules: vitestRules({ filenamePattern, itOrTest }),
});
