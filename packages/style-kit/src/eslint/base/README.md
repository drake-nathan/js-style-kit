# Base ESLint Configuration

The base configuration includes core ESLint rules that apply to all JavaScript and TypeScript projects. These rules are carefully selected from ESLint's recommended set with additional best practices.

[← Back to main README](../../README.md)

## Overview

This configuration is always enabled and provides:
- Modern JavaScript best practices
- Error prevention
- Code quality improvements
- Function style enforcement

All rules are configured as **warnings** (not errors) to distinguish them from TypeScript errors in your IDE.

## Function Style

Control how functions should be written throughout your codebase:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  functionStyle: "arrow", // Default
});
```

### Options

#### `"arrow"` (default)
Enforces arrow function expressions:
```js
// ✅ Good
const add = (a, b) => a + b;
const greet = () => console.log("Hello");

// ❌ Bad
function add(a, b) { return a + b; }
```

#### `"declaration"`
Enforces function declarations:
```js
// ✅ Good
function add(a, b) { return a + b; }

// ❌ Bad
const add = (a, b) => a + b;
```

#### `"expression"`
Enforces function expressions:
```js
// ✅ Good
const add = function(a, b) { return a + b; };

// ❌ Bad
function add(a, b) { return a + b; }
const add = (a, b) => a + b;
```

#### `"off"`
Disables function style enforcement - use any style you prefer.

## Key Rules

### Type Safety
- **`eqeqeq`** - Require `===` and `!==` instead of `==` and `!=`
- **`valid-typeof`** - Enforce comparing typeof expressions to valid strings
- **`use-isnan`** - Require `isNaN()` when checking for NaN

### Modern JavaScript
- **`no-var`** - Require `let` or `const` instead of `var`
- **`prefer-const`** - Prefer `const` over `let` when variables are never reassigned
- **`prefer-arrow-callback`** - Prefer arrow functions as callbacks (when `functionStyle: "arrow"`)
- **`prefer-template`** - Prefer template literals over string concatenation
- **`prefer-spread`** - Prefer spread operator over `.apply()`
- **`prefer-rest-params`** - Prefer rest parameters over `arguments`
- **`object-shorthand`** - Require object literal shorthand syntax

### Error Prevention
- **`no-console`** - Disallow `console` except `console.info/warn/error`
- **`no-debugger`** - Disallow `debugger` statements
- **`no-alert`** - Disallow `alert`, `confirm`, and `prompt`
- **`no-eval`** - Disallow `eval()`
- **`no-implied-eval`** - Disallow implied `eval()` via `setTimeout`/`setInterval`
- **`no-new-func`** - Disallow `Function` constructor
- **`no-param-reassign`** - Disallow reassigning function parameters
- **`array-callback-return`** - Require `return` statements in array method callbacks

### Code Quality
- **`curly`** - Require curly braces for multiline blocks
- **`no-else-return`** - Disallow `else` after `return` in `if`
- **`no-lonely-if`** - Disallow `if` as the only statement in `else`
- **`no-unneeded-ternary`** - Disallow ternary operators when simpler alternatives exist
- **`no-useless-return`** - Disallow redundant `return` statements
- **`no-implicit-coercion`** - Disallow type conversion with shorter notations (prefer explicit conversion)

### Naming Conventions
- **`camelcase`** - Enforce camelCase naming (with exceptions for `UNSAFE_` React lifecycle methods)
- **`new-cap`** - Require constructor names to begin with a capital letter
- **`func-names`** - Require named function expressions

### Dangerous Patterns
- **`no-extend-native`** - Disallow extending native objects
- **`no-proto`** - Disallow `__proto__` property
- **`no-iterator`** - Disallow `__iterator__` property
- **`no-new-wrappers`** - Disallow `new` for `String`, `Number`, and `Boolean`
- **`no-bitwise`** - Disallow bitwise operators

## TypeScript Integration

When TypeScript is enabled, certain rules are automatically disabled to avoid conflicts with TypeScript's own checks:

- `no-unused-vars` - Handled by `@typescript-eslint/no-unused-vars`
- `no-unused-expressions` - Handled by `@typescript-eslint/no-unused-expressions`

## Fixable Rules

Many rules in this config are auto-fixable with `eslint --fix`:

- ✅ `prefer-const` - Auto-converts `let` to `const`
- ✅ `prefer-template` - Auto-converts string concatenation to template literals
- ✅ `object-shorthand` - Auto-converts to shorthand syntax
- ✅ `no-useless-rename` - Auto-removes useless renaming
- ✅ `no-var` - Auto-converts `var` to `let`/`const`
- ✅ And many more!

Run `eslint . --fix` to automatically fix these issues.

## Customization

Override specific base rules using the `rules` option:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  rules: {
    // Allow console.log in development
    "no-console": "off",

    // Make camelcase an error instead of warning
    "camelcase": "error",

    // Allow bitwise operators
    "no-bitwise": "off",
  },
});
```

## Related Configurations

- [TypeScript](../typescript/README.md) - TypeScript-specific rules
- [Import Plugin](../import/README.md) - Import/export validation
- [Unicorn](../unicorn/README.md) - Additional best practices

## Learn More

- [ESLint Rules Documentation](https://eslint.org/docs/latest/rules/)
- [Main README](../../README.md)
