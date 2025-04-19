import type { EslintRuleConfig } from "../types.js";

type ImportRules = Record<`import-x/${string}`, EslintRuleConfig>;

/**
 * Creates a configuration object for import ESLint rules.
 *
 * @param typescript - Whether to include TypeScript-specific rules.
 * @returns A configuration object for import ESLint rules.
 */
export const importRules = (typescript: boolean): ImportRules => ({
  // these rules are better handled by typescript
  ...(!typescript ?
    {
      "import-x/default": "warn",
      "import-x/export": "warn",
      "import-x/named": "warn",
      "import-x/namespace": "warn",
      "import-x/no-unresolved": "warn",
    }
  : {}),
  /**
   * Disallow non-import statements appearing before import statements.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/first.md
   */
  "import-x/first": "warn",
  /**
   * Require a newline after the last import-x/require.
   *
   * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/newline-after-import.md
   */
  "import-x/newline-after-import": "warn",
  /**
   * Disallow import of modules using absolute paths.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-absolute-path.md
   */
  "import-x/no-absolute-path": "warn",
  /**
   * Disallow cyclical dependencies between modules.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-cycle.md
   */
  "import-x/no-cycle": "warn",
  "import-x/no-duplicates": "warn",
  /**
   * Disallow the use of extraneous packages.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-extraneous-dependencies.md
   */
  "import-x/no-extraneous-dependencies": ["warn", { includeTypes: true }],
  /**
   * Disallow mutable exports.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-mutable-exports.md
   */
  "import-x/no-mutable-exports": "warn",
  // red flags (thus, warnings)
  "import-x/no-named-as-default": "warn",
  "import-x/no-named-as-default-member": "warn",
  /**
   * Disallow importing packages through relative paths.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-relative-packages.md
   */
  "import-x/no-relative-packages": "warn",

  /**
   * Disallow a module from importing itself.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-self-import.md
   */
  "import-x/no-self-import": "warn",
  /**
   * Ensures that there are no useless path segments.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import-x/blob/main/docs/rules/no-useless-path-segments.md
   */
  "import-x/no-useless-path-segments": ["warn"],
});
