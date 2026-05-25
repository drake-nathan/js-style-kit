import type { RulesRecord } from "../../types.js";

/**
 * Native `jsdoc` plugin rules.
 *
 * Significant coverage hit vs the legacy config: oxlint's jsdoc plugin
 * is a much smaller subset of `eslint-plugin-jsdoc`. Rules from the
 * legacy config with no oxlint equivalent (intentionally dropped):
 * `check-alignment`, `check-param-names`, `check-types`, `check-values`,
 * `multiline-blocks`, `no-blank-block-descriptions`, `no-multi-asterisks`,
 * `no-types`, `no-undefined-types`, `require-asterisk-prefix`,
 * `require-description`, `require-jsdoc`, `require-returns-check`,
 * `require-yields-check`, `tag-lines`, `text-escaping`, `valid-types`.
 *
 * Several of these are now provided by oxfmt's `jsdoc` formatter pass
 * instead — see {@link OxfmtOptions.jsdoc}.
 */
export const buildJsdocRules = (requireJsdoc: boolean): RulesRecord => ({
  "jsdoc/check-access": "warn",
  "jsdoc/check-property-names": "warn",
  "jsdoc/check-tag-names": ["warn", { typed: true }],
  "jsdoc/empty-tags": "warn",
  "jsdoc/implements-on-classes": "warn",
  "jsdoc/no-defaults": "warn",
  "jsdoc/require-param": requireJsdoc ? "warn" : "off",
  "jsdoc/require-param-description": "warn",
  "jsdoc/require-param-name": "warn",
  "jsdoc/require-property": requireJsdoc ? "warn" : "off",
  "jsdoc/require-property-description": "warn",
  "jsdoc/require-property-name": "warn",
  "jsdoc/require-returns": requireJsdoc ? "warn" : "off",
  "jsdoc/require-returns-description": "warn",
  "jsdoc/require-yields": "warn",
});
