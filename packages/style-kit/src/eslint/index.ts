import type { Linter } from "eslint";

import { isObject, isString } from "is-type-of";

import type { FunctionStyle } from "./types.js";

import { baseEslintConfig } from "./base/config.js";
import { ignoresConfig } from "./ignores.js";
import { jsdocConfig } from "./jsdoc/config.js";
import { perfectionistConfig } from "./perfectionist/config.js";
import { preferArrowFunctionConfig } from "./prefer-arrow-function/config.js";
import { reactCompilerEslintConfig } from "./react-compiler/config.js";
import { reactEslintConfig } from "./react/config.js";
import { tseslintConfig } from "./typescript/config.js";

export interface EslintConfigOptions {
  functionStyle?: "off" | FunctionStyle;
  ignores?: string[];
  jsdoc?:
    | false
    | {
        requireJsdoc?: boolean;
      };
  react?:
    | boolean
    | {
        next?: boolean | undefined;
        reactCompiler?: boolean | undefined;
      };
  sorting?: boolean;
  typescript?: boolean | string;
}

/**
 * Configures ESLint based on provided options.
 *
 * @param options - The optional configuration object.
 * @param options.functionStyle - The function style to enforce. Defaults to "arrow".
 * @param options.ignores - Additional paths to ignore. Already excludes `node_modules` and `dist`.
 * @param options.jsdoc - Whether to include JSDoc rules. Set to false to disable, or provide an object to configure.
 * @param options.react - Whether to include React rules. When true, reactCompiler is enabled by default.
 *                        Can be configured with an object to control next.js support and reactCompiler.
 * @param options.sorting - Whether to include sorting rules from Perfectionist. Defaults to true.
 * @param options.typescript - Whether to include TypeScript rules. Can be a boolean or a string with path to tsconfig.
 * @param additionalConfigs - Additional ESLint config objects to be merged into the final configuration.
 * @returns An array of ESLint configuration objects.
 */
export const eslintConfig = (
  {
    functionStyle = "arrow",
    ignores = [],
    jsdoc = { requireJsdoc: false },
    react = false,
    sorting = true,
    typescript = true,
  }: EslintConfigOptions = {},
  ...additionalConfigs: Linter.Config[]
): Linter.Config[] => {
  const configs: Linter.Config[] = [
    ignoresConfig({
      next: isObject(react) && react.next,
      userIgnores: ignores,
    }),
    baseEslintConfig(functionStyle),
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

  if (react) {
    configs.push(reactEslintConfig(functionStyle, Boolean(typescript)));

    // Apply reactCompiler by default if react is true or if react.reactCompiler isn't explicitly false
    const shouldUseReactCompiler =
      react === true || (isObject(react) && react.reactCompiler !== false);

    if (shouldUseReactCompiler) {
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
