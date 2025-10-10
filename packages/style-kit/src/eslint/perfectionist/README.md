# Perfectionist Configuration

Automatic code organization through intelligent sorting of imports, objects, types, and more with `eslint-plugin-perfectionist`.

[← Back to main README](../../README.md)

## Overview

Perfectionist configuration is **enabled by default** and provides:

- Automatic sorting for imports, exports, and named imports
- Object key and property sorting
- TypeScript type and interface organization
- Consistent code structure across your codebase
- Natural alphabetical ordering (smart number handling)

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  sorting: true, // Enabled by default
});
```

## What Gets Sorted

Perfectionist automatically organizes:

- Import statements
- Named imports and exports
- Object literals and properties
- TypeScript interfaces and types
- Enums and union types
- JSX props
- Classes and decorators
- Array includes, Maps, and Sets

## Sorting Algorithm

All sorting uses **natural ascending order** by default:

```js
// Natural sort understands numbers
["item1", "item2", "item10", "item20"][
  // Not: ["item1", "item10", "item2", "item20"]

  // Case-insensitive alphabetical
  ("Apple", "banana", "Cherry")
];
```

## Key Features

### Import Sorting

Automatically organizes imports for better readability:

```ts
// ✅ After auto-fix - properly sorted
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";

import { Button } from "@/components/Button";
import { config } from "@/config";

import { apiClient } from "./api";
import { formatDate } from "./utils";

// ❌ Before - unsorted
import { useState, useEffect } from "react";
import { formatDate } from "./utils";
import { Button } from "@/components/Button";
import { parse, format } from "date-fns";
import { apiClient } from "./api";
import { config } from "@/config";
```

**Rules:**

- `perfectionist/sort-imports` - Sorts import statements
- `perfectionist/sort-named-imports` - Sorts named imports within braces
- `perfectionist/sort-named-exports` - Sorts named exports
- `perfectionist/sort-exports` - Sorts export statements

### Object Sorting

Maintains consistent object key order:

```ts
// ✅ Good - sorted keys
const user = {
  age: 30,
  email: "user@example.com",
  id: "123",
  name: "Alice",
};

// ❌ Bad - unsorted keys
const user = {
  name: "Alice",
  id: "123",
  email: "user@example.com",
  age: 30,
};
```

**Rules:**

- `perfectionist/sort-objects` - Sorts object literal keys

### TypeScript Types

Organizes TypeScript definitions:

```ts
// ✅ Good - sorted interface properties
interface User {
  age: number;
  email: string;
  id: string;
  name: string;
}

// ✅ Good - sorted union types
type Status = "active" | "inactive" | "pending";

// ✅ Good - sorted intersection types
type Combined = Base & Extra & Middle;

// ❌ Bad - unsorted
interface User {
  name: string;
  id: string;
  email: string;
  age: number;
}
```

**Rules:**

- `perfectionist/sort-interfaces` - Sorts interface properties
- `perfectionist/sort-object-types` - Sorts type object properties
- `perfectionist/sort-union-types` - Sorts union type members
- `perfectionist/sort-intersection-types` - Sorts intersection type members
- `perfectionist/sort-enums` - Sorts enum members

### JSX Props

Maintains consistent prop order:

```tsx
// ✅ Good - sorted props
<Button
  className="btn"
  disabled={false}
  onClick={handleClick}
  type="submit"
>
  Submit
</Button>

// ❌ Bad - unsorted props
<Button
  onClick={handleClick}
  type="submit"
  className="btn"
  disabled={false}
>
  Submit
</Button>
```

**Rules:**

- `perfectionist/sort-jsx-props` - Sorts JSX element props

### Classes

Organizes class members and decorators:

```ts
// ✅ Good - sorted members
class UserService {
  private cache: Map<string, User>;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    this.cache = new Map();
  }

  getUser(id: string): User {
    /* ... */
  }
  saveUser(user: User): void {
    /* ... */
  }
}

// ✅ Good - sorted decorators
@Component()
@Injectable()
@Module()
class MyClass {}
```

**Rules:**

- `perfectionist/sort-classes` - Sorts class members
- `perfectionist/sort-decorators` - Sorts decorators

### Other Collections

Sorts various other structures:

```ts
// ✅ Good - sorted array includes
const colors = ["blue", "green", "red"];

// ✅ Good - sorted Map entries
const map = new Map([
  ["apple", 1],
  ["banana", 2],
  ["cherry", 3],
]);

// ✅ Good - sorted Set values
const set = new Set(["a", "b", "c"]);

// ✅ Good - sorted variable declarations
const a = 1,
  b = 2,
  c = 3;

// ✅ Good - sorted switch cases
switch (value) {
  case "a":
    return 1;
  case "b":
    return 2;
  case "c":
    return 3;
}
```

**Rules:**

- `perfectionist/sort-array-includes` - Sorts array include calls
- `perfectionist/sort-maps` - Sorts Map constructor entries
- `perfectionist/sort-sets` - Sorts Set constructor values
- `perfectionist/sort-variable-declarations` - Sorts variable declarations
- `perfectionist/sort-switch-case` - Sorts switch case statements
- `perfectionist/sort-heritage-clauses` - Sorts class extends/implements

## Complete Example

```ts
// ✅ Fully sorted code with Perfectionist
import type { Config, User } from "./types";

import { format, parse } from "date-fns";
import { useEffect, useState } from "react";

import { apiClient } from "./api";

interface UserProfile {
  age: number;
  avatar?: string;
  email: string;
  id: string;
  name: string;
  role: "admin" | "user";
}

const defaultConfig: Config = {
  apiUrl: "https://api.example.com",
  debug: false,
  timeout: 5000,
};

export const createUser = (data: User): UserProfile => {
  return {
    age: data.age,
    email: data.email,
    id: data.id,
    name: data.name,
    role: data.role,
  };
};

export { apiClient, defaultConfig };
```

## Module Sorting

Module-level sorting is **disabled by default** as it can be disruptive:

```js
// perfectionist/sort-modules is "off"
```

This prevents the plugin from reordering top-level statements like:

- Function declarations
- Class declarations
- Variable declarations
- Export statements

If you want to enable module sorting:

```js
export default eslintConfig({
  perfectionist: true,
  rules: {
    "perfectionist/sort-modules": "warn",
  },
});
```

## Customization

### Disable Specific Sorting

```js
export default eslintConfig({
  perfectionist: true,
  rules: {
    // Disable JSX prop sorting
    "perfectionist/sort-jsx-props": "off",

    // Disable object sorting
    "perfectionist/sort-objects": "off",

    // Enable module sorting
    "perfectionist/sort-modules": "warn",
  },
});
```

### File-Specific Overrides

```js
export default eslintConfig({
  perfectionist: true,
  overrides: [
    {
      files: ["**/*.config.ts"],
      rules: {
        // Don't sort objects in config files
        "perfectionist/sort-objects": "off",
      },
    },
  ],
});
```

## Benefits

### Consistency

- Same structure across all files
- Reduces diff noise in code reviews
- Easier to find properties and imports

### Maintainability

- Clear organization patterns
- Prevents merge conflicts from ordering
- Auto-fixes maintain order

### Readability

- Natural alphabetical order is easy to scan
- Grouped related items stay together
- Predictable structure

## Common Patterns

### React Component

```tsx
import type { FC, ReactNode } from "react";

import { useCallback, useEffect, useState } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  disabled = false,
  onClick,
  type = "button",
}) => {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
```

### API Client

```ts
import type { RequestConfig, Response } from "./types";

import { auth } from "./auth";
import { config } from "./config";
import { logger } from "./logger";

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;

  async delete(url: string): Promise<Response> {
    /* ... */
  }
  async get(url: string): Promise<Response> {
    /* ... */
  }
  async post(url: string, data: unknown): Promise<Response> {
    /* ... */
  }
  async put(url: string, data: unknown): Promise<Response> {
    /* ... */
  }
}
```

## Related Configurations

- [Import](../import/README.md) - Import validation (works alongside Perfectionist)
- [TypeScript](../typescript/README.md) - TypeScript type checking
- [Base](../base/README.md) - Base ESLint rules

## Learn More

- [eslint-plugin-perfectionist](https://github.com/azat-io/eslint-plugin-perfectionist)
- [Natural Sort Algorithm](https://en.wikipedia.org/wiki/Natural_sort_order)
- [Main README](../../README.md)
