# Unicorn Configuration

Modern JavaScript/TypeScript best practices and code quality rules powered by `eslint-plugin-unicorn`.

[← Back to main README](../../../README.md)

## Overview

Unicorn configuration is **enabled by default** and provides:

- File naming conventions (kebab-case)
- Modern JavaScript best practices
- Error handling improvements
- Node.js protocol enforcement
- String and regex optimizations

## Quick Start

The unicorn configuration is automatically enabled when you use `eslintConfig()`:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig(); // Unicorn rules enabled by default with kebab-case filenames
```

### Configure Filename Case

You can customize the filename case convention:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  unicorn: {
    filenameCase: "camelCase", // "camelCase" | "kebabCase" | "pascalCase" | "snakeCase"
  },
});
```

## Key Features

### File Naming

Enforces consistent filename case conventions. By default, kebab-case is used, which promotes consistency and avoids case-sensitivity issues across different operating systems.

**Available Options:**

- `kebabCase` (default) - `user-service.ts`, `api-client.js`
- `camelCase` - `userService.ts`, `apiClient.js`
- `pascalCase` - `UserService.ts`, `ApiClient.js`
- `snakeCase` - `user_service.ts`, `api_client.js`

```
✅ Good filenames:
- user-service.ts
- api-client.js
- button-component.tsx
- use-auth-hook.ts
- format-date.util.ts

❌ Bad filenames:
- UserService.ts (PascalCase)
- apiClient.js (camelCase)
- Button_Component.tsx (snake_case)
- useAuthHook.ts (camelCase)
```

**Rule:**

- `unicorn/filename-case` - Enforces consistent filename case

**Configuration:**

```js
// Use camelCase for all files
export default eslintConfig({
  unicorn: {
    filenameCase: "camelCase",
  },
});

// Use PascalCase for all files
export default eslintConfig({
  unicorn: {
    filenameCase: "pascalCase",
  },
});
```

For more advanced customization (like ignoring specific patterns), you can override the rule directly:

```js
export default eslintConfig({
  unicorn: {
    filenameCase: "kebabCase",
  },
  rules: {
    // Allow PascalCase for React components
    "unicorn/filename-case": [
      "warn",
      {
        case: "kebabCase",
        ignore: [
          "^[A-Z].*\\.tsx$", // Allow PascalCase for .tsx files
        ],
      },
    ],
  },
});
```

**Special Case: Convex Integration**

When both Unicorn and Convex configurations are enabled, Convex files automatically use **camelCase** regardless of your global filename case setting. This is because Convex files export functions that become API endpoints, and camelCase is the standard for function names.

```js
export default eslintConfig({
  convex: true,
  unicorn: { filenameCase: "kebabCase" }, // Global setting
});

// Result:
// - Convex files (convex/**/*.{ts,js}): camelCase ✅ getUserData.ts
// - All other files: kebabCase ✅ user-service.ts
```

[→ Learn more about Convex filename conventions](../convex/README.md#filename-convention)

### Node.js Protocol

Requires using the `node:` protocol when importing Node.js built-in modules:

```js
// ✅ Good - node: protocol
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { EventEmitter } from "node:events";

// ❌ Bad - missing node: protocol
import { readFile } from "fs/promises";
import { join } from "path";
import { EventEmitter } from "events";
```

**Rule:**

- `unicorn/prefer-node-protocol` - Enforces `node:` prefix (auto-fixable)

**Benefits:**

- Makes it clear which modules are built-in
- Prevents conflicts with npm packages
- Improves module resolution performance

### Error Handling

Ensures errors have meaningful messages:

```js
// ✅ Good - descriptive error messages
throw new Error("Failed to fetch user data");
throw new TypeError("Expected string, got number");

// ❌ Bad - empty error
throw new Error();
throw new TypeError();
```

**Rules:**

- `unicorn/error-message` - Requires error messages
- `unicorn/prefer-type-error` - Use `TypeError` for type checking (auto-fixable)

### Better Regex

Optimizes regular expressions:

```js
// ✅ Good - optimized regex
const regex = /\d+/;
const pattern = /[a-z]+/i;

// ❌ Bad - can be optimized
const regex = /[0-9]+/; // Use \d instead
const pattern = /[a-zA-Z]+/; // Use /[a-z]+/i instead
```

**Rule:**

- `unicorn/better-regex` - Suggests regex improvements (auto-fixable)

### Modern JavaScript

Promotes modern language features:

#### String Methods

```js
// ✅ Good - replaceAll for global replacement
const text = "hello hello".replaceAll("hello", "hi");

// ❌ Bad - global regex for simple replacement
const text = "hello hello".replace(/hello/g, "hi");
```

**Rule:**

- `unicorn/prefer-string-replace-all` - Use `replaceAll()` over global regex (auto-fixable)

#### Loop Improvements

```js
// ✅ Good - for...of loop
for (const item of items) {
  process(item);
}

// ❌ Bad - traditional for loop for simple iteration
for (let i = 0; i < items.length; i++) {
  process(items[i]);
}
```

**Rule:**

- `unicorn/no-for-loop` - Prefer for...of over C-style for loops (auto-fixable)

#### Built-in Constructors

```js
// ✅ Good - using new with constructors
const map = new Map();
const set = new Set();
const date = new Date();

// ❌ Bad - missing new
const map = Map();
const set = Set();
```

**Rule:**

- `unicorn/new-for-builtins` - Enforces `new` for built-ins (auto-fixable)

### Event Listeners

Promotes modern event handling:

```js
// ✅ Good - addEventListener
element.addEventListener("click", handler);

// ❌ Bad - on-handler
element.onclick = handler;
```

**Rule:**

- `unicorn/prefer-add-event-listener` - Use `addEventListener()` (auto-fixable)

### Switch Case Braces

Enforces consistent brace usage in switch cases:

```js
// ✅ Good - braces around case
switch (value) {
  case "a": {
    const result = doSomething();
    return result;
  }
  case "b": {
    return doOther();
  }
  default: {
    return defaultValue;
  }
}

// ❌ Bad - missing braces
switch (value) {
  case "a":
    const result = doSomething(); // Variable could leak to other cases
    return result;
}
```

**Rule:**

- `unicorn/switch-case-braces` - Always use braces in case clauses (auto-fixable)

### Text Encoding

Enforces consistent encoding identifier case:

```js
// ✅ Good - lowercase encoding
const text = new TextDecoder("utf-8").decode(buffer);
const encoded = new TextEncoder().encode("text");

// ❌ Bad - inconsistent case
const text = new TextDecoder("UTF-8").decode(buffer);
```

**Rule:**

- `unicorn/text-encoding-identifier-case` - Lowercase encoding identifiers (auto-fixable)

### Console Improvements

Prevents extra spaces in console output:

```js
// ✅ Good
console.log("User:", user);
console.error("Error:", error);

// ❌ Bad - extra spaces
console.log("User: ", user);
console.error("Error: ", error);
```

**Rule:**

- `unicorn/no-console-spaces` - No spaces before arguments (auto-fixable)

## Complete Example

```ts
// ✅ user-service.ts - follows all Unicorn rules
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export class UserService {
  async loadUser(userId: string): Promise<User> {
    if (typeof userId !== "string") {
      throw new TypeError("userId must be a string");
    }

    const filePath = join("data", "users", `${userId}.json`);

    try {
      const content = await readFile(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load user ${userId}`);
    }
  }

  processUsers(users: User[]): void {
    for (const user of users) {
      console.log("Processing:", user.name);

      switch (user.status) {
        case "active": {
          this.activateUser(user);
          break;
        }
        case "inactive": {
          this.deactivateUser(user);
          break;
        }
        default: {
          throw new Error(`Unknown status: ${user.status}`);
        }
      }
    }
  }
}
```

## Customization

### Change Filename Convention

```js
// Use camelCase instead of kebab-case
export default eslintConfig({
  unicorn: {
    filenameCase: "camelCase",
  },
});

// Use PascalCase for component files
export default eslintConfig({
  unicorn: {
    filenameCase: "pascalCase",
  },
});
```

### Override Filename Convention with Patterns

```js
export default eslintConfig({
  unicorn: {
    filenameCase: "kebabCase",
  },
  rules: {
    // Allow PascalCase for React components
    "unicorn/filename-case": [
      "warn",
      {
        case: "kebabCase",
        ignore: [
          "^[A-Z].*\\.tsx$", // Allow PascalCase for .tsx files
        ],
      },
    ],
  },
});
```

### Disable Specific Rules

```js
export default eslintConfig({
  rules: {
    // Allow traditional for loops
    "unicorn/no-for-loop": "off",

    // Allow onclick handlers
    "unicorn/prefer-add-event-listener": "off",
  },
});
```

### File-Specific Overrides

```js
export default eslintConfig({
  overrides: [
    {
      files: ["scripts/**/*.js"],
      rules: {
        // Allow any filename case in scripts
        "unicorn/filename-case": "off",
      },
    },
  ],
});
```

## Common Patterns

### Node.js Project

```ts
// server.ts
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const server = createServer(async (req, res) => {
  try {
    const file = await readFile(join("public", "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(file);
  } catch (error) {
    throw new Error("Failed to read file");
  }
});
```

### Frontend Project

```ts
// api-client.ts
export class ApiClient {
  async fetchUsers(): Promise<User[]> {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    return response.json();
  }
}
```

## Benefits

### Code Quality

- Catches common mistakes
- Promotes modern JavaScript
- Consistent patterns

### Maintainability

- Standard file naming
- Clear error messages
- Readable code patterns

### Performance

- Optimized regex
- Better module resolution
- Efficient iterations

## Related Configurations

- [Base](../base/README.md) - Base ESLint rules
- [TypeScript](../typescript/README.md) - TypeScript configuration
- [Import](../import/README.md) - Import validation

## Learn More

- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [Node.js Module System](https://nodejs.org/api/esm.html)
- [Modern JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Main README](../../../README.md)
