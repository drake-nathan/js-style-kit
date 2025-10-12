# Prettier Configuration

Opinionated Prettier configuration with powerful plugins for CSS ordering, JSON sorting, Tailwind class sorting, and more.

[← Back to main README](../../README.md)

## Overview

The Prettier configuration includes:

- **Faster parser** - OXC parser for improved performance (optional)
- **CSS ordering** - Consistent property order
- **Curly braces** - Enforce braces for all control statements
- **JSON sorting** - Alphabetical key sorting
- **Package.json** - Consistent dependency ordering
- **Tailwind CSS** - Class name sorting (optional)

## Quick Start

```js
// @ts-check
import { prettierConfig } from "js-style-kit";

export default prettierConfig();
```

## Configuration Options

```js
// @ts-check
import { prettierConfig } from "js-style-kit";

export default prettierConfig({
  // Plugin options (all boolean or config object)
  cssOrderPlugin: true, // Sort CSS properties
  curlyPlugin: true, // Enforce curly braces
  jsonSortPlugin: true, // Sort JSON keys
  packageJsonPlugin: true, // Sort package.json
  tailwindPlugin: false, // Tailwind class sorting
  parser: "oxc", // "oxc" (faster) or "default"

  // Standard Prettier options
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  // ... any Prettier option
});
```

## Parser Options

### OXC Parser (Default)

The **OXC parser** is a faster alternative to Prettier's default parser:

```js
// @ts-check
export default prettierConfig({
  parser: "oxc", // Default - faster performance
});
```

**Benefits:**

- ⚡ Significantly faster than default parser
- ✅ 100% compatible with Prettier
- ✅ Written in Rust for performance

### Default Parser

Use Prettier's standard parser:

```js
// @ts-check
export default prettierConfig({
  parser: "default", // Standard Prettier parser
});
```

## Plugin Features

### CSS Property Ordering

**Enabled by default** - Sorts CSS properties in a consistent order:

```css
/* ✅ Good - properties sorted */
.button {
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: blue;
  padding: 1rem;
}

/* Before formatting - unsorted */
.button {
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: blue;
  padding: 1rem;
}
```

Disable:

```js
cssOrderPlugin: false;
```

### Curly Braces Enforcement

**Enabled by default** - Enforces curly braces for all control statements:

```js
// ✅ Good - always has braces
if (condition) {
  doSomething();
}

for (const item of items) {
  process(item);
}

// Before formatting - missing braces
if (condition) doSomething();
for (const item of items) process(item);
```

This is equivalent to ESLint's `curly: "all"` rule but applied at the formatting level.

Disable:

```js
curlyPlugin: false;
```

### JSON Sorting

**Enabled by default** - Sorts JSON object keys alphabetically:

```json
// ✅ Good - keys sorted
{
  "apiUrl": "https://api.example.com",
  "environment": "production",
  "features": {
    "analytics": true,
    "darkMode": false
  },
  "timeout": 5000
}

// Before formatting - unsorted
{
  "timeout": 5000,
  "environment": "production",
  "features": {
    "darkMode": false,
    "analytics": true
  },
  "apiUrl": "https://api.example.com"
}
```

**Recursive sorting** is enabled by default (sorts nested objects too).

#### Customize JSON Sorting

```js
jsonSortPlugin: {
  jsonRecursiveSort: true,        // Sort nested objects
  jsonSortOrder: "{ ... }",       // Custom sort order (advanced)
}
```

#### Disable

```js
jsonSortPlugin: false;
```

### Package.json Sorting

**Enabled by default** - Sorts package.json with smart dependency ordering:

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "...",
  "main": "index.js",
  "scripts": { ... },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

Follows npm/yarn conventions for field ordering.

Disable:

```js
packageJsonPlugin: false;
```

### Tailwind CSS Class Sorting

**Disabled by default** - Sorts Tailwind classes following official recommendations:

```jsx
// ✅ Good - classes sorted
<div className="flex items-center justify-between p-4 bg-blue-500 rounded-lg" />

// Before formatting - unsorted
<div className="p-4 bg-blue-500 flex rounded-lg items-center justify-between" />
```

#### Enable with path to global css file for Tailwind v4

```js
tailwindPlugin: "./src/index.css";
```

#### Specify Utility Functions

```js
tailwindPlugin: ["clsx", "cva", "cn", "myCustomUtil"];
```

#### Advanced Configuration

```js
tailwindPlugin: {
  tailwindFunctions: ["clsx", "cva", "tw"],
  tailwindAttributes: ["className", "class", "tw"],
  tailwindStylesheet: "./styles/tailwind.css",
}
```

## Standard Prettier Options

All standard Prettier options are supported:

```js
export default prettierConfig({
  // Plugins (documented above)
  tailwindPlugin: true,

  // Standard options
  printWidth: 100, // Line length
  tabWidth: 2, // Spaces per tab
  useTabs: false, // Use spaces
  semi: true, // Semicolons
  singleQuote: false, // Double quotes
  quoteProps: "as-needed", // Quote object properties
  trailingComma: "all", // Trailing commas
  bracketSpacing: true, // { foo: bar }
  bracketSameLine: false, // JSX bracket on new line
  arrowParens: "always", // (x) => x
  endOfLine: "lf", // Unix line endings
  proseWrap: "preserve", // Markdown wrapping
});
```

## Common Configurations

### Minimal (Disable Plugins)

```js
export default prettierConfig({
  cssOrderPlugin: false,
  curlyPlugin: false,
  jsonSortPlugin: false,
  packageJsonPlugin: false,
  parser: "default",
});
```

### Tailwind Project

```js
export default prettierConfig({
  tailwindPlugin: true,
  printWidth: 100,
  singleQuote: true,
});
```

### Library/Package

```js
export default prettierConfig({
  packageJsonPlugin: true,
  jsonSortPlugin: true,
  singleQuote: true,
  trailingComma: "es5",
});
```

### Next.js Project

```js
export default prettierConfig({
  tailwindPlugin: {
    tailwindFunctions: ["cn", "clsx"],
  },
  printWidth: 100,
});
```

## Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

Run `format:check` in CI to verify formatting.

## VS Code Integration

Add to `.vscode/settings.json`:

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Ignore Files

Create `.prettierignore`:

```
# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
build
.next
out

# Misc
coverage
.cache
```

## Plugin Documentation

Each plugin has additional options:

- **OXC Parser** - [Documentation](https://www.npmjs.com/package/@prettier/plugin-oxc)
- **CSS Order** - [Documentation](https://www.npmjs.com/package/prettier-plugin-css-order)
- **Curly** - [Documentation](https://www.npmjs.com/package/prettier-plugin-curly)
- **JSON Sort** - [Documentation](https://www.npmjs.com/package/prettier-plugin-sort-json)
- **Package.json** - [Documentation](https://www.npmjs.com/package/prettier-plugin-packagejson)
- **Tailwind** - [Documentation](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

## Troubleshooting

### Prettier not formatting

1. Check `.prettierignore` isn't excluding files
2. Verify VS Code is using the right formatter
3. Check for conflicting Prettier configs

### Tailwind classes not sorting

1. Ensure `tailwindPlugin` is set to your global css file path
2. Reload your IDE
3. Run the prettier CLI to see if there's an error

### OXC parser issues

Switch to default parser:

```js
parser: "default";
```

### Plugin conflicts

Disable plugins one-by-one to identify conflicts:

```js
cssOrderPlugin: false,
curlyPlugin: false,
// etc.
```

## Learn More

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Main README](../../README.md)
