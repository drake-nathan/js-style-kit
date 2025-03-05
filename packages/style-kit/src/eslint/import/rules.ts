import type { EslintRuleConfig } from "../types.js";

type ImportRules = Record<`import/${string}`, EslintRuleConfig>;

/**
 * Creates a configuration object for import ESLint rules.
 *
 * @param typescript - Whether to include TypeScript-specific rules.
 * @returns A configuration object for import ESLint rules.
 */
export const importRules = (typescript: boolean): ImportRules => ({
  // these rules are better handled by typescript
  ...(typescript ?
    {
      "import/default": "warn",
      "import/export": "warn",
      "import/named": "warn",
      "import/namespace": "warn",
      "import/no-unresolved": "warn",
    }
  : {}),
  /**
   * Disallow non-import statements appearing before import statements.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
   */
  "import/first": "warn",
  /**
   * Require a newline after the last import/require.
   *
   * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
   */
  "import/newline-after-import": "warn",
  /**
   * Disallow import of modules using absolute paths.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-absolute-path.md
   */
  "import/no-absolute-path": "warn",
  /**
   * Disallow cyclical dependencies between modules.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
   */
  "import/no-cycle": "warn",
  /**
   * Disallow default exports.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-default-export.md
   */
  "import/no-default-export": "warn",
  "import/no-duplicates": "warn",
  /**
   * Disallow the use of extraneous packages.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
   */
  "import/no-extraneous-dependencies": ["warn", { includeTypes: true }],
  /**
   * Disallow mutable exports.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-mutable-exports.md
   */
  "import/no-mutable-exports": "warn",
  // red flags (thus, warnings)
  "import/no-named-as-default": "warn",
  "import/no-named-as-default-member": "warn",
  /**
   * Disallow importing packages through relative paths.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md
   */
  "import/no-relative-packages": "warn",

  /**
   * Disallow a module from importing itself.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md
   */
  "import/no-self-import": "warn",
  /**
   * Ensures that there are no useless path segments.
   *
   * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md
   */
  "import/no-useless-path-segments": ["warn"],
});
