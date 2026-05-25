import { defineConfig } from "eslint/config";
import tseslint, { type Config } from "typescript-eslint";

import type { EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { tseslintRules } from "./rules.js";

/**
 * Creates a TypeScript ESLint configuration object.
 *
 * @param tsconfigPath - Path to the TypeScript configuration file
 * @param customRules - Optional object containing custom rules to override or add to the TypeScript configuration.
 * @returns TypeScript ESLint configuration object
 */
export const tseslintConfig = (
  tsconfigPath?: string,
  customRules?: Record<string, EslintRuleConfig>,
): Config => {
  const userCwd = process.cwd();

  return defineConfig(
    {
      files: ["**/*.{js,cjs,mjs,ts,jsx,tsx}"],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ...(tsconfigPath ?
            { project: tsconfigPath, tsconfigRootDir: userCwd }
          : { projectService: true, tsconfigRootDir: import.meta.dirname }),
        },
      },
      name: configNames.typescript,
      plugins: {
        "@typescript-eslint": tseslint.plugin,
      },
      rules: {
        ...tseslintRules,
        ...(customRules ?? {}),
      },
    },
    {
      // disable type-aware linting on JS files
      extends: [tseslint.configs.disableTypeChecked],
      files: ["**/*.js"],
    },
  );
};
