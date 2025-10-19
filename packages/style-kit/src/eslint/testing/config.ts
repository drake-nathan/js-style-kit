import jest from "eslint-plugin-jest";
import vitest from "eslint-plugin-vitest";

import type { EslintConfigObject, EslintRuleConfig } from "../types.js";

import { configNames } from "../constants.js";
import { getImportRestrictions } from "./get-import-restrictions.js";
import { jestRules } from "./jest-rules.js";
import { vitestRules } from "./vitest-rules.js";

export interface TestingConfig {
  filenamePattern?: "spec" | "test";
  files?: string[];
  formattingRules?: boolean;
  framework?: "bun" | "jest" | "node" | "vitest";
  /**
   * Whether to enforce imports from the correct testing framework.
   * Uses the built-in ESLint `no-restricted-imports` rule.
   *
   * @default true
   */
  importRestrictions?: boolean;
  itOrTest?: "it" | "test";
  typescript?: boolean;
}

/**
 * Creates an ESLint configuration object for testing.
 *
 * @param options - Configuration options
 * @param options.files - Files to include in the configuration
 * @param options.filenamePattern - ".test" or ".spec" filename pattern
 * @param options.itOrTest - "it" or "test"
 * @param options.framework - "jest" or "vitest" or "bun" or "node"
 * @param options.formattingRules - Whether to include formatting rules like padding around blocks
 * @param options.importRestrictions - Whether to enforce imports from the correct testing framework
 * @param options.typescript - Whether the user is using TypeScript
 * @param customRules - Optional object containing custom rules to override or add to the testing configuration.
 * @returns ESLint configuration object
 */
export const testingConfig = (
  {
    filenamePattern = "test",
    files,
    formattingRules = true,
    framework = "vitest",
    importRestrictions = true,
    itOrTest = "test",
    typescript = true,
  }: TestingConfig = {},
  customRules?: Record<string, EslintRuleConfig>,
): EslintConfigObject => ({
  files: files ?? ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
  languageOptions: {
    globals:
      framework === "vitest" ?
        { ...vitest.environments.env.globals }
      : jest.environments.globals.globals,
  },
  name: configNames.testing,
  plugins: {
    jest,
    vitest,
  },
  rules: {
    ...(typescript ? { "@typescript-eslint/unbound-method": "off" } : {}),
    // jest doesn't have a file name rule, so we'll use this one for both
    "vitest/consistent-test-filename": [
      "warn",
      {
        allTestPattern: ".*\\.(test|spec)\\.[tj]sx?$",
        pattern: `.*\\.${filenamePattern}\\.[tj]sx?$`,
      },
    ],
    ...(framework === "vitest" ? vitestRules(itOrTest) : jestRules(itOrTest)),
    ...(formattingRules ?
      {
        "jest/padding-around-after-all-blocks": "warn",
        "jest/padding-around-after-each-blocks": "warn",
        "jest/padding-around-before-all-blocks": "warn",
        "jest/padding-around-before-each-blocks": "warn",
        "jest/padding-around-describe-blocks": "warn",
        "jest/padding-around-expect-groups": "warn",
        "jest/padding-around-test-blocks": "warn",
      }
    : {}),
    ...(importRestrictions ? getImportRestrictions(framework) : {}),
    ...(customRules ?? {}),
  },
  ...(framework !== "jest" && framework !== "vitest" ?
    {
      settings: {
        jest: {
          globalPackage: framework === "node" ? "node:test" : "bun:test",
        },
      },
    }
  : {}),
});
