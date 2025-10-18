import type { Linter } from "eslint";

import type {
  EslintRuleConfig,
  FilenameCase,
  FunctionStyle,
  ReactFramework,
} from "./types.js";

import { isObject, isString } from "../utils/is-type.js";
import { baseEslintConfig } from "./base/config.js";
import { configNames } from "./constants.js";
import { convexConfig } from "./convex/config.js";
import { ignoresConfig } from "./ignores.js";
import { importConfig } from "./import/config.js";
import { jsdocConfig } from "./jsdoc/config.js";
import { nextjsConfig } from "./nextjs/config.js";
import { perfectionistConfig } from "./perfectionist/config.js";
import { preferArrowFunctionConfig } from "./prefer-arrow-function/config.js";
import { processCustomRules } from "./process-custom-rules.js";
import { queryConfig } from "./query/config.js";
import { reactRefreshEslintConfig } from "./react-refresh/config.js";
import { reactEslintConfig } from "./react/config.js";
import { storybookConfig } from "./storybook/config.js";
import { testingConfig, type TestingConfig } from "./testing/config.js";
import { turboConfig } from "./turbo/config.js";
import { tseslintConfig } from "./typescript/config.js";
import { unicornConfig } from "./unicorn/config.js";

const defaultTestingConfig: TestingConfig = {
  filenamePattern: "test",
  files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
  formattingRules: true,
  framework: "vitest",
  importRestrictions: true,
  itOrTest: "it",
};

export interface EslintConfigOptions {
  convex?: boolean;
  functionStyle?: "off" | FunctionStyle;
  ignores?: string[];
  importPlugin?: boolean;
  jsdoc?:
    | false
    | {
        requireJsdoc?: boolean;
      };
  query?: boolean;
  react?:
    | boolean
    | {
        framework?: ReactFramework;
        reactCompiler?: boolean;
        reactRefresh?: boolean;
      };
  rules?: Record<string, EslintRuleConfig>;
  sorting?: boolean;
  storybook?: boolean;
  testing?: false | TestingConfig;
  turbo?: boolean;
  typescript?: boolean | string;
  unicorn?:
    | boolean
    | {
        filenameCase?: FilenameCase;
      };
}

/**
 * Configures ESLint based on provided options.
 *
 * @param options - The optional configuration object.
 * @param options.convex - Whether to include Convex rules.
 * @param options.functionStyle - The function style to enforce. Defaults to "arrow".
 * @param options.ignores - Additional paths to ignore. Already excludes `node_modules` and `dist`.
 * @param options.importPlugin - Whether to include the import plugin. Defaults to true.
 * @param options.jsdoc - Whether to include JSDoc rules. Set to false to disable, or provide an object to configure.
 * @param options.query - Whether to include TanStack Query rules.
 * @param options.react - Whether to include React, React hooks, and React compiler rules.
 *                        Can specify framework as "next", "none", "react-router", "remix", or "vite" to control related configs:
 *                        - "next": Includes Next.js config, excludes React Refresh.
 *                        - "vite" or "none": Includes React Refresh, excludes Next.js.
 *                        - "remix" or "react-router": Excludes both Next.js and React Refresh (these frameworks handle their own refresh logic).
 *                        - The reactRefresh property can override this framework-based behavior.
 * @param options.sorting - Whether to include sorting rules from Perfectionist. Defaults to true.
 * @param options.storybook - Whether to include Storybook rules. Defaults to false.
 * @param options.testing - An object with the following properties:
 *                          - `filenamePattern`: One of "spec" or "test" to determine which filename pattern to use.
 *                          - `files`: Array of file patterns to include in the configuration.
 *                          - `framework`: One of "vitest" or "jest" or "bun" or "node" to determine which testing library to use.
 *                          - `formattingRules`: Whether to include formatting rules like padding around blocks.
 *                          - `importRestrictions`: Whether to enforce imports from the correct testing framework.
 *                          - `itOrTest`: One of "it" or "test" to determine which test function to use.
 * @param options.typescript - Whether to include TypeScript rules. Can be a boolean or a string with path to tsconfig.
 * @param options.turbo - Whether to include Turborepo rules. Defaults to false.
 * @param options.unicorn - Whether to include Unicorn rules. Defaults to true. Can be an object with filenameCase property.
 * @param options.rules - This is for rules that you need to alter or turn off.
 * @param additionalConfigs - Additional ESLint config objects to be merged into the final configuration.
 * @returns An array of ESLint configuration objects.
 */
export const eslintConfig = (
  {
    convex = false,
    functionStyle = "arrow",
    ignores = [],
    importPlugin = true,
    jsdoc = { requireJsdoc: false },
    query = false,
    react = false,
    rules,
    sorting = true,
    storybook = false,
    testing = defaultTestingConfig,
    turbo = false,
    typescript = true,
    unicorn = { filenameCase: "kebabCase" },
  }: EslintConfigOptions = {},
  ...additionalConfigs: Linter.Config[]
): Linter.Config[] => {
  // Categorize user's custom rules first
  const categorizedRules = rules === undefined ? {} : processCustomRules(rules);

  const configs: Linter.Config[] = [
    ignoresConfig({
      reactFramework:
        isObject(react) && react.framework ? react.framework : "none",
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
    const reactOptions = isObject(react) ? react : {};

    // Apply reactRefresh based on framework setting or explicit override
    const shouldUseReactRefresh =
      // Explicit setting takes precedence
      reactOptions.reactRefresh === true ||
      // Framework-based default (vite/none use reactRefresh by default)
      ((reactOptions.framework === "vite" ||
        reactOptions.framework === "none") &&
        reactOptions.reactRefresh !== false);

    if (shouldUseReactRefresh) {
      configs.push(
        reactRefreshEslintConfig(categorizedRules[configNames.reactRefresh]),
      );
    }

    configs.push(
      reactEslintConfig({
        customRules: categorizedRules[configNames.react],
        functionStyle,
        reactCompiler: reactOptions.reactCompiler ?? true,
        typescript: Boolean(typescript),
      }),
    );

    if (isObject(react) && react.framework === "next") {
      configs.push(nextjsConfig(categorizedRules[configNames.nextjs]));
    }
  }

  if (query) {
    configs.push(queryConfig(categorizedRules[configNames.query]));
  }

  if (convex) {
    configs.push(convexConfig(categorizedRules[configNames.convex]));
  }

  if (testing !== false) {
    // Use the provided testing config or the default if testing is true
    const mergedTestingConfig: TestingConfig =
      isObject(testing) ?
        { ...defaultTestingConfig, ...testing }
      : defaultTestingConfig;

    // Destructure from the merged config
    const {
      filenamePattern,
      files,
      formattingRules,
      framework,
      importRestrictions,
      itOrTest,
    } = mergedTestingConfig;

    configs.push(
      testingConfig(
        {
          filenamePattern,
          files,
          formattingRules,
          framework,
          importRestrictions,
          itOrTest,
          typescript: Boolean(typescript),
        },
        categorizedRules[configNames.testing],
      ),
    );
  }

  if (sorting) {
    configs.push(
      perfectionistConfig(categorizedRules[configNames.perfectionist]),
    );
  }

  if (unicorn) {
    const filenameCase = isObject(unicorn) ? unicorn.filenameCase : undefined;
    configs.push(
      unicornConfig({
        customRules: categorizedRules[configNames.unicorn],
        filenameCase,
      }),
    );
  }

  if (functionStyle === "arrow") {
    configs.push(
      preferArrowFunctionConfig(
        categorizedRules[configNames.preferArrowFunction],
      ),
    );
  }

  if (storybook) {
    configs.push(...storybookConfig(categorizedRules[configNames.storybook]));
  }

  if (turbo) {
    configs.push(turboConfig(categorizedRules[configNames.turbo]));
  }

  // Add any additional config objects provided by the user
  if (additionalConfigs.length > 0) {
    configs.push(...additionalConfigs);
  }

  return configs;
};
