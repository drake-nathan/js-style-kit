import type { Linter } from "eslint";

import { isString } from "is-type-of";

import type { FunctionStyle } from "./types.js";

import { ignoresConfig } from "./ignores.js";
import { importConfig } from "./import/config.js";
import { baseEslintConfig } from "./javascript/config.js";
import { jsdocConfig } from "./jsdoc/config.js";
import { perfectionistConfig } from "./perfectionist/config.js";
import { preferArrowFunctionConfig } from "./prefer-arrow-function/config.js";
import { reactCompilerEslintConfig } from "./react-compiler/config.js";
import { reactEslintConfig } from "./react/config.js";
import { tseslintConfig } from "./typescript/config.js";

export type EslintConfigOptions = {
  functionStyle?: "off" | FunctionStyle;
  ignores?: string[];
  importPlugin?: boolean;
  jsdoc?:
    | false
    | {
        requireJsdoc?: boolean;
      };
  sorting?: boolean;
  typescript?: boolean | string;
} & (
  | {
      react: true;
      reactCompiler: boolean | undefined;
    }
  | {
      react?: boolean;
    }
);

/**
 * This function configures your ESLint config based on inputs. It accepts a configuration object with the following properties:
 *
 * @param options - The optional configuration object.
 * @param options.functionStyle - The function style to use. Defaults to "arrow".
 * @param options.ignores - An array of paths to ignore. Already excludes `node_modules` and `dist`.
 * @param options.importPlugin - Whether to include the import plugin. Defaults to true.
 * @param options.jsdoc - Whether to include JSDoc rules. Defaults to true.
 * @param options.react - Whether to include React rules. Defaults to false.
 * @param options.sorting - Whether to include sorting rules from Perfectionist. Defaults to true.
 * @param options.typescript - Whether to include TypeScript rules OR a string with the path to your tsconfig. Defaults to true.
 * @param additionalConfigs - Additional ESLint config objects to be included in the final configuration.
 * @returns The ESLint configuration array.
 */
export const eslintConfig = (
  {
    functionStyle = "arrow",
    ignores = [],
    importPlugin = true,
    jsdoc = { requireJsdoc: false },
    react = false,
    sorting = true,
    typescript = true,
    ...options
  }: EslintConfigOptions = {},
  ...additionalConfigs: Linter.Config[]
): Linter.Config[] => {
  const configs: Linter.Config[] = [
    ignoresConfig(ignores),
    baseEslintConfig(functionStyle, Boolean(typescript)),
  ];

  if (jsdoc !== false) {
    configs.push(jsdocConfig(jsdoc.requireJsdoc ?? false));
  }

  if (typescript) {
    configs.push(
      ...(tseslintConfig(
        isString(typescript) ? typescript : undefined,
      ) as Linter.Config[]),
    );
  }

  if (importPlugin) {
    configs.push(importConfig(Boolean(typescript)));
  }

  if (react) {
    configs.push(reactEslintConfig(functionStyle, Boolean(typescript)));

    // Default to true if not explicitly set to false
    if (!("reactCompiler" in options) || options.reactCompiler !== false) {
      configs.push(reactCompilerEslintConfig);
    }
  }

  if (sorting) {
    configs.push(perfectionistConfig);
  }

  if (functionStyle === "arrow") {
    configs.push(preferArrowFunctionConfig());
  }

  // Add any additional config objects provided by the user
  if (additionalConfigs.length > 0) {
    configs.push(...additionalConfigs);
  }

  return configs;
};
