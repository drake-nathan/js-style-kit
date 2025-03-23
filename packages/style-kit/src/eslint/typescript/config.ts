import tseslint, { type Config } from "typescript-eslint";

import { configNames } from "../constants.js";
import { tseslintRules } from "./rules.js";

/**
 * Creates a TypeScript ESLint configuration object.
 *
 * @param tsconfigPath - Path to the TypeScript configuration file
 * @returns TypeScript ESLint configuration object
 */
export const tseslintConfig = (tsconfigPath?: string): Config => {
  const userCwd = process.cwd();

  return tseslint.config(
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
      rules: tseslintRules,
    },
    {
      // disable type-aware linting on JS files
      extends: [tseslint.configs.disableTypeChecked],
      files: ["**/*.js"],
    },
    // {
    //   files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    //   name: configNames.typescriptTesting,
    //   rules: {
    //     "@typescript-eslint/no-unbound-methods": "off",
    //   },
    // },
  );
};
