import type { Linter } from "eslint";

import type { EslintRuleConfig, FunctionStyle } from "./types.js";

import { isObject, isString } from "../utils/is-type.js";
import { baseEslintConfig } from "./base/config.js";
import { configNames } from "./constants.js";
import { ignoresConfig } from "./ignores.js";
import { importConfig } from "./import/config.js";
import { jsdocConfig } from "./jsdoc/config.js";
import { nextjsConfig } from "./nextjs/config.js";
import { perfectionistConfig } from "./perfectionist/config.js";
import { preferArrowFunctionConfig } from "./prefer-arrow-function/config.js";
import { processCustomRules } from "./process-custom-rules.js";
import { reactCompilerEslintConfig } from "./react-compiler/config.js";
import { reactRefreshEslintConfig } from "./react-refresh/config.js";
import { reactEslintConfig } from "./react/config.js";
import { storybookConfig } from "./storybook/config.js";
import { testingConfig, type TestingConfig } from "./testing/config.js";
import { turboConfig } from "./turbo/config.js";
import { tseslintConfig } from "./typescript/config.js";
import { unicornConfig } from "./unicorn/config.js";

// Default configuration for testing
const DEFAULT_TESTING_CONFIG: TestingConfig = {
  filenamePattern: "test",
  files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
  formattingRules: true,
  framework: "vitest",
  itOrTest: "it",
};

export interface EslintConfigOptions {
  functionStyle?: "off" | FunctionStyle;
  ignores?: string[];
  importPlugin?: boolean;
  jsdoc?:
    | false
    | {
        requireJsdoc?: boolean;
      };
  react?:
    | boolean
    | {
        framework?: "next" | "none" | "vite";
        reactCompiler?: boolean;
        reactRefresh?: boolean;
      };
  rules?: Record<string, EslintRuleConfig>;
  sorting?: boolean;
  storybook?: boolean;
  testing?: false | TestingConfig;
  turbo?: boolean;
  typescript?: boolean | string;
  unicorn?: boolean;
}

/**
 * Configures ESLint based on provided options.
 *
 * @param options - The optional configuration object.
 * @param options.functionStyle - The function style to enforce. Defaults to "arrow".
 * @param options.ignores - Additional paths to ignore. Already excludes `node_modules` and `dist`.
 * @param options.importPlugin - Whether to include the import plugin. Defaults to true.
 * @param options.jsdoc - Whether to include JSDoc rules. Set to false to disable, or provide an object to configure.
 * @param options.react - Whether to include React rules. When true, reactCompiler is enabled by default.
 *                        Can be configured with an object to control next.js support and reactCompiler.
 *                        Also controls reactRefresh, which is enabled by default when react is true.
 *                        Can specify framework as "next", "none", or "vite" to control related configs:
 *                        - "next": Includes Next.js config, excludes React Refresh.
 *                        - "vite" or "none": Includes React Refresh, excludes Next.js.
 *                        - The reactRefresh property can override this framework-based behavior.
 * @param options.sorting - Whether to include sorting rules from Perfectionist. Defaults to true.
 * @param options.storybook - Whether to include Storybook rules. Defaults to false.
 * @param options.testing - An object with the following properties:
 *                          - `filenamePattern`: One of "spec" or "test" to determine which filename pattern to use.
 *                          - `files`: Array of file patterns to include in the configuration.
 *                          - `framework`: One of "vitest" or "jest" to determine which testing library to use.
 *                          - `formattingRules`: Whether to include formatting rules like padding around blocks.
 *                          - `itOrTest`: One of "it" or "test" to determine which test function to use.
 * @param options.typescript - Whether to include TypeScript rules. Can be a boolean or a string with path to tsconfig.
 * @param options.turbo - Whether to include Turborepo rules. Defaults to false.
 * @param options.unicorn - Whether to include Unicorn rules. Defaults to true.
 * @param options.rules - This is for rules that you need to alter or turn off.
 * @param additionalConfigs - Additional ESLint config objects to be merged into the final configuration.
 * @returns An array of ESLint configuration objects.
 */
export const eslintConfig = (
  {
    functionStyle = "arrow",
    ignores = [],
    importPlugin = true,
    jsdoc = { requireJsdoc: false },
    react = false,
    rules,
    sorting = true,
    storybook = false,
    testing = DEFAULT_TESTING_CONFIG,
    turbo = false,
    typescript = true,
    unicorn = true,
  }: EslintConfigOptions = {},
  ...additionalConfigs: Linter.Config[]
): Linter.Config[] => {
  // Categorize user's custom rules first
  const categorizedRules = processCustomRules(rules);

  const usingNextjs = isObject(react) && react.framework === "next";

  const configs: Linter.Config[] = [
    ignoresConfig({
      next: usingNextjs,
      storybook,
      userIgnores: ignores,
    }),
    baseEslintConfig(
      functionStyle,
      Boolean(typescript),
      categorizedRules[configNames.base],
    ),
  ];

  if (jsdoc !== false) {
    configs.push(
      jsdocConfig(
        jsdoc.requireJsdoc ?? false,
        categorizedRules[configNames.jsdoc],
      ),
    );
  }

  if (typescript) {
    configs.push(
      ...(tseslintConfig(
        isString(typescript) ? typescript : undefined,
        categorizedRules[configNames.typescript],
      ) as Linter.Config[]),
    );
  }

  if (importPlugin) {
    configs.push(
      importConfig(Boolean(typescript), categorizedRules[configNames.import]),
    );
  }

  if (react) {
    // Apply reactRefresh based on framework setting or explicit override
    const shouldUseReactRefresh =
      // Explicit setting takes precedence
      (isObject(react) && react.reactRefresh === true) ||
      // Framework-based default (vite/none use reactRefresh by default)
      (isObject(react) &&
        (react.framework === "vite" || react.framework === "none") &&
        react.reactRefresh !== false);

    if (shouldUseReactRefresh) {
      // Assuming reactRefreshEslintConfig becomes a function accepting rules
      configs.push(
        reactRefreshEslintConfig(categorizedRules[configNames.reactRefresh]),
      );
    }

    configs.push(
      reactEslintConfig(
        functionStyle,
        Boolean(typescript),
        categorizedRules[configNames.react],
      ),
    );

    // Apply reactCompiler by default if react is true or if react.reactCompiler isn't explicitly false
    const shouldUseReactCompiler =
      react === true || (isObject(react) && react.reactCompiler !== false);

    if (shouldUseReactCompiler) {
      // Assuming reactCompilerEslintConfig becomes a function accepting rules
      configs.push(
        reactCompilerEslintConfig(categorizedRules[configNames.reactCompiler]),
      );
    }

    if (usingNextjs) {
      // Assuming nextjsConfig becomes a function accepting rules
      configs.push(nextjsConfig(categorizedRules[configNames.nextjs]));
    }
  }

  if (testing !== false) {
    // Use the provided testing config or the default if testing is true
    const mergedTestingConfig: TestingConfig =
      isObject(testing) ? testing : DEFAULT_TESTING_CONFIG;

    // Destructure from the merged config
    const { filenamePattern, files, formattingRules, framework, itOrTest } =
      mergedTestingConfig;

    configs.push(
      testingConfig(
        {
          filenamePattern,
          files,
          formattingRules,
          framework,
          itOrTest,
        },
        categorizedRules[configNames.testing],
      ),
    );
  }

  if (sorting) {
    // Assuming perfectionistConfig becomes a function accepting rules
    configs.push(
      perfectionistConfig(categorizedRules[configNames.perfectionist]),
    );
  }

  if (unicorn) {
    // Assuming unicornConfig becomes a function accepting rules
    configs.push(unicornConfig(categorizedRules[configNames.unicorn]));
  }

  if (functionStyle === "arrow") {
    // Assuming preferArrowFunctionConfig becomes a function accepting rules
    // Passing base rules as prefer-arrow-function isn't mapped directly
    configs.push(
      preferArrowFunctionConfig(
        categorizedRules[configNames.preferArrowFunction],
      ),
    );
  }

  if (storybook) {
    // Assuming storybookConfig handles distribution of categorizedRules.storybook
    configs.push(...storybookConfig(categorizedRules[configNames.storybook])); // 'storybook' is correct ConfigName here
  }

  if (turbo) {
    // Assuming turboConfig becomes a function accepting rules
    configs.push(turboConfig(categorizedRules[configNames.turbo]));
  }

  // Add any additional config objects provided by the user
  if (additionalConfigs.length > 0) {
    configs.push(...additionalConfigs);
  }

  return configs;
};
