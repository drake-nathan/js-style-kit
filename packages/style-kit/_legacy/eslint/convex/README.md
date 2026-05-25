# Convex Configuration

ESLint rules for Convex backend development.

[← Back to main README](../../../README.md)

## Overview

Convex configuration is **disabled by default** and provides rules from @convex-dev/eslint-plugin, which is Convex's own ESLint plugin.

> **Note:** This plugin is currently in **alpha** and is subject to change.

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  convex: true, // Enable Convex rules
});
```

## File Scope

Convex rules apply only to files in your `convex` directory: `**/convex/**/*.{ts,js}`

## Filename Convention

When both Convex and Unicorn configurations are enabled, **Convex files are automatically enforced to use camelCase** naming, regardless of the global Unicorn filename case setting.

This is because Convex follows JavaScript/TypeScript conventions where files export functions that become API endpoints, and camelCase is the standard for function names.

### Example

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  convex: true,
  unicorn: { filenameCase: "kebabCase" }, // Global setting
});
```

With this configuration:

- **Convex files** (`convex/**/*.{ts,js}`) must use **camelCase**: ✅ `getUserData.ts`, `sendMessage.ts`
- **All other files** must use **kebabCase**: ✅ `user-service.ts`, `api-client.ts`

### Why camelCase for Convex?

Convex files export functions that become your backend API. Using camelCase keeps your filenames consistent with the function names they export:

```typescript
// convex/getUserData.ts
export default query(async (ctx) => {
  // Function is called as api.getUserData
});
```

### Disabling Filename Enforcement

If you want to disable filename case enforcement for Convex files, you can override it:

```js
export default eslintConfig({
  convex: true,
  unicorn: true,
  rules: {
    "unicorn/filename-case": "off", // Disables for all files including Convex
  },
});
```

## Learn More

- [Convex ESLint Plugin](https://docs.convex.dev/eslint) - Official documentation
- [Convex Validators](https://docs.convex.dev/functions/validation) - Argument validation guide
- [Unicorn Configuration](../unicorn/README.md) - Filename case options
- [Main README](../../../README.md)
