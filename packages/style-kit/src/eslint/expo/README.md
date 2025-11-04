# Expo Configuration

ESLint rules for [Expo](https://expo.dev) and React Native development to ensure proper environment variable handling and DOM API usage.

[← Back to main README](../../../README.md)

## Overview

Expo support is **disabled by default** and provides:

- Environment variable usage validation
- DOM API usage patterns for web compatibility
- Best practices for Expo-specific features

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  expo: true, // Enable Expo rules
});
```

## When to Use

Enable this configuration when building applications with Expo:

```bash
npm install expo
# or
yarn add expo
# or
pnpm add expo
# or
bun add expo
```

## Rules

### Environment Variable Handling

**`no-dynamic-env-var`** (warn)
Prevents dynamic environment variable access which can break static analysis and bundling optimizations.

```ts
// ✅ Good - static access
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// ❌ Bad - dynamic access
const key = "EXPO_PUBLIC_API_URL";
const apiUrl = process.env[key];
```

**Why?** Expo's bundler needs to statically analyze environment variable usage to properly inline values and tree-shake unused code.

**`no-env-var-destructuring`** (warn)
Prevents destructuring of `process.env` which can cause issues with environment variable replacement.

```ts
// ✅ Good - direct access
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

// ❌ Bad - destructuring
const { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_API_KEY } = process.env;
```

**Why?** Destructuring can interfere with Expo's build-time environment variable substitution and make it harder to track which variables are actually used.

### DOM API Usage

**`use-dom-exports`** (warn)
Ensures DOM APIs are imported from `expo/dom` for better web compatibility and type safety.

```ts
// ✅ Good - using expo/dom
import { document, window } from "expo/dom";

const element = document.getElementById("root");

// ❌ Bad - direct global access
const element = document.getElementById("root");
```

**Why?** Using `expo/dom` provides:
- Better type safety with TypeScript
- Consistent behavior across web and native platforms
- Clearer dependency tracking
- Easier testing and mocking

## Common Patterns

### With React and TypeScript

```js
export default eslintConfig({
  typescript: true,
  react: { framework: "none" }, // Expo handles its own bundling
  expo: true,
});
```

### With React Native Web

```js
export default eslintConfig({
  typescript: true,
  react: {
    framework: "none",
    reactRefresh: true, // Enable for web development
  },
  expo: true,
});
```

## Customization

Override specific Expo rules:

```js
export default eslintConfig({
  expo: true,
  rules: {
    // Allow dynamic env var access if you have a specific use case
    "expo/no-dynamic-env-var": "off",

    // Make DOM exports an error instead of warning
    "expo/use-dom-exports": "error",
  },
});
```

## Best Practices

1. **Use static environment variable access** - Always reference env vars directly
2. **Prefix public env vars** with `EXPO_PUBLIC_` for client-side access
3. **Import DOM APIs** from `expo/dom` when targeting web
4. **Avoid destructuring** `process.env` to maintain compatibility

## Environment Variables in Expo

Expo supports two types of environment variables:

### Public Variables (Client-Side)

Prefix with `EXPO_PUBLIC_` to make them available in your app:

```ts
// .env
EXPO_PUBLIC_API_URL=https://api.example.com

// app.tsx
const apiUrl = process.env.EXPO_PUBLIC_API_URL; // ✅ Available
```

### Private Variables (Build-Time Only)

Variables without the prefix are only available during build:

```ts
// .env
SECRET_KEY=abc123

// app.config.ts (build time)
const secretKey = process.env.SECRET_KEY; // ✅ Available

// app.tsx (runtime)
const secretKey = process.env.SECRET_KEY; // ❌ undefined
```

## Troubleshooting

### Environment variable is undefined

Ensure you're using the `EXPO_PUBLIC_` prefix for client-side variables:

```ts
// ❌ Won't work in app code
const apiUrl = process.env.API_URL;

// ✅ Works in app code
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

### Dynamic access needed for configuration

If you need dynamic access, consider using a configuration object:

```ts
// config.ts
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
} as const;

// app.tsx
import { config } from "./config";
const url = config.apiUrl; // ✅ Type-safe and static
```

## Related Configurations

- [React](../react/README.md) - React configuration
- [TypeScript](../typescript/README.md) - TypeScript support
- [Testing](../testing/README.md) - Test Expo apps

## Learn More

- [Expo ESLint Plugin](https://github.com/expo/expo/tree/main/packages/eslint-plugin-expo)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Expo DOM](https://docs.expo.dev/versions/latest/sdk/dom/)
- [Main README](../../../README.md)
