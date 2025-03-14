import type { EslintRuleConfig } from "../types.js";

type JestRules = Record<`jest/${string}`, EslintRuleConfig>;

/**
 * Creates an object containing the ESLint rules for jest.
 *
 * @param itOrTest - "it" or "test"
 * @returns An object containing the ESLint rules for jest.
 */
export const jestRules = (itOrTest: "it" | "test" = "test"): JestRules => ({
  "jest/consistent-test-it": [
    "warn",
    { fn: itOrTest, withinDescribe: itOrTest },
  ],
  "jest/expect-expect": "warn",
  "jest/no-commented-out-tests": "warn",
  "jest/no-conditional-expect": "warn",
  "jest/no-conditional-in-test": "warn",
  "jest/no-disabled-tests": "warn",
  "jest/no-duplicate-hooks": "warn",
  "jest/no-focused-tests": "warn",
  "jest/no-identical-title": "warn",
  "jest/no-interpolation-in-snapshots": "warn",
  "jest/no-large-snapshots": ["warn", { inlineMaxSize: 50, maxSize: 100 }],
  "jest/no-mocks-import": "warn", // Discourage manually importing from __mocks__
  "jest/no-standalone-expect": "warn",
  "jest/no-test-prefixes": "warn", // Prefer .only and .skip over f and x
  "jest/no-test-return-statement": "warn",
  "jest/prefer-comparison-matcher": "warn",
  "jest/prefer-equality-matcher": "warn",
  "jest/prefer-expect-resolves": "warn",
  "jest/prefer-hooks-in-order": "warn",
  "jest/prefer-hooks-on-top": "warn",
  "jest/prefer-lowercase-title": ["warn", { ignoreTopLevelDescribe: true }],
  "jest/prefer-snapshot-hint": "warn",
  "jest/prefer-spy-on": "warn",
  "jest/prefer-strict-equal": "warn",
  "jest/prefer-to-be": "warn",
  "jest/prefer-to-contain": "warn",
  "jest/prefer-to-have-length": "warn",
  "jest/require-top-level-describe": "warn",
  "jest/valid-describe-callback": "warn",
  "jest/valid-expect": "warn",
  "jest/valid-expect-in-promise": "warn",
  "jest/valid-title": "warn",
});
