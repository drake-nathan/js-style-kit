import type { RulesRecord } from "../../types.js";

const defaultOptions = {
  order: "asc" as const,
  type: "natural" as const,
};

/**
 * Non-import perfectionist rules. Loaded via the `eslint-plugin-perfectionist`
 * JS plugin (alpha).
 *
 * Import sorting (`perfectionist/sort-imports`) is intentionally NOT included
 * — oxfmt's `sortImports` owns that.
 */
export const buildPerfectionistRules = (): RulesRecord => ({
  "perfectionist/sort-array-includes": ["warn", defaultOptions],
  "perfectionist/sort-classes": ["warn", defaultOptions],
  "perfectionist/sort-decorators": ["warn", defaultOptions],
  "perfectionist/sort-enums": ["warn", defaultOptions],
  "perfectionist/sort-exports": ["warn", defaultOptions],
  "perfectionist/sort-heritage-clauses": ["warn", defaultOptions],
  "perfectionist/sort-interfaces": ["warn", defaultOptions],
  "perfectionist/sort-intersection-types": ["warn", defaultOptions],
  "perfectionist/sort-jsx-props": ["warn", defaultOptions],
  "perfectionist/sort-maps": ["warn", defaultOptions],
  "perfectionist/sort-modules": ["off", defaultOptions],
  "perfectionist/sort-named-exports": ["warn", defaultOptions],
  "perfectionist/sort-named-imports": ["warn", defaultOptions],
  "perfectionist/sort-object-types": ["warn", defaultOptions],
  "perfectionist/sort-objects": ["warn", defaultOptions],
  "perfectionist/sort-sets": ["warn", defaultOptions],
  "perfectionist/sort-switch-case": ["warn", defaultOptions],
  "perfectionist/sort-union-types": ["warn", defaultOptions],
  "perfectionist/sort-variable-declarations": ["warn", defaultOptions],
});
