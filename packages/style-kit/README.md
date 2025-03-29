# `js-style-kit`

A zero-configuration style guide for ESLint and Prettier that provides sensible default settings and flexible configuration options.

[![CI](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml)
[![Release](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml)
[![npm version](https://img.shields.io/npm/v/js-style-kit.svg)](https://www.npmjs.com/package/js-style-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/drake-nathan/js-style-kit/graph/badge.svg?token=C57D67JAE0)](https://codecov.io/gh/drake-nathan/js-style-kit)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/drake-nathan/js-style-kit?labelColor=5C5C5C&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit%20Reviews)

## Overview

JS Style Kit is a comprehensive, batteries-included linting and formatting solution for modern JavaScript and TypeScript projects.

- ✅ All dependencies included (ESLint, Prettier, plugins) - no need to install extras
- ✅ ESLint v9 flat config
- ✅ TypeScript support out of the box
- ✅ Optional React and React Compiler support
- ✅ JSDoc validation with configurable requirements for libraries
- ✅ Automatic import, prop, and object sorting with Perfectionist
- ✅ Tailwind CSS support for Prettier
- ✅ Modern ESM-only package

> **Note:** This is very much a work in progress. I want to know what configuration changes you make, so please open an issue!

## Requirements

- Node.js v20.11.0 or higher
- TypeScript (for TypeScript projects, not bundled)

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

## ESLint Configuration

### Basic Usage

Create an `eslint.config.js` file in your project root:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig();
```

> **Note:** If you're not using `"type": "module"` in your package.json, name your file `eslint.config.mjs` instead.

Setup your `package.json` commands:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix --max-warnings 0"
  }
}
```

> **Note:** The `--max-warnings 0` option is important because all rules are set to warning by default.

### Configuration Options

The `eslintConfig()` function accepts a configuration object with the following options:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  // All options shown with their default values
  functionStyle: "arrow", // Controls function style: "arrow", "declaration", "expression", or "off"
  ignores: [], // Additional paths to ignore (node_modules and dist already excluded)
  jsdoc: { requireJsdoc: false }, // JSDoc configuration or false to disable
  react: false, // Whether to include React rules, see below for options
  sorting: true, // Whether to include sorting rules from Perfectionist
  storybook: false, // Whether to include Storybook rules
  typescript: true, // Boolean or string path to tsconfig.json
});
```

#### Function Style Configuration

Controls how functions should be written. Some configurations are auto-fixable, but some require manual adjustment.

```js
// Enforce arrow functions (default)
functionStyle: "arrow";

// Enforce function declarations
functionStyle: "declaration";

// Enforce function expressions
functionStyle: "expression";

// Disable function style enforcement
functionStyle: "off";
```

#### TypeScript Configuration

TypeScript support is enabled by default. You can:

```js
// Enable with automatic project detection
typescript: true;

// Disable TypeScript rules
typescript: false;

// Specify path to your tsconfig.json
typescript: "./tsconfig.json";
```

#### React Configuration

React support is disabled by default.

```js
// `true` enables standard react rules, react hook rules, and react compiler
react: true

// you can also pass an object to control react compiler and next support
react: {
  reactCompiler: false,
  reactRefresh: false, // Controls React Fast Refresh validation (default: true when react is enabled)
  next: true
}
// next simply adds ".next" to the ignores array, but I plan add the next plugin in the future
```

#### JSDoc Configuration

JSDoc validation is enabled by default, but requirement rules are off:

```js
// Disable JSDoc validation completely
jsdoc: false;

// Enable JSDoc with requirement rules, ideal for libraries
jsdoc: {
  requireJsdoc: true;
}
```

#### Testing Configuration

Testing support is enabled by default with Vitest configuration. You can customize it or disable it completely:

```js
// Disable testing configuration
testing: false;

// Enable with custom options
testing: {
  filenamePattern: "spec", // "test" (.test, default) or "spec" (.spec)
  files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"], // Override file patterns
  formattingRules: true, // Whether to include formatting rules like padding around blocks
  framework: "vitest", // "vitest" (default), "jest", "node", or "bun"
  itOrTest: "test", // "it" (default) or "test"
}
```

#### Perfectionist (Code Organization)

Sorting/organization rules from the Perfectionist plugin are enabled by default:

```js
// Disable sorting rules
sorting: false;
```

#### Storybook Configuration

Storybook support is disabled by default, but can be enabled to provide linting rules specifically for Storybook files:

```js
// Enable Storybook rules
storybook: true;
```

When enabled, this configuration:

- Applies best practices for Storybook files (_.stories._ and _.story._)
- Includes rules for Storybook configuration files (.storybook/main.\*)
- Ensures the .storybook directory is not ignored by ESLint (adds a negation pattern to ignores)

### Adding Custom ESLint Configurations

You can extend the base configuration by providing additional ESLint config objects as rest parameters:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    // Base configuration options
    typescript: "tsconfig.eslint.json",
    react: true,
  },
  // Additional custom ESLint configuration objects
  {
    name: "custom-globals",
    languageOptions: {
      globals: {
        process: "readonly",
        __dirname: "readonly",
      },
    },
  },
  {
    name: "custom-rules",
    rules: {
      // Override or add specific rules
      "no-console": ["error", { allow: ["warn", "error"] }],
      "max-len": ["warn", { code: 100 }],
      quotes: ["error", "single"],
    },
  },
  // Add as many additional configs as needed
);
```

## Prettier Configuration

### Basic Usage

Create a `prettier.config.js` file in your project root:

```js
import { prettierConfig } from "js-style-kit";

export default prettierConfig();
```

> **Note:** If you're not using `"type": "module"` in your package.json, name your file `prettier.config.mjs` instead.

Setup your `package.json` commands:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ." // run this one in your CI
  }
}
```

### Configuration Options

The `prettierConfig()` function accepts a configuration object with the following options:

```js
import { prettierConfig } from "js-style-kit";

export default prettierConfig({
  // All options shown with their default values
  cssOrderPlugin: true, // Enable CSS order plugin
  curlyPlugin: true, // Enable curly braces enforcement for all control statements
  jsonSortPlugin: true, // Enable JSON sorting plugin
  packageJsonPlugin: true, // Enable package.json sorting plugin
  tailwindPlugin: false, // Enable Tailwind CSS plugin (boolean, string[], or options object)

  // You can also pass any standard Prettier options
  printWidth: 80,
  tabWidth: 2,
  // etc.
});
```

#### Tailwind CSS Support

Tailwind CSS formatting is disabled by default. You can enable it in different ways:

```js
// Enable Tailwind with default utility functions (clsx, cva, cn)
tailwindPlugin: true

// Enable Tailwind with custom utility functions
tailwindPlugin: ["clsx", "cva", "cn", "myCustomFunction"]

// Enable Tailwind with custom options
tailwindPlugin: {
  tailwindFunctions: ["clsx", "cva", "myCustomFunction"],
  tailwindAttributes: ["tw"]
}
```

#### CSS Order Plugin

The CSS order plugin is enabled by default. It sorts CSS properties in a consistent order. You can disable it:

```js
// Disable CSS order plugin
cssOrderPlugin: false;
```

#### Curly Braces Enforcement

The curly braces plugin is disabled by default. It enforces consistent use of curly braces for all control flow statements (`if`, `for`, `while`, etc.), even for single-line statements. This is equivalent to ESLint's `curly` rule with the `all` option, but applied at the Prettier formatting level:

```diff
- if (abc) def;
+ if (abc) {
+   def;
+ }
```

You can disable it:

```js
// Disable curly braces enforcement
curlyPlugin: false;
```

#### JSON Sorting

The JSON sorting plugin is enabled by default. You can disable it or configure it:

```js
// Disable JSON sorting
jsonSortPlugin: false;

// Configure JSON sorting
jsonSortPlugin: {
  jsonRecursiveSort: true;
  // other plugin options...
}
```

#### Standard Prettier Options

You can pass any standard Prettier options directly:

```js
import { prettierConfig } from "js-style-kit";

export default prettierConfig({
  // Enable Tailwind
  tailwindPlugin: true,

  // Standard Prettier options
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  endOfLine: "lf",
});
```

## Complete Example

Here's a complete example with both ESLint and Prettier configurations:

### eslint.config.js

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    typescript: "tsconfig.eslint.json",
    react: true,
    jsdoc: { requireJsdoc: true },
    functionStyle: "arrow",
  },
  {
    name: "project-specific-rules",
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
);
```

### prettier.config.js

```js
import { prettierConfig } from "js-style-kit";

export default prettierConfig({
  tailwindPlugin: true,
  cssOrderPlugin: true,
  printWidth: 100,
  singleQuote: true,
});
```

## License

MIT
