# Import Configuration

Comprehensive import/export validation and organization powered by `eslint-plugin-import-x`. A faster alternative to `eslint-plugin-import`.

[← Back to main README](../../README.md)

## Overview

Import configuration is **enabled by default** and provides:

- Import/export validation and error detection
- Duplicate import prevention
- Path validation and optimization
- Circular dependency detection
- TypeScript-aware import resolution

## Quick Start

The import configuration is automatically enabled when you use `eslintConfig()`:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig(); // Import rules enabled by default
```

### Disable Import Validation

Disable import validation by passing `import: false` to `eslintConfig()`:

```js
export default eslintConfig({
  import: false,
});
```

## Key Features

### Import Validation

Ensures all imports are valid and resolvable:

```js
// ✅ Good
import { useState } from "react";
import { formatDate } from "./utils";
import type { User } from "./types";

// ❌ Bad - unresolved import
import { missing } from "./nonexistent";

// ❌ Bad - importing from wrong export
import { nonExistent } from "react";
```

**Rules:**

- `import-x/named` - Validates named imports exist (JS only)
- `import-x/default` - Validates default imports exist (JS only)
- `import-x/namespace` - Validates namespace imports (JS only)
- `import-x/no-unresolved` - Ensures imports can be resolved (JS only)

**Note:** In TypeScript projects, these validations are handled by TypeScript itself.

### Duplicate Prevention

Prevents duplicate and redundant imports:

```js
// ✅ Good
import { useState, useEffect } from "react";

// ❌ Bad - duplicate imports
import { useState } from "react";
import { useEffect } from "react";
```

**Rules:**

- `import-x/no-duplicates` - Merges duplicate imports from the same module

### Import Organization

Enforces clean import structure:

```js
// ✅ Good
import React from "react";
import { useState } from "react";

const MyComponent = () => {
  /* ... */
};

// ❌ Bad - import after code
const MyComponent = () => {
  /* ... */
};

import React from "react"; // Import must come first
```

**Rules:**

- `import-x/first` - Imports must come before other statements
- `import-x/newline-after-import` - Requires newline after last import (fixable)

### Path Validation

Ensures clean, maintainable import paths:

```js
// ✅ Good
import { helper } from "./utils/helper";
import { config } from "@/config";

// ❌ Bad - absolute path
import { helper } from "/Users/name/project/src/utils/helper";

// ❌ Bad - importing from package's internal path
import { Button } from "../../node_modules/ui-library/dist/button";

// ❌ Bad - self import
import { something } from "./current-file";

// ❌ Bad - unnecessary path segments
import { helper } from "./utils/../helper";
```

**Rules:**

- `import-x/no-absolute-path` - Disallows absolute filesystem paths
- `import-x/no-relative-packages` - Prevents relative imports of packages
- `import-x/no-self-import` - Prevents importing from the same file
- `import-x/no-useless-path-segments` - Removes unnecessary path segments

### Circular Dependencies

Detects circular dependencies that can cause issues:

```js
// ❌ Bad
// user.ts
import { Post } from "./post";
export class User { posts: Post[] }

// post.ts
import { User } from "./user"; // ❌ Circular dependency
export class Post { author: User }

// ✅ Good - use type-only import to break cycle
// post.ts
import type { User } from "./user";
export class Post { author: User }
```

**Rules:**

- `import-x/no-cycle` - Warns on circular dependencies

### Dependency Management

Validates package usage:

```js
// ✅ Good - importing from dependencies
import React from "react"; // Listed in package.json

// ❌ Bad - importing package not in dependencies
import express from "express"; // Not in package.json
```

**Rules:**

- `import-x/no-extraneous-dependencies` - Ensures imports are in `package.json`

### Export Best Practices

Enforces safe export patterns:

```js
// ✅ Good
export const API_KEY = "abc123";
export const config = { url: "..." };

// ❌ Bad - mutable export
export let count = 0; // Can be reassigned externally

// ❌ Bad - named as default
export { user as default };
import user from "./user"; // Confusing
```

**Rules:**

- `import-x/no-mutable-exports` - Prevents `export let`
- `import-x/no-named-as-default` - Warns when default export has same name as named export
- `import-x/no-named-as-default-member` - Warns on accessing named exports from default

## TypeScript Integration

When TypeScript is enabled, the configuration automatically adjusts:

```js
export default eslintConfig({
  typescript: true, // Enabled by default
});
```

**TypeScript mode:**

- ✅ Uses `eslint-import-resolver-typescript` for path resolution
- ✅ Supports TypeScript path aliases (`@/`, `~/`, etc.)
- ✅ Disables redundant validation rules (TypeScript handles them)
- ✅ Validates type-only imports
- ✅ Supports Bun runtime resolution

### Path Aliases

```ts
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./"]
    }
  }
}
```

```ts
// ✅ Works with TypeScript resolver
import { Button } from "@/components/Button";
import { config } from "~/config";
```

## Examples

### JavaScript Project

```js
// utils.js
export const formatDate = (date) => {
  /* ... */
};
export const parseDate = (str) => {
  /* ... */
};

// app.js
import { formatDate, parseDate } from "./utils"; // ✅ Combined import

formatDate(new Date());
```

### TypeScript Project

```ts
// types.ts
export interface User {
  id: string;
  name: string;
}

// user-service.ts
import type { User } from "./types"; // ✅ Type-only import

export const getUser = (): User => {
  /* ... */
};
```

### Breaking Circular Dependencies

```ts
// Before - circular dependency
// user.ts
import { Post } from "./post";
export interface User {
  posts: Post[];
}

// post.ts
import { User } from "./user"; // ❌ Circular
export interface Post {
  author: User;
}

// After - using type-only import
// user.ts
import type { Post } from "./post";
export interface User {
  posts: Post[];
}

// post.ts
import type { User } from "./user"; // ✅ Type-only breaks cycle
export interface Post {
  author: User;
}
```

### Monorepo Packages

```ts
// package.json in workspace
{
  "dependencies": {
    "@myorg/shared": "workspace:*"
  }
}

// ✅ Good - importing workspace package
import { Button } from "@myorg/shared";

// ❌ Bad - relative import to other package
import { Button } from "../../shared/src/Button";
```

## Customization

Override specific import rules:

```js
export default eslintConfig({
  rules: {
    // Allow circular dependencies in some cases
    "import-x/no-cycle": "off",

    // Error on extraneous dependencies instead of warn
    "import-x/no-extraneous-dependencies": "error",

    // Allow default exports with same name as named export
    "import-x/no-named-as-default": "off",
  },
});
```

### Custom Import Ordering

While this config handles import validation, use the [Perfectionist](../perfectionist/README.md) configuration for import sorting:

```js
export default eslintConfig({
  // Import validation + sorting
  perfectionist: true, // Sorts imports alphabetically
});
```

## Common Issues

### Unresolved imports in monorepo

Make sure TypeScript is enabled and `tsconfig.json` includes proper path mappings:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@myorg/*": ["packages/*/src"]
    }
  }
}
```

### False positives on dynamic imports

Dynamic imports are supported:

```js
const module = await import(`./modules/${name}`); // ✅ OK
```

### Type imports not working

Ensure TypeScript is enabled in the config:

```js
export default eslintConfig({
  typescript: true, // Required for type-only import validation
});
```

## Related Configurations

- [Perfectionist](../perfectionist/README.md) - Auto-sorts imports
- [TypeScript](../typescript/README.md) - TypeScript configuration
- [Base](../base/README.md) - Base ESLint rules

## Learn More

- [eslint-plugin-import-x](https://github.com/un-ts/eslint-plugin-import-x)
- [eslint-import-resolver-typescript](https://github.com/import-js/eslint-import-resolver-typescript)
- [ES Module Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [Main README](../../README.md)
