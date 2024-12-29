import type { Linter } from "eslint";

import type { FunctionStyle } from "../types.js";

import { ignoresConfig } from "./ignores.js";
import { baseEslintConfig } from "./javascript/config.js";
import { perfectionistConfig } from "./perfectionist/config.js";
import { reactEslintConfig } from "./react/config.js";
import { tseslintConfig } from "./typescript/config.js";

export interface EslintConfigOptions {
  functionStyle?: FunctionStyle;
  ignores?: string[];
  import?: boolean;
  nextjs?: boolean;
  react?: boolean;
  sorting?: boolean;
  turbo?: boolean;
  typescript?: boolean;
}

/**
 * This function configures your ESLint config based on inputs. It accepts a configuration object with the following properties:
 *
 * @param options
 * @param options.functionStyle - The function style to use. Defaults to "arrow".
 * @param options.ignores - An array of paths to ignore. Already excludes `node_modules` and `dist`.
 * @param options.react - Whether to include React rules. Defaults to false.
 * @param options.sorting - Whether to include sorting rules from Perfectionist. Defaults to true.
 * @param options.typescript - Whether to include TypeScript rules. Defaults to true.
 * @returns The ESLint configuration array.
 */
export const eslintConfig = (
  options: EslintConfigOptions = {},
): Linter.Config[] => {
  const {
    functionStyle = "arrow",
    ignores = [],
    react = false,
    sorting = true,
    typescript = true,
  } = options;

  const configs: Linter.Config[] = [
    ignoresConfig(ignores),
    baseEslintConfig(functionStyle),
  ];

  if (typescript) {
    configs.push(...(tseslintConfig as Linter.Config[]));
  }

  if (react) {
    configs.push(reactEslintConfig(functionStyle, typescript));
  }

  if (sorting) {
    configs.push(perfectionistConfig);
  }

  return configs.filter(Boolean);
};
