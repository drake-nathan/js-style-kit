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

For detailed usage and configuration options, see the [package documentation](./packages/style-kit/README.md).

> **Note:** This is very much a work in progress. I want to know what configuration changes you make, so please open an issue!

## Basic Setup

```bash
npm install js-style-kit --save-dev
# or
yarn add js-style-kit --dev
# or
pnpm add js-style-kit --save-dev
# or
bun add js-style-kit --dev
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

## Repository Structure

This is a monorepo managed with Turborepo and bun.

```sh
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
bun i

# Build all packages
bun run build

# Run tests
bun run test

# Format code
turbo run format

# Lint code
turbo run lint

# Create a changeset
bun run changeset
```

## License

MIT © [Nathan Drake](https://github.com/drake-nathan)
