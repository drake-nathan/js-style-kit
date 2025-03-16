import type { EslintRuleConfig } from "../types.js";

type VitestRules = Record<`vitest/${string}`, EslintRuleConfig>;

/**
 * Creates an object containing the ESLint rules for vitest.
 *
 * @param itOrTest - "it" or "test"
 * @returns An object containing the ESLint rules for vitest.
 */
export const vitestRules = (itOrTest: "it" | "test" = "test"): VitestRules => ({
  "vitest/consistent-test-it": [
    "warn",
    { fn: itOrTest, withinDescribe: itOrTest },
  ],
  "vitest/expect-expect": "warn",
  "vitest/no-commented-out-tests": "warn",
  "vitest/no-conditional-in-test": "warn",
  "vitest/no-disabled-tests": "warn",
  "vitest/no-duplicate-hooks": "warn",
  "vitest/no-focused-tests": "warn",
  "vitest/no-identical-title": "warn",
  "vitest/no-import-node-test": "warn",
  "vitest/no-interpolation-in-snapshots": "warn", // Avoid dynamic snapshots
  "vitest/no-large-snapshots": ["warn", { inlineMaxSize: 50, maxSize: 100 }], // Keep snapshots manageable
  "vitest/no-standalone-expect": "warn",
  "vitest/no-test-return-statement": "warn", // Tests shouldn't return values
  "vitest/prefer-comparison-matcher": "warn", // Use comparison matchers
  "vitest/prefer-equality-matcher": "warn", // Use equality matchers
  "vitest/prefer-hooks-in-order": "warn", // Keep hooks in a predictable order
  "vitest/prefer-hooks-on-top": "warn", // Keep hooks organized
  "vitest/prefer-lowercase-title": ["warn", { ignoreTopLevelDescribe: true }], // Consistent casing
  "vitest/prefer-strict-equal": "warn", // Prefer .toStrictEqual() over .toEqual()
  "vitest/prefer-to-be": "warn", // Use .toBe() for primitives
  "vitest/prefer-to-contain": "warn", // Use .toContain() for array/string includes
  "vitest/prefer-to-have-length": "warn", // Use .toHaveLength() for checking length
  "vitest/require-local-test-context-for-concurrent-snapshots": "warn",
  "vitest/require-top-level-describe": "warn", // Group tests in describe blocks
  "vitest/valid-describe-callback": "warn",
  "vitest/valid-expect": "warn",
  "vitest/valid-title": "warn",
});
