import type { FilenameCase, RulesRecord } from "../../types.js";

/**
 * Native `unicorn` plugin rules.
 *
 * Rules from the legacy config with no oxlint equivalent (intentionally
 * dropped): `unicorn/better-regex`, `unicorn/no-for-loop`.
 */
export const buildUnicornRules = (
  filenameCase: FilenameCase = "kebabCase",
): RulesRecord => ({
  "unicorn/error-message": "warn",
  "unicorn/filename-case": ["warn", { case: filenameCase }],
  "unicorn/new-for-builtins": "warn",
  "unicorn/no-console-spaces": "warn",
  "unicorn/prefer-add-event-listener": "warn",
  "unicorn/prefer-node-protocol": "warn",
  "unicorn/prefer-string-replace-all": "warn",
  "unicorn/prefer-type-error": "warn",
  "unicorn/switch-case-braces": ["warn", "always"],
  "unicorn/text-encoding-identifier-case": "warn",
});
