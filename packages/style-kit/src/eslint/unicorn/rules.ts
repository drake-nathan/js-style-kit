import type { EslintRuleConfig } from "../types.js";

type UnicornRules = Record<`unicorn/${string}`, EslintRuleConfig>;

export const rules: UnicornRules = {
  /**
   * Enforce better string content.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
   */
  "unicorn/better-regex": "warn",
  /**
   * Enforce passing a message value when creating a built-in error.
   *
   * 🚫 Not fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/error-message.md
   */
  "unicorn/error-message": "warn",
  /**
   * Require consistent filename case for all linted files.
   *
   * 🚫 Not fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
   */
  "unicorn/filename-case": [
    "warn",
    {
      case: "kebabCase",
    },
  ],
  /**
   * Enforce the use of new for all builtins, except String, Number, Boolean, Symbol and BigInt.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/new-for-builtins.md
   */
  "unicorn/new-for-builtins": "warn",
  "unicorn/no-console-spaces": "warn",
  /**
   * Enforce using for-loop instead of while-loop.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-for-loop.md
   */
  "unicorn/no-for-loop": "warn",
  /**
   * Enforce the use of addEventListener and removeEventListener over on-functions.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-add-event-listener.md
   */
  "unicorn/prefer-add-event-listener": "warn",
  /**
   * Require using the `node:` protocol when importing Node.js built-in modules.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
   */
  "unicorn/prefer-node-protocol": "warn",
  /**
   * Prefer String#replaceAll() over String#replace() with a global regExp.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-replace-all.md
   */
  "unicorn/prefer-string-replace-all": "warn",
  /**
   * Enforce throwing TypeError in type checking conditions.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-type-error.md
   */
  "unicorn/prefer-type-error": "warn",
  /**
   * Enforce consistent brace style for case clauses.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/switch-case-braces.md
   */
  "unicorn/switch-case-braces": ["warn", "always"],
  /**
   * Enforce consistent case for text encoding identifiers.
   *
   * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/text-encoding-identifier-case.md
   */
  "unicorn/text-encoding-identifier-case": "warn",
};
