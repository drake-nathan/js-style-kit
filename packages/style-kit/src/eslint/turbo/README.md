# Turbo Configuration

ESLint rules for Turborepo monorepos to catch common configuration issues.

[← Back to main README](../../README.md)

## Overview

Turbo configuration is **disabled by default** and provides:
- Environment variable validation
- Turborepo configuration best practices
- Monorepo-specific linting

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  turbo: true, // Enable Turborepo rules
});
```

## Key Features

### Environment Variable Declaration

Ensures all environment variables used in your code are properly declared in Turborepo configuration:

```ts
// turbo.json
{
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "API_URL"]
    }
  }
}
```

```ts
// ✅ Good - declared in turbo.json
const apiUrl = process.env.API_URL;
const nodeEnv = process.env.NODE_ENV;

// ❌ Bad - not declared in turbo.json
const secretKey = process.env.SECRET_KEY; // Warning!
```

**Rule:**
- `turbo/no-undeclared-env-vars` - Ensures env vars are declared in `turbo.json`

**Why this matters:**
- Turborepo needs to know about env vars for proper caching
- Undeclared env vars can cause cache invalidation issues
- Makes dependencies explicit and trackable

## How It Works

The rule checks your `turbo.json` configuration and validates that any environment variables accessed in your code are listed in the appropriate task's `env` array.

### Project-Level Configuration
```json
// turbo.json
{
  "tasks": {
    "build": {
      "env": [
        "NODE_ENV",
        "API_URL",
        "NEXT_PUBLIC_*"  // Wildcard pattern
      ]
    },
    "dev": {
      "env": ["NODE_ENV"],
      "cache": false
    }
  }
}
```

### Global Environment Variables
```json
// turbo.json
{
  "globalEnv": [
    "CI",
    "VERCEL"
  ],
  "tasks": {
    "build": {
      "env": ["API_URL"]
    }
  }
}
```

## Examples

### Valid Usage

```ts
// turbo.json has: { "tasks": { "build": { "env": ["API_URL", "DB_HOST"] } } }

// ✅ Good - all declared
export const config = {
  apiUrl: process.env.API_URL,
  dbHost: process.env.DB_HOST,
};

// ✅ Good - using wildcard pattern
// turbo.json has: { "env": ["NEXT_PUBLIC_*"] }
const publicKey = process.env.NEXT_PUBLIC_API_KEY;
```

### Invalid Usage

```ts
// turbo.json has: { "tasks": { "build": { "env": ["API_URL"] } } }

// ❌ Bad - SECRET_KEY not declared
const config = {
  apiUrl: process.env.API_URL,
  secret: process.env.SECRET_KEY, // Warning!
};
```

### Fixing the Issue

Add missing env vars to `turbo.json`:

```json
{
  "tasks": {
    "build": {
      "env": [
        "API_URL",
        "SECRET_KEY"
      ]
    }
  }
}
```

## Wildcard Patterns

Turborepo supports wildcard patterns for environment variables:

```json
{
  "tasks": {
    "build": {
      "env": [
        "NEXT_PUBLIC_*",    // Matches NEXT_PUBLIC_API_URL, etc.
        "VITE_*",           // Matches VITE_API_URL, etc.
        "REACT_APP_*"       // Matches REACT_APP_VERSION, etc.
      ]
    }
  }
}
```

```ts
// ✅ All valid with wildcard patterns above
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appVersion = process.env.REACT_APP_VERSION;
const viteMode = process.env.VITE_MODE;
```

## Common Patterns

### Next.js Monorepo

```json
// turbo.json
{
  "globalEnv": ["CI", "NODE_ENV"],
  "tasks": {
    "build": {
      "env": [
        "NEXT_PUBLIC_*",
        "DATABASE_URL",
        "API_SECRET"
      ],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

### Multi-Framework Monorepo

```json
// turbo.json
{
  "tasks": {
    "build": {
      "env": [
        "NODE_ENV",
        "NEXT_PUBLIC_*",     // Next.js apps
        "VITE_*",            // Vite apps
        "REACT_APP_*"        // CRA apps
      ]
    }
  }
}
```

### Backend Services

```json
// turbo.json
{
  "tasks": {
    "build": {
      "env": [
        "DATABASE_URL",
        "REDIS_URL",
        "AWS_*",
        "STRIPE_SECRET_KEY"
      ]
    },
    "test": {
      "env": [
        "DATABASE_URL",
        "TEST_DATABASE_URL"
      ]
    }
  }
}
```

## Customization

### Disable for Specific Files

```js
export default eslintConfig({
  turbo: true,
  overrides: [
    {
      files: ["scripts/**/*.ts"],
      rules: {
        // Scripts might use env vars not in turbo.json
        "turbo/no-undeclared-env-vars": "off",
      },
    },
  ],
});
```

### Error Instead of Warning

```js
export default eslintConfig({
  turbo: true,
  rules: {
    // Make undeclared env vars an error
    "turbo/no-undeclared-env-vars": "error",
  },
});
```

### Disable Completely

```js
export default eslintConfig({
  turbo: true,
  rules: {
    "turbo/no-undeclared-env-vars": "off",
  },
});
```

## Monorepo Structure

Typical monorepo using Turborepo:

```
my-monorepo/
├── turbo.json              # Turbo configuration
├── package.json
├── packages/
│   ├── web/               # Next.js app
│   │   └── src/
│   ├── api/               # API service
│   │   └── src/
│   └── shared/            # Shared utilities
│       └── src/
└── apps/
    └── mobile/            # React Native app
        └── src/
```

Each package can use environment variables, but they must be declared in the root `turbo.json` or task-specific configuration.

## Environment Variables Best Practices

### 1. Declare All Variables
Always declare environment variables in `turbo.json` for proper cache invalidation:

```json
{
  "tasks": {
    "build": {
      "env": ["ALL", "VARS", "HERE"]
    }
  }
}
```

### 2. Use Wildcards for Prefixes
For public/framework-specific variables:

```json
{
  "tasks": {
    "build": {
      "env": ["NEXT_PUBLIC_*", "VITE_*"]
    }
  }
}
```

### 3. Separate by Task
Different tasks can have different env vars:

```json
{
  "tasks": {
    "build": {
      "env": ["API_URL", "BUILD_ID"]
    },
    "test": {
      "env": ["TEST_DATABASE_URL"]
    }
  }
}
```

### 4. Use Global Env for CI
Common variables used everywhere:

```json
{
  "globalEnv": ["CI", "NODE_ENV", "VERCEL"],
  "tasks": { /* ... */ }
}
```

## Troubleshooting

### Rule not working
- Ensure `turbo.json` exists in your project root
- Check that the env var is being accessed as `process.env.VAR_NAME`
- Verify the task name matches your `turbo.json` tasks

### Too many warnings
- Use wildcard patterns for common prefixes
- Add frequently-used vars to `globalEnv`
- Consider disabling for certain files (scripts, config)

### False positives
- Dynamic env var access might not be detected correctly:
```ts
// Might not be caught
const key = process.env[`DYNAMIC_${name}`];
```

## Related Configurations

- [Base](../base/README.md) - Base ESLint rules
- [TypeScript](../typescript/README.md) - TypeScript configuration

## Learn More

- [eslint-plugin-turbo](https://github.com/vercel/turbo/tree/main/packages/eslint-plugin-turbo)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo Environment Variables](https://turbo.build/repo/docs/core-concepts/caching#environment-variables)
- [Main README](../../README.md)
