import type {
  RuleOverride,
  RulesRecord,
  TestFramework,
  TestingOptions,
} from "../../types.js";

const buildVitestRules = (itOrTest: "it" | "test"): RulesRecord => ({
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
  "vitest/no-interpolation-in-snapshots": "warn",
  "vitest/no-large-snapshots": ["warn", { inlineMaxSize: 50, maxSize: 100 }],
  "vitest/no-standalone-expect": "warn",
  "vitest/no-test-return-statement": "warn",
  "vitest/prefer-comparison-matcher": "warn",
  "vitest/prefer-equality-matcher": "warn",
  "vitest/prefer-hooks-in-order": "warn",
  "vitest/prefer-hooks-on-top": "warn",
  "vitest/prefer-lowercase-title": ["warn", { ignoreTopLevelDescribe: true }],
  "vitest/prefer-strict-equal": "warn",
  "vitest/prefer-to-be": "warn",
  "vitest/prefer-to-contain": "warn",
  "vitest/prefer-to-have-length": "warn",
  "vitest/require-top-level-describe": "warn",
  "vitest/valid-describe-callback": "warn",
  "vitest/valid-expect": "warn",
  "vitest/valid-title": "warn",
});

const buildJestRules = (itOrTest: "it" | "test"): RulesRecord => ({
  "jest/consistent-test-it": [
    "warn",
    { fn: itOrTest, withinDescribe: itOrTest },
  ],
  "jest/expect-expect": "warn",
  "jest/no-commented-out-tests": "warn",
  "jest/no-conditional-in-test": "warn",
  "jest/no-disabled-tests": "warn",
  "jest/no-duplicate-hooks": "warn",
  "jest/no-focused-tests": "warn",
  "jest/no-identical-title": "warn",
  "jest/no-interpolation-in-snapshots": "warn",
  "jest/no-large-snapshots": "warn",
  "jest/no-standalone-expect": "warn",
  "jest/no-test-return-statement": "warn",
  "jest/prefer-hooks-in-order": "warn",
  "jest/prefer-hooks-on-top": "warn",
  "jest/prefer-lowercase-title": ["warn", { ignoreTopLevelDescribe: true }],
  "jest/prefer-strict-equal": "warn",
  "jest/prefer-to-be": "warn",
  "jest/prefer-to-contain": "warn",
  "jest/prefer-to-have-length": "warn",
  "jest/require-top-level-describe": "warn",
  "jest/valid-describe-callback": "warn",
  "jest/valid-expect": "warn",
  "jest/valid-title": "warn",
});

const buildFormattingRules = (): RulesRecord => ({
  "jest/padding-around-after-all-blocks": "warn",
  "jest/padding-around-test-blocks": "warn",
});

/**
 * Returns the plugin slug (`vitest` or `jest`) to add to oxlint's
 * native `plugins` array, AND the rule-scoped override for test files.
 *
 * `framework: "bun"` and `framework: "node"` produce a `jest` plugin
 * config — both runtimes are jest-compatible at the API level.
 *
 * `importRestrictions` and the legacy filenamePattern (`consistent-test-filename`)
 * rules from the legacy config are intentionally dropped: oxlint's vitest /
 * jest plugins do not expose those rules natively. Add as overrides if needed.
 */
export const buildTestingOverride = (
  opts: TestingOptions,
): { override: RuleOverride; plugin: "jest" | "vitest" } => {
  const {
    files = ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    formattingRules = true,
    framework = "vitest" as TestFramework,
    itOrTest = "it",
  } = opts;

  const useVitest = framework === "vitest";
  const rules: RulesRecord = useVitest
    ? buildVitestRules(itOrTest)
    : buildJestRules(itOrTest);

  if (formattingRules) {
    Object.assign(rules, buildFormattingRules());
  }

  return {
    override: { files, rules },
    plugin: useVitest ? "vitest" : "jest",
  };
};
