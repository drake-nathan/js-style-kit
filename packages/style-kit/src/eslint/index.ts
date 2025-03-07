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
import { vitestConfig } from "./vitest/config.js";

export interface TestingConfig {
  filenamePattern?: "spec" | "test";
  files?: string[];
  itOrTest?: "it" | "test";
  lib?: "jest" | "vitest";
}

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
  testing?: false | TestingConfig;
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
 * @param options.testing - An object with the following properties:
 *                          - `filenamePattern`: One of "spec" or "test" to determine which filename pattern to use.
 *                          - `files`: Array of file patterns to include in the configuration.
 *                          - `itOrTest`: One of "it" or "test" to determine which test function to use.
 *                          - `lib`: One of "jest" or "vitest" to determine which testing library to use.
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
    testing,
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

  if (testing !== false) {
    const defaultTestingConfig: TestingConfig = {
      filenamePattern: "test",
      files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
      itOrTest: "it",
      lib: "vitest",
    };

    // Merge the user's testing config with defaults
    const mergedTestingConfig: TestingConfig = {
      ...defaultTestingConfig,
      ...(isObject(testing) ? testing : {}),
    };

    // Destructure from the merged config
    const { filenamePattern, files, itOrTest, lib } = mergedTestingConfig;

    if (lib === "vitest") {
      configs.push(
        vitestConfig({
          filenamePattern,
          files,
          itOrTest,
        }),
      );
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
