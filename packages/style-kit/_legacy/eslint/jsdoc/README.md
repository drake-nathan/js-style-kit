# JSDoc Configuration

JSDoc comment validation and formatting for better code documentation.

[← Back to main README](../../../README.md)

## Overview

JSDoc configuration is **disabled by default** and provides:

- JSDoc comment validation
- Type and tag checking
- Parameter and return value documentation
- Formatting and style consistency
- TypeScript-aware (disables redundant type rules)

This plugin can be handy for libraries, but it can get annoying, so it's not for everyone. [See my configuration](./rules.ts), and feel free to customize via the `rules` option.

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  jsdoc: true, // Enable JSDoc validation
});
```

## Configuration Options

### Basic Enable

```js
jsdoc: true, // Validation without requiring JSDoc on all functions
```

### Require JSDoc

```js
jsdoc: {
  requireJsdoc: true, // Enforce JSDoc on functions and classes
}
```

## File Scope

JSDoc rules apply to:

- ✅ All `.js`, `.jsx`, `.ts`, `.tsx`, `.cjs`, `.mjs` files
- ❌ Excluded from `.test` and `.spec` files

## Validation Without Enforcement

By default (`requireJsdoc: false`), JSDoc comments are **validated but not required**:

```ts
// ✅ Good - no JSDoc required, but valid if present
export const add = (a: number, b: number) => a + b;

// ✅ Good - JSDoc is validated when present
/**
 * Adds two numbers together.
 *
 * @param a - First number
 * @param b - Second number
 * @returns Sum of the two numbers
 */
export const add = (a: number, b: number) => a + b;

// ❌ Bad - invalid JSDoc syntax
/**
 * @param c - Wrong parameter name
 */
export const add = (a: number, b: number) => a + b;
```

**Active rules:**

- ✅ Validates JSDoc syntax and formatting
- ✅ Checks parameter names match function signature
- ✅ Verifies tag names are valid
- ❌ Does NOT require JSDoc on all functions

## Require JSDoc Mode

When `requireJsdoc: true`, documentation becomes mandatory:

```ts
// ❌ Bad - missing JSDoc
export const add = (a: number, b: number) => a + b;

// ✅ Good - complete JSDoc
/**
 * Adds two numbers together.
 *
 * @param a - First number
 * @param b - Second number
 * @returns Sum of the two numbers
 */
export const add = (a: number, b: number) => a + b;
```

**Requires JSDoc on:**

- Function declarations
- Function expressions
- Arrow functions
- Class declarations
- Class expressions
- Method definitions

## TypeScript Integration

When using TypeScript, JSDoc rules automatically adjust:

```ts
// ✅ Good - TypeScript handles types
/**
 * Calculates the total price with tax.
 *
 * @param price - Base price
 * @param taxRate - Tax rate as decimal
 * @returns Total price including tax
 */
export const calculateTotal = (price: number, taxRate: number): number => {
  return price * (1 + taxRate);
};

// ❌ Bad - redundant type in JSDoc (TypeScript projects)
/**
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate
 * @returns {number} Total
 */
export const calculateTotal = (price: number, taxRate: number): number => {
  return price * (1 + taxRate);
};
```

**TypeScript-specific behavior:**

- `jsdoc/no-types` is enabled (prevents redundant `{type}` annotations)
- `jsdoc/no-undefined-types` is disabled (TypeScript validates types)
- Type information comes from TypeScript, not JSDoc

## Key Rules

### Syntax Validation

- **`jsdoc/check-alignment`** - Enforces proper JSDoc alignment
- **`jsdoc/check-tag-names`** - Validates tag names are recognized
- **`jsdoc/check-types`** - Validates JSDoc types (non-TypeScript)
- **`jsdoc/valid-types`** - Ensures type syntax is valid
- **`jsdoc/empty-tags`** - Validates tags that shouldn't have content

### Parameter Documentation

- **`jsdoc/check-param-names`** - Parameter names match function signature
- **`jsdoc/require-param`** - Requires `@param` tags (when `requireJsdoc: true`)
- **`jsdoc/require-param-name`** - Ensures `@param` has parameter name
- **`jsdoc/require-param-description`** - Requires parameter descriptions

### Return Documentation

- **`jsdoc/require-returns`** - Requires `@returns` tag (when `requireJsdoc: true`)
- **`jsdoc/require-returns-check`** - Validates `@returns` matches return statement
- **`jsdoc/require-returns-description`** - Requires return value description

### Formatting

- **`jsdoc/multiline-blocks`** - Enforces multiline JSDoc format
- **`jsdoc/no-multi-asterisks`** - Prevents extra asterisks
- **`jsdoc/require-asterisk-prefix`** - Requires asterisk on each line
- **`jsdoc/tag-lines`** - Controls spacing between tags

### Other Rules

- **`jsdoc/check-access`** - Validates `@private`, `@public`, etc.
- **`jsdoc/check-property-names`** - Validates `@property` tag names
- **`jsdoc/implements-on-classes`** - Ensures `@implements` on classes only
- **`jsdoc/no-defaults`** - Prevents documenting default values

## Examples

### Function Documentation

```ts
/**
 * Fetches user data from the API.
 *
 * @param userId - The unique identifier for the user
 * @returns Promise resolving to user data
 * @throws {Error} When the user is not found
 */
export const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error("User not found");
  return response.json();
};
```

### Class Documentation

```ts
/**
 * Manages user authentication and sessions.
 */
export class AuthService {
  /**
   * Authenticates a user with credentials.
   *
   * @param username - User's username
   * @param password - User's password
   * @returns Authentication token
   */
  login(username: string, password: string): string {
    // Implementation
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    // Implementation
  }
}
```

### Interface Documentation

```ts
/**
 * Represents a user in the system.
 */
interface User {
  /** Unique user identifier */
  id: string;

  /** User's display name */
  name: string;

  /** User's email address */
  email: string;
}
```

### Destructured Parameters

```ts
/**
 * Creates a new user account.
 *
 * @param options - User creation options
 * @param options.name - User's name
 * @param options.email - User's email
 * @param options.role - User's role in the system
 * @returns Created user object
 */
export const createUser = ({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}): User => {
  // Implementation
};
```

### Async Functions

```ts
/**
 * Processes payment for an order.
 *
 * @param orderId - Order identifier
 * @param amount - Payment amount
 * @returns Promise resolving to payment confirmation
 * @throws {PaymentError} When payment processing fails
 */
export const processPayment = async (
  orderId: string,
  amount: number,
): Promise<PaymentConfirmation> => {
  // Implementation
};
```

## Tag Formatting

JSDoc enforces consistent tag spacing:

```ts
// ✅ Good - proper tag formatting
/**
 * Description here.
 *
 * @param name - Parameter description
 * @param age - Parameter description
 * @returns Return description
 */

// ❌ Bad - extra lines between tags
/**
 * Description here.
 *
 * @param name - Parameter description
 *
 * @param age - Parameter description
 *
 * @returns Return description
 */
```

**Rules:**

- One blank line between description and first tag
- No blank lines between `@param` tags
- Consistent formatting throughout

## Customization

### Require JSDoc on Exports Only

```js
export default eslintConfig({
  jsdoc: { requireJsdoc: true },
  rules: {
    "jsdoc/require-jsdoc": [
      "warn",
      {
        require: {
          FunctionDeclaration: true,
          // Only require JSDoc on exported functions
          publicOnly: true,
        },
      },
    ],
  },
});
```

### Allow JSDoc Types in TypeScript

```js
export default eslintConfig({
  jsdoc: true,
  rules: {
    // Allow {type} annotations even in TypeScript
    "jsdoc/no-types": "off",
  },
});
```

### Disable Description Requirements

```js
export default eslintConfig({
  jsdoc: true,
  rules: {
    "jsdoc/require-param-description": "off",
    "jsdoc/require-returns-description": "off",
  },
});
```

## Common Patterns

### Library Development

```js
export default eslintConfig({
  typescript: true,
  jsdoc: { requireJsdoc: true }, // Require docs for public API
});
```

### Application Development

```js
export default eslintConfig({
  typescript: true,
  jsdoc: true, // Validate JSDoc but don't require it
});
```

## Related Configurations

- [TypeScript](../typescript/README.md) - TypeScript type checking
- [Base](../base/README.md) - Base ESLint rules

## Learn More

- [eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)
- [JSDoc Official](https://jsdoc.app/)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Main README](../../../README.md)
