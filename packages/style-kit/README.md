# `js-style-kit`

A zero-configuration style guide for ESLint and Prettier that provides sensible default settings and flexible configuration options.

## Features

- ✅ All dependencies included (ESLint, Prettier, plugins) - no need to install extras
- ✅ TypeScript support out of the box
- ✅ Optional React and React Compiler support
- ✅ JSDoc validation with configurable requirements
- ✅ Automatic import, prop, and object sorting with Perfectionist
- ✅ Tailwind CSS support for Prettier
- ✅ Modern ESM-only package

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
  react: false, // Whether to include React rules
  reactCompiler: undefined, // When react is true, controls React compiler rules
  sorting: true, // Whether to include sorting rules from Perfectionist
  typescript: true, // Boolean or string path to tsconfig.json
});
```

#### Function Style Configuration

Controls how functions should be written:

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

React support is disabled by default:

```js
// Enable React support
react: true

// With React enabled, React Compiler is automatically included
// Disable React Compiler explicitly:
react: true,
reactCompiler: false
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

#### Perfectionist (Code Organization)

Sorting/organization rules from the Perfectionist plugin are enabled by default:

```js
// Disable sorting rules
sorting: false;
```

### Adding Custom ESLint Configurations

You can extend the base configuration by providing additional ESLint config objects as rest parameters:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    // Base configuration options
    typescript: "./tsconfig.json",
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

### Configuration Options

The `prettierConfig()` function accepts a configuration object with the following options:

```js
import { prettierConfig } from "js-style-kit";

export default prettierConfig({
  // All options shown with their default values
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
    typescript: "./tsconfig.json",
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
  printWidth: 100,
  singleQuote: true,
});
```

## License

MIT
