import type { RulesRecord } from "../../types.js";

/**
 * Native `typescript` plugin rules. Maps the legacy `@typescript-eslint/*`
 * rule names to oxlint's `typescript/*` namespace.
 *
 * Rules from the legacy config with no oxlint equivalent (intentionally
 * dropped): `@typescript-eslint/no-array-constructor`,
 * `@typescript-eslint/no-empty-function`, `@typescript-eslint/no-useless-constructor`
 * (the core `no-useless-constructor` covers it).
 *
 * `@typescript-eslint/no-unused-vars` and `no-unused-expressions` are also
 * dropped here — the oxlint core `no-unused-vars` / `no-unused-expressions`
 * are TypeScript-aware and handle both cases via the regular rule names.
 * The base rule wiring skips them when typescript is on so we can enable
 * them here with the TS-flavored options.
 */
export const buildTypescriptRules = (): RulesRecord => ({
  "no-unused-vars": [
    "warn",
    {
      args: "after-used",
      argsIgnorePattern: "^_",
      ignoreRestSiblings: false,
      vars: "all",
      varsIgnorePattern: "^_",
    },
  ],
  "typescript/adjacent-overload-signatures": "warn",
  "typescript/array-type": "warn",
  "typescript/await-thenable": "warn",
  "typescript/ban-ts-comment": ["warn", { minimumDescriptionLength: 10 }],
  "typescript/ban-tslint-comment": "warn",
  "typescript/class-literal-property-style": "warn",
  "typescript/consistent-generic-constructors": "warn",
  "typescript/consistent-indexed-object-style": "warn",
  "typescript/consistent-type-assertions": "warn",
  "typescript/consistent-type-definitions": "warn",
  "typescript/consistent-type-exports": [
    "warn",
    { fixMixedExportsWithInlineTypeSpecifier: true },
  ],
  "typescript/consistent-type-imports": [
    "warn",
    {
      fixStyle: "inline-type-imports",
      prefer: "type-imports",
    },
  ],
  "typescript/dot-notation": "warn",
  "typescript/no-array-delete": "warn",
  "typescript/no-base-to-string": "warn",
  "typescript/no-confusing-non-null-assertion": "warn",
  "typescript/no-confusing-void-expression": "warn",
  "typescript/no-deprecated": "warn",
  "typescript/no-duplicate-enum-values": "warn",
  "typescript/no-duplicate-type-constituents": "warn",
  "typescript/no-dynamic-delete": "warn",
  "typescript/no-empty-object-type": "warn",
  "typescript/no-explicit-any": "warn",
  "typescript/no-extra-non-null-assertion": "warn",
  "typescript/no-extraneous-class": "warn",
  "typescript/no-floating-promises": "warn",
  "typescript/no-for-in-array": "warn",
  "typescript/no-implied-eval": "warn",
  "typescript/no-import-type-side-effects": "warn",
  "typescript/no-inferrable-types": "warn",
  "typescript/no-invalid-void-type": "warn",
  "typescript/no-meaningless-void-operator": "warn",
  "typescript/no-misused-new": "warn",
  "typescript/no-misused-promises": "warn",
  "typescript/no-mixed-enums": "warn",
  "typescript/no-namespace": "warn",
  "typescript/no-non-null-asserted-nullish-coalescing": "warn",
  "typescript/no-non-null-asserted-optional-chain": "warn",
  "typescript/no-non-null-assertion": "warn",
  "typescript/no-redundant-type-constituents": "warn",
  "typescript/no-require-imports": "warn",
  "typescript/no-this-alias": "warn",
  "typescript/no-unnecessary-boolean-literal-compare": "warn",
  "typescript/no-unnecessary-condition": "warn",
  "typescript/no-unnecessary-template-expression": "warn",
  "typescript/no-unnecessary-type-arguments": "warn",
  "typescript/no-unnecessary-type-assertion": "warn",
  "typescript/no-unnecessary-type-constraint": "warn",
  "typescript/no-unnecessary-type-parameters": "warn",
  "typescript/no-unsafe-declaration-merging": "warn",
  "typescript/no-unsafe-enum-comparison": "warn",
  "typescript/no-unsafe-function-type": "warn",
  "typescript/no-unsafe-unary-minus": "warn",
  "typescript/no-wrapper-object-types": "warn",
  "typescript/non-nullable-type-assertion-style": "off",
  "typescript/only-throw-error": "warn",
  "typescript/prefer-as-const": "warn",
  "typescript/prefer-find": "warn",
  "typescript/prefer-for-of": "warn",
  "typescript/prefer-function-type": "warn",
  "typescript/prefer-includes": "warn",
  "typescript/prefer-literal-enum-member": "warn",
  "typescript/prefer-namespace-keyword": "warn",
  "typescript/prefer-nullish-coalescing": [
    "warn",
    { ignorePrimitives: { string: true } },
  ],
  "typescript/prefer-optional-chain": "warn",
  "typescript/prefer-promise-reject-errors": "warn",
  "typescript/prefer-reduce-type-parameter": "warn",
  "typescript/prefer-regexp-exec": "warn",
  "typescript/prefer-return-this-type": "warn",
  "typescript/prefer-string-starts-ends-with": "warn",
  "typescript/related-getter-setter-pairs": "warn",
  "typescript/require-await": "warn",
  "typescript/restrict-plus-operands": [
    "warn",
    {
      allowAny: false,
      allowBoolean: false,
      allowNullish: false,
      allowNumberAndString: false,
      allowRegExp: false,
    },
  ],
  "typescript/restrict-template-expressions": [
    "warn",
    {
      allow: [{ from: "lib", name: ["Error", "URL", "URLSearchParams"] }],
      allowAny: true,
      allowBoolean: true,
      allowNullish: true,
      allowNumber: true,
      allowRegExp: true,
    },
  ],
  "typescript/return-await": ["warn", "error-handling-correctness-only"],
  "typescript/triple-slash-reference": "warn",
  "typescript/unbound-method": "warn",
  "typescript/unified-signatures": "warn",
  "typescript/use-unknown-in-catch-callback-variable": "warn",
});
