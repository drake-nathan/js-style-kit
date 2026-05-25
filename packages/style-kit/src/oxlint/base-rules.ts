import type { FunctionStyle, RulesRecord } from "../types.js";

/**
 * Base ESLint correctness rules, ported from the legacy `baseEslintRules`.
 *
 * Rules from the legacy config that have no oxlint equivalent (and are
 * intentionally dropped) include: `camelcase`, `no-octal`, `no-octal-escape`,
 * `no-undef-init`, `no-unreachable-loop`, `prefer-named-capture-group`, `yoda`.
 *
 * TypeScript-aware rule swaps (the old config disabled
 * `no-unused-vars` / `no-unused-expressions` when TS was on so the TS-specific
 * versions could take over) are handled in T06 via the typescript plugin.
 */
export const buildBaseRules = (
  functionStyle: FunctionStyle,
  typescript: boolean,
): RulesRecord => {
  const rules: RulesRecord = {
    "array-callback-return": [
      "warn",
      { allowImplicit: true, checkForEach: true },
    ],
    "block-scoped-var": "warn",
    curly: ["warn", "multi-line"],
    "default-case-last": "warn",
    eqeqeq: "warn",
    "for-direction": "warn",
    "func-names": ["warn", "as-needed"],
    "grouped-accessor-pairs": "warn",
    "new-cap": ["warn", { capIsNew: false }],
    "no-alert": "warn",
    "no-async-promise-executor": "warn",
    "no-bitwise": "warn",
    "no-caller": "warn",
    "no-case-declarations": "warn",
    "no-compare-neg-zero": "warn",
    "no-cond-assign": "warn",
    "no-console": ["warn", { allow: ["info", "warn", "error"] }],
    "no-constant-binary-expression": "warn",
    "no-constant-condition": "warn",
    "no-constructor-return": "warn",
    "no-control-regex": "warn",
    "no-debugger": "warn",
    "no-delete-var": "warn",
    "no-dupe-else-if": "warn",
    "no-duplicate-case": "warn",
    "no-else-return": "warn",
    "no-empty": "warn",
    "no-empty-character-class": "warn",
    "no-empty-pattern": "warn",
    "no-empty-static-block": "warn",
    "no-eval": "warn",
    "no-ex-assign": "warn",
    "no-extend-native": "warn",
    "no-extra-bind": "warn",
    "no-extra-boolean-cast": "warn",
    "no-extra-label": "warn",
    "no-fallthrough": "warn",
    "no-global-assign": "warn",
    "no-implicit-coercion": "warn",
    "no-invalid-regexp": "warn",
    "no-irregular-whitespace": "warn",
    "no-iterator": "warn",
    "no-label-var": "warn",
    "no-labels": ["warn"],
    "no-lone-blocks": "warn",
    "no-lonely-if": "warn",
    "no-loss-of-precision": "warn",
    "no-misleading-character-class": "warn",
    "no-multi-assign": ["warn"],
    "no-new": "warn",
    "no-new-func": "warn",
    "no-new-wrappers": "warn",
    "no-nonoctal-decimal-escape": "warn",
    "no-param-reassign": "warn",
    "no-promise-executor-return": "warn",
    "no-proto": "warn",
    "no-prototype-builtins": "warn",
    "no-regex-spaces": "warn",
    "no-return-assign": "warn",
    "no-script-url": "warn",
    "no-self-assign": "warn",
    "no-self-compare": "warn",
    "no-sequences": "warn",
    "no-shadow-restricted-names": "warn",
    "no-sparse-arrays": "warn",
    "no-template-curly-in-string": "warn",
    "no-unexpected-multiline": "warn",
    "no-unneeded-ternary": "warn",
    "no-unsafe-finally": "warn",
    "no-unsafe-optional-chaining": "warn",
    "no-unused-labels": "warn",
    "no-unused-private-class-members": "warn",
    "no-useless-backreference": "warn",
    "no-useless-call": "warn",
    "no-useless-catch": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-escape": "warn",
    "no-useless-rename": "warn",
    "no-useless-return": "warn",
    "no-var": "warn",
    "no-with": "warn",
    "object-shorthand": "warn",
    "prefer-const": "warn",
    "prefer-numeric-literals": "warn",
    "prefer-object-spread": "warn",
    "prefer-regex-literals": "warn",
    "prefer-rest-params": "warn",
    "prefer-spread": "warn",
    "prefer-template": "warn",
    "require-yield": "warn",
    "symbol-description": "warn",
    "use-isnan": "warn",
    "valid-typeof": "warn",
  };

  if (!typescript) {
    rules["no-unused-expressions"] = "warn";
    rules["no-unused-vars"] = "warn";
  }

  // func-style:
  //   - "arrow": handled by eslint-plugin-prefer-arrow-functions (T08); keep off here.
  //   - "off":   off.
  //   - "declaration" | "expression": built-in func-style rule.
  if (functionStyle === "declaration" || functionStyle === "expression") {
    rules["func-style"] = ["warn", functionStyle, { allowArrowFunctions: true }];
  }

  return rules;
};
