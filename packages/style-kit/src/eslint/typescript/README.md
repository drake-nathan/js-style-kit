# TypeScript Configuration

Comprehensive TypeScript support with type-aware linting rules from `@typescript-eslint`. The configuration strikes a balance between strict type safety and practical development.

[← Back to main README](../../README.md)

## Overview

TypeScript support is **enabled by default** and provides:

- Type-aware linting rules
- Consistent TypeScript patterns
- Import/export type safety
- Modern TypeScript best practices

## Configuration

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  typescript: true, // Default - automatic project detection
});
```

### Options

#### Automatic Detection (Recommended)

```js
typescript: true; // Automatically finds and uses your tsconfig.json
```

#### Specify Path

```js
typescript: "./tsconfig.eslint.json"; // Use specific tsconfig file
```

#### Disable TypeScript Rules

```js
typescript: false; // Turn off TypeScript linting
```

## How It Works

When TypeScript is enabled:

1. **Automatic project detection** - Finds your `tsconfig.json` automatically
2. **Type-aware linting** - Uses TypeScript's type information for advanced checks
3. **JavaScript compatibility** - Type-checking disabled for `.js` files
4. **Base rule overrides** - Replaces ESLint rules with TypeScript equivalents (e.g., `no-unused-vars` → `@typescript-eslint/no-unused-vars`)

## Key Rule Categories

### Type Safety

**Strict Type Checking**

- `no-explicit-any` - Warn when using `any` type
- `no-unsafe-*` - Prevent unsafe type operations
- `no-unnecessary-type-assertion` - Remove redundant type assertions
- `no-unnecessary-condition` - Detect always-true/false conditions
- `strict-boolean-expressions` - Require boolean types in conditions

**Type Inference**

- `no-inferrable-types` - Remove unnecessary type annotations
- `prefer-as-const` - Use `as const` for literal types
- `consistent-type-definitions` - Prefer `interface` or `type` consistently

### Modern TypeScript

**Import/Export**

- `consistent-type-imports` - Use `import type` for types (inline style)
- `consistent-type-exports` - Use `export type` for types
- `no-import-type-side-effects` - Prevent import type side effects

```ts
// ✅ Good - inline type imports
import { type User, getUser } from "./api";

// ❌ Bad - separate type import
import type { User } from "./api";
import { getUser } from "./api";
```

**Null Safety**

- `prefer-nullish-coalescing` - Use `??` over `||` for null checks
- `prefer-optional-chain` - Use `?.` for safe property access
- `no-non-null-assertion` - Warn on `!` non-null assertions (subjective in favor of casting)

**Modern Syntax**

- `prefer-for-of` - Prefer `for...of` over traditional `for` loops
- `prefer-includes` - Use `.includes()` instead of `.indexOf()`
- `prefer-string-starts-ends-with` - Use `.startsWith()` and `.endsWith()`

### Code Quality

**Error Prevention**

- `no-floating-promises` - Require handling Promise returns
- `await-thenable` - Only await Promise-like values
- `no-misused-promises` - Prevent Promises in wrong contexts
- `only-throw-error` - Only throw Error objects

**Best Practices**

- `no-unused-vars` - Detect unused variables (with `_` prefix exception)
- `no-empty-function` - Warn on empty functions
- `no-useless-constructor` - Remove unnecessary constructors
- `array-type` - Consistent array type syntax (defaults to `string[]` instead of `Array<string>`)

### Documentation

**Comment Quality**

- `ban-ts-comment` - Require explanations for `@ts-ignore` & `@ts-expect-error` (min 10 chars)
- `ban-tslint-comment` - Prevent deprecated TSLint comments

```ts
// ❌ Bad - no explanation
// @ts-ignore
const x = dangerous();

// ✅ Good - explains why
// @ts-expect-error - legacy API doesn't have types
const x = dangerous();
```

## TypeScript + React

When both TypeScript and React are enabled, additional rules apply:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  typescript: "./tsconfig.json",
  react: true,
});
```

React-specific TypeScript rules:

- Type-safe prop definitions
- React hooks type checking
- JSX type safety

[→ See React Configuration](../react/README.md)

## Unused Variables

The `no-unused-vars` rule allows `_` prefix for intentionally unused variables:

```ts
// ✅ Good - underscore prefix indicates intentional
const [_loading, setLoading] = useState(false);
const handler = (_event: Event) => {
  /* ... */
};

// ❌ Bad - unused without underscore
const [loading, setLoading] = useState(false);
```

## Customization

Override specific TypeScript rules:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  typescript: true,
  rules: {
    // Allow any type in certain cases
    "@typescript-eslint/no-explicit-any": "off",

    // Enforce non-null assertions when you know better than TS
    "@typescript-eslint/no-non-null-assertion": "off",

    // Stricter unused vars (no underscore escape hatch)
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
});
```

## Troubleshooting

### ESLint can't find tsconfig.json

Use explicit path:

```js
typescript: "./tsconfig.json";
```

### Type checking is slow

1. Use `tsconfig.eslint.json` with limited `include` paths
2. Exclude test files if not needed for linting

```js
typescript: "./tsconfig.eslint.json";
```

## Related Configurations

- [Base ESLint](../base/README.md) - Core JavaScript rules
- [Import Plugin](../import/README.md) - Import/export validation
- [React](../react/README.md) - React + TypeScript support

## Learn More

- [@typescript-eslint Documentation](https://typescript-eslint.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Main README](../../README.md)
