# Testing Configuration

Comprehensive testing support with rules for Vitest, Jest, Bun, and Node.js test runners.

[← Back to main README](../../../README.md)

## Overview

Testing support is **disabled by default** and provides:

- Framework-specific test rules (Vitest, Jest, Bun, Node.js)
- Test file naming conventions
- Test style consistency (`it` vs `test`)
- Optional formatting rules for test block padding

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  testing: true, // Enable with defaults (Vitest)
});
```

## Configuration Options

### Basic Enable

```js
testing: true, // Vitest + ".test" files + "test" style + formatting
```

### Framework-Specific

```js
testing: {
  framework: "vitest",         // "vitest" | "jest" | "bun" | "node"
  filenamePattern: "test",     // "test" | "spec"
  itOrTest: "test",            // "test" | "it"
  formattingRules: true,       // Enable padding rules
}
```

### Custom Files

```js
testing: {
  framework: "jest",
  files: ["**/__tests__/**/*.ts", "**/*.test.ts"],
}
```

## Framework Options

### Vitest (Default)

```js
export default eslintConfig({
  testing: { framework: "vitest" },
});
```

**Includes:**

- ✅ Vitest-specific rules and globals
- ✅ Test assertion best practices
- ✅ Hook usage validation

### Jest

```js
export default eslintConfig({
  testing: { framework: "jest" },
});
```

**Includes:**

- ✅ Jest-specific rules and globals
- ✅ All Jest best practices
- ✅ Snapshot testing support

### Bun

```js
export default eslintConfig({
  testing: { framework: "bun" },
});
```

**Includes:**

- ✅ Bun test runner support
- ✅ Uses `bun:test` global package
- ✅ Jest-compatible rules

### Node.js

```js
export default eslintConfig({
  testing: { framework: "node" },
});
```

**Includes:**

- ✅ Node.js native test runner
- ✅ Uses `node:test` global package
- ✅ Jest-compatible rules

## Filename Patterns

Control test file naming conventions:

### .test files (Default)

```js
testing: {
  filenamePattern: "test", // Enforces .test.ts, .test.tsx, etc.
}
```

**Valid:**

- ✅ `user.test.ts`
- ✅ `components/button.test.tsx`
- ❌ `user.spec.ts` (warning)

### .spec files

```js
testing: {
  filenamePattern: "spec", // Enforces .spec.ts, .spec.tsx, etc.
}
```

**Valid:**

- ✅ `user.spec.ts`
- ✅ `components/button.spec.tsx`
- ❌ `user.test.ts` (warning)

## Test Style

Choose between `it` and `test` function names:

### "test" Style (Default)

```js
testing: {
  itOrTest: "test",
}
```

```js
// ✅ Good
test("adds two numbers", () => {
  expect(add(1, 2)).toBe(3);
});

// ❌ Bad
it("adds two numbers", () => {
  expect(add(1, 2)).toBe(3);
});
```

### "it" Style

```js
testing: {
  itOrTest: "it",
}
```

```js
// ✅ Good
it("should add two numbers", () => {
  expect(add(1, 2)).toBe(3);
});

// ❌ Bad
test("should add two numbers", () => {
  expect(add(1, 2)).toBe(3);
});
```

## Formatting Rules

Control padding around test blocks for better readability:

### Enabled (Default)

```js
testing: {
  formattingRules: true,
}
```

```js
// ✅ Good - proper spacing
describe("Calculator", () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  afterEach(() => {
    calculator.reset();
  });

  describe("addition", () => {
    test("adds positive numbers", () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test("adds negative numbers", () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });
  });
});

// ❌ Bad - no spacing
describe("Calculator", () => {
  let calculator;
  beforeEach(() => {
    calculator = new Calculator();
  });
  afterEach(() => {
    calculator.reset();
  });
  describe("addition", () => {
    test("adds positive numbers", () => {
      expect(calculator.add(2, 3)).toBe(5);
    });
    test("adds negative numbers", () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });
  });
});
```

### Disabled

```js
testing: {
  formattingRules: false, // No padding requirements
}
```

## Key Rules

### Test Structure

- **`vitest/consistent-test-filename`** - Enforces consistent file naming
- **`vitest/consistent-test-it`** / **`jest/consistent-test-it`** - Enforces `it` or `test`
- **`vitest/no-identical-title`** / **`jest/no-identical-title`** - Prevents duplicate test names

### Assertions

- **`vitest/expect-expect`** / **`jest/expect-expect`** - Ensures tests have assertions
- **`vitest/no-conditional-expect`** / **`jest/no-conditional-expect`** - No conditional assertions
- **`vitest/valid-expect`** / **`jest/valid-expect`** - Validates expect usage

### Best Practices

- **`vitest/prefer-to-be`** / **`jest/prefer-to-be`** - Use `toBe()` for primitives
- **`vitest/prefer-to-be-truthy`** / **`jest/prefer-to-be-truthy`** - Use `toBeTruthy()`/`toBeFalsy()`
- **`vitest/no-disabled-tests`** / **`jest/no-disabled-tests`** - Warns on `.skip` and `.only`

### TypeScript Integration

When TypeScript is enabled:

- **`@typescript-eslint/unbound-method`** is disabled (conflicts with test mocking)

## Examples

### Vitest + TypeScript

```js
export default eslintConfig({
  typescript: true,
  testing: {
    framework: "vitest",
    filenamePattern: "test",
    itOrTest: "test",
  },
});
```

```ts
// user.test.ts
import { describe, test, expect } from "vitest";
import { createUser } from "./user";

describe("createUser", () => {
  test("creates a user with valid data", () => {
    const user = createUser({ name: "Alice", age: 30 });
    expect(user).toEqual({ name: "Alice", age: 30 });
  });

  test("throws on invalid age", () => {
    expect(() => createUser({ name: "Bob", age: -1 })).toThrow();
  });
});
```

### Jest + Spec Files

```js
export default eslintConfig({
  testing: {
    framework: "jest",
    filenamePattern: "spec",
    itOrTest: "it",
  },
});
```

```ts
// user.spec.ts
describe("User", () => {
  it("should create a user", () => {
    const user = new User("Alice");
    expect(user.name).toBe("Alice");
  });
});
```

### Bun Tests

```js
export default eslintConfig({
  testing: {
    framework: "bun",
  },
});
```

```ts
// math.test.ts
import { test, expect } from "bun:test";

test("adds numbers", () => {
  expect(1 + 2).toBe(3);
});
```

### Node.js Tests

```js
export default eslintConfig({
  testing: {
    framework: "node",
  },
});
```

```ts
// math.test.ts
import { test } from "node:test";
import assert from "node:assert";

test("adds numbers", () => {
  assert.strictEqual(1 + 2, 3);
});
```

## Customization

Override specific testing rules:

```js
export default eslintConfig({
  testing: { framework: "vitest" },
  rules: {
    // Allow .only for debugging
    "vitest/no-disabled-tests": "off",

    // Stricter test naming
    "vitest/consistent-test-filename": "error",

    // Disable padding rules
    "jest/padding-around-test-blocks": "off",
  },
});
```

## Common Patterns

### Monorepo with Multiple Test Runners

```js
export default eslintConfig({
  testing: { framework: "vitest" },
  overrides: [
    {
      files: ["packages/legacy/**/*.test.ts"],
      rules: {
        // Use Jest rules for legacy package
      },
    },
  ],
});
```

### React Component Testing

```js
export default eslintConfig({
  typescript: true,
  react: true,
  testing: {
    framework: "vitest",
    files: ["**/*.test.{ts,tsx}"],
  },
});
```

## Related Configurations

- [TypeScript](../typescript/README.md) - TypeScript configuration
- [React](../react/README.md) - React component testing
- [Base](../base/README.md) - Base ESLint rules

## Learn More

- [Vitest](https://vitest.dev/)
- [Jest](https://jestjs.io/)
- [Bun Test](https://bun.sh/docs/cli/test)
- [Node.js Test Runner](https://nodejs.org/api/test.html)
- [eslint-plugin-vitest](https://github.com/vitest-dev/eslint-plugin-vitest)
- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)
- [Main README](../../../README.md)
