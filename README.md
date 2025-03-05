![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/drake-nathan/js-style-kit?labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit%20Reviews)

# JS Style Kit

A zero-configuration ESLint and Prettier toolkit for JavaScript and TypeScript projects.

[![CI](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml)
[![Release](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml)
[![npm version](https://img.shields.io/npm/v/js-style-kit.svg)](https://www.npmjs.com/package/js-style-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

JS Style Kit is a comprehensive, batteries-included linting and formatting solution for modern JavaScript and TypeScript projects. It provides:

- Zero-config ESLint setup with sensible defaults
- TypeScript support out of the box
- React and React Compiler support
- JSDoc validation
- Perfectionist sorting rules
- Prettier configuration with plugin support

## Getting Started

```bash
# npm
npm install --save-dev js-style-kit

# yarn
yarn add --dev js-style-kit

# pnpm
pnpm add --save-dev js-style-kit
```

### ESLint Configuration

Create an `eslint.config.js` (or `eslint.config.mjs`) file at the root of your project:

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  // options
});
```

### Prettier Configuration

Create a `prettier.config.js` (or `prettier.config.mjs`) file at the root of your project:

```js
import { prettierConfig } from "js-style-kit";

export default prettierConfig({
  // options
});
```

## Documentation

For detailed usage and configuration options, see the [package documentation](./packages/style-kit/README.md).

## Repository Structure

This is a monorepo managed with Turborepo and pnpm.

```
/
├── apps/
│   └── docs/             # Documentation site built with Docusaurus (WIP)
├── packages/
│   ├── style-kit/        # Main package with ESLint and Prettier configurations
│   └── typescript-config/ # Shared TypeScript configurations
├── .changeset/          # Changesets for versioning
├── .github/             # GitHub Actions workflows
└── turbo.json           # Turborepo configuration
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Format code
pnpm format

# Lint code
pnpm lint

# Create a changeset
pnpm changeset
```

## License

MIT © [Nathan Drake](https://github.com/drake-nathan)
