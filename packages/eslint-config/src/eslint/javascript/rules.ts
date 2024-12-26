import type { Linter } from "eslint";

export const javascriptEslintRules = {
  /**
   * Require return statements in array methods callbacks.
   *
   * 🚫 Not fixable -https://eslint.org/docs/rules/array-callback-return
   */
  "array-callback-return": [
    "error",
    { allowImplicit: true, checkForEach: true },
  ],
  /**
   * Treat `var` statements as if they were block scoped.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/block-scoped-var
   */
  "block-scoped-var": "error",
  /**
   * Require camel case names.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/camelcase
   */
  camelcase: [
    "error",
    { allow: ["^UNSAFE_"], ignoreDestructuring: false, properties: "never" },
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
  "default-case-last": "error",
  /**
   * Require triple equals (`===` and `!==`).
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/eqeqeq
   */
  eqeqeq: "error",
  "for-direction": "error",
  /**
   * Require function expressions to have a name.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/func-names
   */
  "func-names": ["error", "as-needed"],
  /**
   * Require grouped accessor pairs in object literals and classes.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/grouped-accessor-pairs
   */
  "grouped-accessor-pairs": "error",
  /**
   * Require a capital letter for constructors.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/new-cap
   */
  "new-cap": ["error", { capIsNew: false }],
  /**
   * Disallow use of `alert()`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-alert
   */
  "no-alert": "error",
  "no-async-promise-executor": "error",
  /**
   * Disallow use of bitwise operators.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-bitwise
   */
  "no-bitwise": "error",
  /**
   * Disallow use of `caller`/`callee`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-caller
   */
  "no-caller": "error",
  "no-case-declarations": "error",
  "no-compare-neg-zero": "error",
  "no-cond-assign": "error",
  /**
   * Disallow the use of console.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-console
   */
  "no-console": ["error", { allow: ["info", "warn", "error"] }],
  /**
   * Disallow expressions where the operation doesn't affect the value.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-console
   */
  "no-constant-binary-expression": "error",
  "no-constant-condition": "error",
  /**
   * Disallow returning value in constructor.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-constructor-return
   */
  "no-constructor-return": "error",
  "no-control-regex": "error",
  "no-debugger": "error",
  "no-delete-var": "error",
  "no-dupe-else-if": "error",
  "no-duplicate-case": "error",
  /**
   * Disallow using an `else` if the `if` block contains a return.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-else-return
   */
  "no-else-return": "warn",
  "no-empty": "error",
  "no-empty-character-class": "error",
  "no-empty-pattern": "error",
  "no-empty-static-block": "error",
  /**
   * Disallow `eval()`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-eval
   */
  "no-eval": "error",
  "no-ex-assign": "error",
  /**
   * Disallow extending native objects.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-extend-native
   */
  "no-extend-native": "error",
  /**
   * Disallow unnecessary function binding.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-extra-bind
   */
  "no-extra-bind": "error",
  "no-extra-boolean-cast": "error",
  /**
   * Disallow unnecessary labels.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-extra-label
   */
  "no-extra-label": "error",
  "no-fallthrough": "error",
  "no-global-assign": "error",
  /**
   * Make people convert types explicitly e.g. `Boolean(foo)` instead of `!!foo`.
   *
   * 🔧 Partially Fixable - https://eslint.org/docs/rules/no-implicit-coercion
   */
  "no-implicit-coercion": "error",
  "no-invalid-regexp": "error",
  "no-irregular-whitespace": "error",
  /**
   * Disallow usage of `__iterator__` property.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-iterator
   */
  "no-iterator": "error",
  /**
   * Disallow labels that share a name with a variable.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-label-var
   */
  "no-label-var": "error",
  /**
   * Disallow use of labels for anything other than loops and switches.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-labels
   */
  "no-labels": ["error"],
  /**
   * Disallow unnecessary nested blocks.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-lone-blocks
   */
  "no-lone-blocks": "error",
  /**
   * Disallow if as the only statement in an else block.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-lonely-if
   */
  "no-lonely-if": "warn",
  "no-loss-of-precision": "error",
  "no-misleading-character-class": "error",
  /**
   * Disallow use of chained assignment expressions.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-multi-assign
   */
  "no-multi-assign": ["error"],
  /**
   * Disallow nested ternary expressions.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-nested-ternary
   */
  "no-nested-ternary": "error",
  /**
   * Disallow `new` for side effects.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-new
   */
  "no-new": "error",
  /**
   * Disallow function constructors.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-new-func
   */
  "no-new-func": "error",
  /**
   * Disallow primitive wrapper instances, such as `new String('foo')`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-new-wrappers
   */
  "no-new-wrappers": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-octal": "error",
  /**
   * Disallow use of octal escape sequences in string literals.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-octal-escape
   */
  "no-octal-escape": "error",
  /**
   * Disallow reassignment of function parameters.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-param-reassign
   */
  "no-param-reassign": "error",
  /**
   * Disallow returning values from Promise executor functions.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-promise-executor-return
   */
  "no-promise-executor-return": "error",
  /**
   * Disallow usage of the deprecated `__proto__` property.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-proto
   */
  "no-proto": "error",
  "no-prototype-builtins": "error",
  "no-regex-spaces": "error",
  /**
   * Disallow assignment in `return` statement.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-return-assign
   */
  "no-return-assign": "error",
  /**
   * Disallow use of `javascript:` urls.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-script-url
   */
  "no-script-url": "error",
  "no-self-assign": "error",
  /**
   * Disallow comparisons where both sides are exactly the same.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-self-compare
   */
  "no-self-compare": "error",
  /**
   * Disallow use of comma operator.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-sequences
   */
  "no-sequences": "error",
  "no-shadow-restricted-names": "error",
  "no-sparse-arrays": "error",
  /**
   * Disallow template literal placeholder syntax in regular strings, as
   * these are likely errors.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-template-curly-in-string
   */
  "no-template-curly-in-string": "error",
  /**
   * Disallow initializing variables to `undefined`.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/no-undef-init
   */
  "no-undef-init": "warn",
  "no-unexpected-multiline": "error",
  /**
   * Disallow ternary operators when simpler alternatives exist.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-unneeded-ternary
   */
  "no-unneeded-ternary": "error",
  /**
   *  Disallow loops with a body that allows only one iteration.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-unreachable-loop
   */
  "no-unreachable-loop": "error",
  "no-unsafe-finally": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unused-labels": "error",
  "no-unused-private-class-members": "error",
  "no-useless-backreference": "error",
  /**
   * Disallow unnecessary `.call()` and `.apply()`.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/no-useless-call
   */
  "no-useless-call": "error",
  "no-useless-catch": "error",
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
  "no-useless-concat": "error",
  "no-useless-escape": "error",
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
  "no-var": "error",
  "no-with": "error",
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
  "prefer-named-capture-group": "error",
  /**
   * Disallow parseInt() in favor of binary, octal, and hexadecimal literals.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/prefer-numeric-literals
   */
  "prefer-numeric-literals": "error",
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
  "prefer-regex-literals": "error",
  /**
   * Require using rest parameters instead of `arguments`.
   * ts provides better types with rest args over arguments
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/prefer-rest-params
   */
  "prefer-rest-params": "error",
  /**
   * Require using spread syntax instead of `.apply()`.
   * ts transpiles spread to apply, so no need for manual apply
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/prefer-spread
   */
  "prefer-spread": "error",
  /**
   * Require using template literals instead of string concatenation.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/prefer-template
   */
  "prefer-template": "warn",
  "require-yield": "error",
  /**
   * Require a `Symbol` description.
   *
   * 🚫 Not fixable - https://eslint.org/docs/rules/symbol-description
   */
  "symbol-description": "error",
  "use-isnan": "error",
  "valid-typeof": "error",
  /**
   * Disallow "Yoda conditions", ensuring the comparison.
   *
   * 🔧 Fixable - https://eslint.org/docs/rules/yoda
   */
  yoda: "warn",
} satisfies Linter.RulesRecord;
