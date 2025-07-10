# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for `js-style-kit`, a zero-configuration style guide for ESLint and Prettier. The repository is managed with Turborepo and uses Bun as the package manager.

### Main Packages

- **js-style-kit** (`packages/style-kit/`) - The main package providing ESLint and Prettier configurations
- **eslint-plugin-nextjs** (`packages/eslint-plugin-nextjs/`) - A fork of `@nextjs/eslint-plugin-nextjs` with TypeScript and ESLint v9 support

## Common Development Commands

### Building and Development

```bash
# Build all packages
bun run build

# Build only the main style-kit package
bun run build:stylekit

# Run development mode for all packages
bun run dev
```

### Testing and Quality Checks

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run linting
bun run lint

# Fix lint issues
bun run lint:fix

# Format code
bun run format

# Check formatting
bun run format:check

# Run all CI checks (comprehensive check script)
bun run ci
```

### Package Management

```bash
# Check for outdated dependencies
bun run outdated

# Check for duplicate dependencies across workspaces
bun run sherif

# Create a new changeset for versioning
bun run changeset
```

### Single Package Development

```bash
# For style-kit package
cd packages/style-kit
bun run build
bun run test
bun run typecheck

# For eslint-plugin-nextjs package
cd packages/eslint-plugin-nextjs
bun run build
bun run test
```

## Architecture Overview

### Monorepo Structure

- **Root workspace** - Manages shared dependencies and scripts
- **packages/style-kit/** - Core ESLint/Prettier configuration system
- **packages/eslint-plugin-nextjs/** - Next.js ESLint plugin
- **packages/typescript-config/** - Shared TypeScript configurations
- **apps/** - Test applications for validating configurations
- **docs/** - Documentation site built with Mintlify

### Style-Kit Architecture

The main package (`packages/style-kit/`) follows a modular configuration system:

- **src/eslint/** - ESLint configuration modules organized by plugin/feature
  - Each plugin has its own subdirectory (base/, import/, react/, etc.)
  - Configurations are composable and can be enabled/disabled via options
- **src/prettier/** - Prettier configuration with plugin support
- **bin/** - CLI tool for initializing projects with the style guide

Key files:

- `src/index.ts` - Main entry point exporting ESLint and Prettier configs
- `src/eslint/index.ts` - Main ESLint configuration factory function
- `bin/index.ts` - CLI tool for project initialization

### ESLint Plugin NextJS Architecture

The NextJS plugin (`packages/eslint-plugin-nextjs/`) structure:

- **src/rules/** - Individual ESLint rule implementations
- **src/utils/** - Shared utilities for rules
- **test/** - Comprehensive test suites including custom pages structures

## Build System

- **Turborepo** - Manages build pipeline and caching
- **tsup** - TypeScript bundler for packages
- **Bun** - Package manager and test runner
- **Changesets** - Version management and changelog generation

### Build Outputs

- Packages build to `dist/` directories
- Style-kit includes both main package and CLI binary
- Source maps are generated for debugging

## Testing Strategy

- **Bun test** - Primary test runner
- **Coverage reporting** - LCOV format for CI integration
- **ESLint rule testing** - Uses custom rule test utilities
- **Integration testing** - Test apps validate real-world usage

## CI/CD Pipeline

The `scripts/ci.js` provides a comprehensive CI check that runs:

1. Format checking
2. Linting
3. Testing
4. Sherif (dependency checks)
5. Building

This script provides colored output and tracks timing/caching for each step.
