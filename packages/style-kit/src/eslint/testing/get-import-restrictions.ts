import type { EslintRuleConfig } from "../types.js";

const commonTestImports = [
  "describe",
  "it",
  "test",
  "expect",
  "beforeAll",
  "beforeEach",
  "afterAll",
  "afterEach",
  "vi",
  "mock",
  "spyOn",
];

const frameworkConfig = {
  bun: {
    allowed: "'bun:test'",
    restricted: ["vitest", "jest", "@jest/globals", "node:test"],
  },
  jest: {
    allowed: "'jest' or '@jest/globals'",
    restricted: ["vitest", "bun:test", "node:test"],
  },
  node: {
    allowed: "'node:test'",
    restricted: ["vitest", "jest", "@jest/globals", "bun:test"],
  },
  vitest: {
    allowed: "'vitest'",
    restricted: ["jest", "@jest/globals", "bun:test", "node:test"],
  },
} as const;

/**
 * Generates the error message for restricted imports.
 *
 * @param allowedFramework - The allowed framework(s) for imports
 * @returns The formatted error message
 */
const getRestrictionMessage = (allowedFramework: string): string =>
  `This project is setup to use ${allowedFramework} for testing. Importing from other testing frameworks is not allowed. Change this setting in eslint.config.js under testing.framework`;

/**
 * Returns import restriction rules based on the testing framework.
 * Prevents importing from the wrong testing framework.
 *
 * @param framework - The testing framework being used
 * @returns ESLint rules object with import restrictions
 */
export const getImportRestrictions = (
  framework: "bun" | "jest" | "node" | "vitest",
): Record<string, EslintRuleConfig> => {
  const config = frameworkConfig[framework];
  const message = getRestrictionMessage(config.allowed);

  return {
    "no-restricted-imports": [
      "warn",
      {
        paths: config.restricted.map((name) => ({
          importNames: commonTestImports,
          message,
          name,
        })),
      },
    ],
  };
};
