import type { EslintRuleConfig } from "../types.js";

interface PerfectionistRuleOptions {
  order: "asc" | "desc";
  type: "alphabetical" | "custom" | "line-length" | "natural";
}

const defaultOptions: PerfectionistRuleOptions = {
  order: "asc",
  type: "natural",
};

type PerfectionRules = Record<
  `perfectionist/${string}`,
  EslintRuleConfig<PerfectionistRuleOptions>
>;

export const perfectionistRules: PerfectionRules = {
  "perfectionist/sort-array-includes": ["warn", defaultOptions],
  "perfectionist/sort-classes": ["warn", defaultOptions],
  "perfectionist/sort-decorators": ["warn", defaultOptions],
  "perfectionist/sort-enums": ["warn", defaultOptions],
  "perfectionist/sort-exports": ["warn", defaultOptions],
  "perfectionist/sort-heritage-clauses": ["warn", defaultOptions],
  "perfectionist/sort-imports": ["warn", defaultOptions],
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
};
