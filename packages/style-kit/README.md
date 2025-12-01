# `js-style-kit`

A zero-configuration style guide for ESLint and Prettier that provides sensible default settings and flexible configuration options.

[![CI](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml)
[![Release](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml)
[![npm version](https://img.shields.io/npm/v/js-style-kit.svg)](https://www.npmjs.com/package/js-style-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/drake-nathan/js-style-kit/graph/badge.svg?token=C57D67JAE0)](https://codecov.io/gh/drake-nathan/js-style-kit)

## Features

- ✅ **Batteries included** - ESLint, Prettier, and all plugins bundled (no peer dependency headaches)
- ✅ **ESLint v9** flat config format
- ✅ **TypeScript** first with automatic project detection
- ✅ **Framework support** - React, Next.js, Vite, Remix, React Router
- ✅ **Auto-sorting** - Imports, objects, properties, and more
- ✅ **Smart defaults** - All rules configured as warnings (not errors)
- ✅ **Highly configurable** - Enable only what you need, what you don't use is left out of the config for efficiency
- ✅ **ESM-only** - For modern JavaScript projects

## Requirements

- Node.js v20.11.0 or higher

## Installation

```bash
npm install js-style-kit --save-dev
# or
yarn add js-style-kit --dev
# or
pnpm add js-style-kit --save-dev
# or
bun add js-style-kit --dev
```

## Quick Start

### Option 1: CLI (Recommended)

The fastest way to get started is with our CLI tool:

```bash
npx js-style-kit init
```

This will:

1. Install dependencies
2. Create `style-kit.config.js`, `eslint.config.js`, and `prettier.config.js`
3. Add npm scripts to your `package.json`
4. Configure VS Code settings

[→ Learn more about the CLI](./bin/README.md)

### Option 2: Manual Setup

#### ESLint

Create `eslint.config.js` (or `eslint.config.mjs` if not using `"type": "module"`):

```js
// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig();
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0 --cache",
    "lint:fix": "eslint . --fix --max-warnings=0 --cache"
  }
}
```

> **Note:** The `--max-warnings=0` flag is important since all rules are warnings by default.

#### Prettier

Create `prettier.config.js` (or `prettier.config.mjs` if not using `"type": "module"`):

```js
// @ts-check
import { prettierConfig } from "js-style-kit";

export default prettierConfig();
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "format": "prettier . --write --cache",
    "format:check": "prettier . --check --cache"
  }
}
```

> **Tip:** For faster formatting, you can add the `--experimental-cli` flag to your format commands (e.g., `prettier . --write --cache --experimental-cli`). This uses Prettier's experimental CLI which can provide significant performance improvements. If you experience any issues, simply remove the flag.

## Configuration

### ESLint Options

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    // Core options
    typescript: true, // Boolean or path to tsconfig.json
    react: false, // React support (see React config docs)
    functionStyle: "arrow", // "arrow" | "declaration" | "expression" | "off"

    // Plugin toggles
    importPlugin: true, // Import/export validation
    sorting: true, // Auto-sort imports, objects, etc.
    unicorn: true, // Enforce file naming and best practices
    // or configure filename case:
    // unicorn: { filenameCase: "kebabCase" }, // "camelCase" | "kebabCase" | "pascalCase" | "snakeCase"
    jsdoc: { requireJsdoc: false }, // JSDoc validation

    // Framework & tools
    query: false, // TanStack Query rules
    testing: { framework: "vitest" }, // Test framework config
    storybook: false, // Storybook rules
    turbo: false, // Turborepo rules
    convex: false, // Convex backend rules

    // Advanced
    ignores: [], // Additional ignore patterns
    rules: {}, // Custom rule overrides
  },
  // Additional ESLint config objects
  {
    name: "custom-globals",
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
);
```

### Configuration Guides

Each configuration has detailed documentation:

- **Core Configs**
  - [Base ESLint Rules](./src/eslint/base/README.md)
  - [TypeScript](./src/eslint/typescript/README.md)
  - [Sorting (Perfectionist)](./src/eslint/perfectionist/README.md)
  - [Import Plugin](./src/eslint/import/README.md)
  - [Unicorn](./src/eslint/unicorn/README.md)

- **Framework Configs**
  - [React](./src/eslint/react/README.md) - React, hooks, compiler, and refresh support
  - [TanStack Query](./src/eslint/query/README.md) - Query best practices

- **Tool Configs**
  - [Testing](./src/eslint/testing/README.md) - Vitest, Jest, Bun, Node
  - [JSDoc](./src/eslint/jsdoc/README.md) - Documentation validation
  - [Storybook](./src/eslint/storybook/README.md) - Component story rules
  - [Turborepo](./src/eslint/turbo/README.md) - Monorepo rules
  - [Convex](./src/eslint/convex/README.md) - Convex backend rules

### Prettier Options

```js
import { prettierConfig } from "js-style-kit";

export default prettierConfig({
  // Plugin options
  cssOrderPlugin: true, // Sort CSS properties
  curlyPlugin: true, // Enforce curly braces
  jsonSortPlugin: true, // Sort JSON keys
  packageJsonPlugin: true, // Sort package.json
  tailwindPlugin: false, // Boolean, path to global css file, or config object
  parser: "oxc", // "oxc" (faster) or "default"

  // Standard Prettier options
  printWidth: 80,
  tabWidth: 2,
  // ... any Prettier option
});
```

[→ Full Prettier documentation](./src/prettier/README.md)

## Framework Examples

### React with Next.js

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  typescript: "./tsconfig.json",
  react: {
    framework: "next",
    reactCompiler: true, // React 19 compiler rules (enabled by default)
  },
  testing: {
    framework: "vitest",
    itOrTest: "it",
  },
});
```

### React with Vite

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  react: {
    framework: "vite",
    reactRefresh: true, // Fast Refresh validation (enabled by default with vite)
  },
  testing: { framework: "vitest" },
});
```

### TypeScript Library

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  typescript: "./tsconfig.json",
  jsdoc: { requireJsdoc: true }, // Enforce JSDoc for public APIs
  testing: { framework: "bun" },
});
```

## Adding Custom Rules

You can override any rule or add custom configurations. If you disable a rule in the `rules` object, it will be removed from the config for efficiency.

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    typescript: true,
    react: true,
    rules: {
      // Override built-in rules
      "no-console": ["error", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Additional ESLint config objects
  {
    name: "custom-globals",
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
);
```

## What's Included

### ESLint Plugins

- [`typescript-eslint`](https://typescript-eslint.io) - TypeScript linting
- [`eslint-plugin-perfectionist`](https://perfectionist.dev) - Auto-sorting
- [`eslint-plugin-import-x`](https://www.npmjs.com/package/eslint-plugin-import-x) - Import/export validation
- [`eslint-plugin-unicorn`](https://www.npmjs.com/package/eslint-plugin-unicorn) - Best practices & naming
- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react) - React rules
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) - React hooks rules
- [`eslint-plugin-react-refresh`](https://www.npmjs.com/package/eslint-plugin-react-refresh) - Fast Refresh validation
- [`eslint-plugin-nextjs`](../eslint-plugin-nextjs/README.md) - My fork of the Next.js plugin
- [`@tanstack/eslint-plugin-query`](https://tanstack.com/query/v4/docs/eslint/eslint-plugin-query) - TanStack Query rules
- [`eslint-plugin-jsdoc`](https://www.npmjs.com/package/eslint-plugin-jsdoc) - JSDoc validation
- [`eslint-plugin-storybook`](https://www.npmjs.com/package/eslint-plugin-storybook) - Storybook rules
- [`eslint-plugin-turbo`](https://www.npmjs.com/package/eslint-plugin-turbo) - Turborepo rules
- [`eslint-plugin-vitest`](https://www.npmjs.com/package/eslint-plugin-vitest) - Vitest rules
- [`eslint-plugin-jest`](https://www.npmjs.com/package/eslint-plugin-jest) - Jest rules
- [`@convex-dev/eslint-plugin`](https://docs.convex.dev/eslint) - Convex backend rules

### Prettier Plugins

- [`prettier-plugin-css-order`](https://www.npmjs.com/package/prettier-plugin-css-order) - CSS property ordering
- [`prettier-plugin-curly`](https://www.npmjs.com/package/prettier-plugin-curly) - Curly brace enforcement
- [`prettier-plugin-packagejson`](https://www.npmjs.com/package/prettier-plugin-packagejson) - package.json sorting
- [`prettier-plugin-sort-json`](https://www.npmjs.com/package/prettier-plugin-sort-json) - JSON sorting
- [`prettier-plugin-tailwindcss`](https://www.npmjs.com/package/prettier-plugin-tailwindcss) - Tailwind class sorting
- [`@prettier/plugin-oxc`](https://www.npmjs.com/package/@prettier/plugin-oxc) - Faster parser (optional)

## License

MIT

---

**Note:** This is a work in progress. Please [open an issue](https://github.com/drake-nathan/js-style-kit/issues) if you have suggestions or find any problems!
