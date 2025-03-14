import type { FunctionStyle } from "../types.js";
import type { BaseRules } from "./types.js";

/**
 * Generates the base set of ESLint rules with configurable function style enforcement.
 *
 * @param functionStyle - Controls how functions should be written. Can be:
 *   - "off": Disables function style enforcement
 *   - "arrow": Enforces arrow function expressions
 *   - "declaration": Enforces function declarations
 *   - "expression": Enforces function expressions
 * @returns An object containing ESLint rule configurations
 */
export const baseEslintRules = (
  functionStyle: "off" | FunctionStyle,
): BaseRules => ({
  /**
   * Require return statements in array methods callbacks.
   *
   * 🚫 Not fixable -https://eslint.org/docs/rules/array-callback-return
   */
  "array-callback-return": [
    "warn",
    { allowImplicit: true, checkForEach: true },
  ],
  /**
   * Treat `var` statements as if they were block scoped.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/block-scoped-var
   */
  "block-scoped-var": "warn",
  /**
   * Require camel case names.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/camelcase
   */
  camelcase: [
    "warn",
    {
      allow: ["^UNSAFE_"],
      ignoreDestructuring: false,
      ignoreImports: true,
      properties: "never",
    },
  ],
  /**
   * Require curly braces for multiline blocks.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/curly
   */
  curly: ["warn", "multi-line"],
  /**
   * Require default clauses in switch statements to be last (if used).
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/default-case-last
   */
  "default-case-last": "warn",
  /**
   * Require triple equals (`===` and `!==`).
   *å
   * 🔧 Fixable - https://eslint.org/docs/rules/eqeqeq
   */
  eqeqeq: "warn",
  "for-direction": "warn",
  /**
   * Require function expressions to have a name.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/func-names
   */
  "func-names": ["warn", "as-needed"],
  "func-style":
    // if arrow function, we use the prefer-arrow-functions plugin
    functionStyle === "off" || functionStyle === "arrow" ?
      "off"
    : ["warn", functionStyle, { allowArrowFunctions: true }],
  /**
   * Require grouped accessor pairs in object literals and classes.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/grouped-accessor-pairs
   */
  "grouped-accessor-pairs": "warn",
  /**
   * Require a capital letter for constructors.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/new-cap
   */
  "new-cap": ["warn", { capIsNew: false }],
  /**
   * Disallow use of `alert()`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-alert
   */
  "no-alert": "warn",
  "no-async-promise-executor": "warn",
  /**
   * Disallow use of bitwise operators.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-bitwise
   */
  "no-bitwise": "warn",
  /**
   * Disallow use of `caller`/`callee`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-caller
   */
  "no-caller": "warn",
  "no-case-declarations": "warn",
  "no-compare-neg-zero": "warn",
  "no-cond-assign": "warn",
  /**
   * Disallow the use of console.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-console
   */
  "no-console": ["warn", { allow: ["info", "warn", "error"] }],
  /**
   * Disallow expressions where the operation doesn't affect the value.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-console
   */
  "no-constant-binary-expression": "warn",
  "no-constant-condition": "warn",
  /**
   * Disallow returning value in constructor.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-constructor-return
   */
  "no-constructor-return": "warn",
  "no-control-regex": "warn",
  "no-debugger": "warn",
  "no-delete-var": "warn",
  "no-dupe-else-if": "warn",
  "no-duplicate-case": "warn",
  /**
   * Disallow using an `else` if the `if` block contains a return.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-else-return
   */
  "no-else-return": "warn",
  "no-empty": "warn",
  "no-empty-character-class": "warn",
  "no-empty-pattern": "warn",
  "no-empty-static-block": "warn",
  /**
   * Disallow `eval()`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-eval
   */
  "no-eval": "warn",
  "no-ex-assign": "warn",
  /**
   * Disallow extending native objects.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-extend-native
   */
  "no-extend-native": "warn",
  /**
   * Disallow unnecessary function binding.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-extra-bind
   */
  "no-extra-bind": "warn",
  "no-extra-boolean-cast": "warn",
  /**
   * Disallow unnecessary labels.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-extra-label
   */
  "no-extra-label": "warn",
  "no-fallthrough": "warn",
  "no-global-assign": "warn",
  /**
   * Make people convert types explicitly e.g. `Boolean(foo)` instead of `!!foo`.
   *
   * 🔧 Partially Fixable - https://eslint.org/docs/rules/no-implicit-coercion
   */
  "no-implicit-coercion": "warn",
  "no-invalid-regexp": "warn",
  "no-irregular-whitespace": "warn",
  /**
   * Disallow usage of `__iterator__` property.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-iterator
   */
  "no-iterator": "warn",
  /**
   * Disallow labels that share a name with a variable.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-label-var
   */
  "no-label-var": "warn",
  /**
   * Disallow use of labels for anything other than loops and switches.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-labels
   */
  "no-labels": ["warn"],
  /**
   * Disallow unnecessary nested blocks.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-lone-blocks
   */
  "no-lone-blocks": "warn",
  /**
   * Disallow if as the only statement in an else block.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-lonely-if
   */
  "no-lonely-if": "warn",
  "no-loss-of-precision": "warn",
  "no-misleading-character-class": "warn",
  /**
   * Disallow use of chained assignment expressions.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-multi-assign
   */
  "no-multi-assign": ["warn"],
  /**
   * Disallow nested ternary expressions.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-nested-ternary
   */
  "no-nested-ternary": "warn",
  /**
   * Disallow `new` for side effects.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-new
   */
  "no-new": "warn",
  /**
   * Disallow function constructors.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-new-func
   */
  "no-new-func": "warn",
  /**
   * Disallow primitive wrapper instances, such as `new String('foo')`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-new-wrappers
   */
  "no-new-wrappers": "warn",
  "no-nonoctal-decimal-escape": "warn",
  "no-octal": "warn",
  /**
   * Disallow use of octal escape sequences in string literals.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-octal-escape
   */
  "no-octal-escape": "warn",
  /**
   * Disallow reassignment of function parameters.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-param-reassign
   */
  "no-param-reassign": "warn",
  /**
   * Disallow returning values from Promise executor functions.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-promise-executor-return
   */
  "no-promise-executor-return": "warn",
  /**
   * Disallow usage of the deprecated `__proto__` property.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-proto
   */
  "no-proto": "warn",
  "no-prototype-builtins": "warn",
  "no-regex-spaces": "warn",
  /**
   * Disallow assignment in `return` statement.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-return-assign
   */
  "no-return-assign": "warn",
  /**
   * Disallow use of `javascript:` urls.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-script-url
   */
  "no-script-url": "warn",
  "no-self-assign": "warn",
  /**
   * Disallow comparisons where both sides are exactly the same.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-self-compare
   */
  "no-self-compare": "warn",
  /**
   * Disallow use of comma operator.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-sequences
   */
  "no-sequences": "warn",
  "no-shadow-restricted-names": "warn",
  "no-sparse-arrays": "warn",
  /**
   * Disallow template literal placeholder syntax in regular strings, as
   * these are likely errors.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-template-curly-in-string
   */
  "no-template-curly-in-string": "warn",
  /**
   * Disallow initializing variables to `undefined`.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-undef-init
   */
  "no-undef-init": "warn",
  "no-unexpected-multiline": "warn",
  /**
   * Disallow ternary operators when simpler alternatives exist.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-unneeded-ternary
   */
  "no-unneeded-ternary": "warn",
  /**
   *  Disallow loops with a body that allows only one iteration.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-unreachable-loop
   */
  "no-unreachable-loop": "warn",
  "no-unsafe-finally": "warn",
  "no-unsafe-optional-chaining": "warn",
  "no-unused-labels": "warn",
  "no-unused-private-class-members": "warn",
  "no-useless-backreference": "warn",
  /**
   * Disallow unnecessary `.call()` and `.apply()`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-useless-call
   */
  "no-useless-call": "warn",
  "no-useless-catch": "warn",
  /**
   * Disallow useless computed property keys.
   *
   * � Fixable - https://eslint.org/docs/rules/no-useless-computed-key
   */
  "no-useless-computed-key": "warn",
  /**
   * Disallow unnecessary concatenation of strings.
   *
   * � Not fixable - https://eslint.org/docs/rules/no-useless-concat
   */
  "no-useless-concat": "warn",
  "no-useless-escape": "warn",
  /**
   * Disallow renaming import, export, and destructured assignments to the
   * same name.
   *
   * � Fixable - https://eslint.org/docs/rules/no-useless-rename
   */
  "no-useless-rename": "warn",
  /**
   * Disallow redundant return statements.
   *
   * � Fixable - https://eslint.org/docs/rules/no-useless-return
   */
  "no-useless-return": "warn",
  /**
   * Require `let` or `const` instead of `var`.
   * ts transpiles let/const to var, so no need for vars any more
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-var
   */
  "no-var": "warn",
  "no-with": "warn",
  /**
   * Require object literal shorthand syntax.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/object-shorthand
   */
  "object-shorthand": "warn",
  /**
   * Require default to `const` instead of `let`.
   * ts provides better types with const
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/prefer-const
   */
  "prefer-const": "warn",
  /**
   * Require using named capture groups in regular expressions.
   *
   * � Not fixable - https://eslint.org/docs/rules/prefer-named-capture-group
   */
  "prefer-named-capture-group": "warn",
  /**
   * Disallow parseInt() in favor of binary, octal, and hexadecimal literals.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/prefer-numeric-literals
   */
  "prefer-numeric-literals": "warn",
  /**
   * Require use of an object spread over Object.assign.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/prefer-object-spread
   */
  "prefer-object-spread": "warn",
  /**
   * Disallow use of the RegExp constructor in favor of regular expression
   * literals.
   *
   * � Not fixable - https://eslint.org/docs/rules/prefer-regex-literals
   */
  "prefer-regex-literals": "warn",
  /**
   * Require using rest parameters instead of `arguments`.
   * ts provides better types with rest args over arguments
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/prefer-rest-params
   */
  "prefer-rest-params": "warn",
  /**
   * Require using spread syntax instead of `.apply()`.
   * ts transpiles spread to apply, so no need for manual apply
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/prefer-spread
   */
  "prefer-spread": "warn",
  /**
   * Require using template literals instead of string concatenation.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/prefer-template
   */
  "prefer-template": "warn",
  "require-yield": "warn",
  /**
   * Require a `Symbol` description.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/symbol-description
   */
  "symbol-description": "warn",
  "use-isnan": "warn",
  "valid-typeof": "warn",
  /**
   * Disallow "Yoda conditions", ensuring the comparison.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/yoda
   */
  yoda: "warn",
});
