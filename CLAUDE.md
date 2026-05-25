# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for `js-style-kit`, a zero-configuration style guide for **oxlint and oxfmt**. The repository is managed with Turborepo and uses Bun as the package manager.

> **In-progress migration:** the codebase is being converted from `prettier` + `eslint` to `oxfmt` + `oxlint`. This is a breaking, non-backwards-compatible rewrite. See [docs/OXLINT_MIGRATION.md](docs/OXLINT_MIGRATION.md) for the plan, task breakdown, and per-task context. Until the migration completes, parts of the live code still reference the old toolchain.

### Main Packages

- **js-style-kit** (`packages/style-kit/`) - The main package providing oxlint and oxfmt configurations
- **typescript-config** (`packages/typescript-config/`) - Shared TypeScript configurations

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
cd packages/style-kit
bun run build
bun run test
bun run typecheck
```

## Architecture Overview

### Monorepo Structure

- **Root workspace** - Manages shared dependencies and scripts
- **packages/style-kit/** - Core oxlint/oxfmt configuration system
- **packages/typescript-config/** - Shared TypeScript configurations
- **apps/** - Test applications for validating configurations (`next-test-app`, `vite-test-app`; a `vite-plus-test-app` is planned)

### Style-Kit Architecture

The main package (`packages/style-kit/`) exposes three factories:

- `oxlintConfig(options)` — returns a single oxlint config object (with `overrides[]` for file-pattern scoping)
- `oxfmtConfig(options)` — returns an oxfmt config object
- `styleKit(options)` — unified entry point that takes shared options (tailwind, react framework, etc.) and returns `{ oxlint, oxfmt }`, so a Vite+ user can wire both inline in `vite.config.ts`

Consumer surface:

- Standalone `oxlint.config.ts` / `oxfmt.config.ts` calling the matching factory
- Vite+ users call `styleKit()` inside `vite.config.ts`

Key files:

- `src/index.ts` - Main entry point
- `src/oxlint/index.ts` - oxlint factory
- `src/oxfmt/index.ts` - oxfmt factory
- `bin/index.ts` - CLI for project initialization (detects Vite+ vs standalone path)

## Build System

- **Turborepo** - Build pipeline and caching
- **tsup** - TypeScript bundler
- **Bun** - Package manager and test runner
- **Changesets** - Version management and changelog generation

### Build Outputs

- Packages build to `dist/` directories
- Style-kit includes both main package and CLI binary
- Source maps are generated for debugging

## Testing Strategy

- **Bun test** - Primary test runner
- **Coverage reporting** - LCOV format for CI integration
- **Shape tests** - Assert factory output structure (rules present, overrides shaped correctly)
- **Integration tests** - Run oxlint and oxfmt against the apps in `apps/` against known-good and known-bad fixtures

## CI/CD Pipeline

The `scripts/ci.js` provides a comprehensive CI check that runs:

1. Format checking
2. Linting
3. Testing
4. Sherif (dependency checks)
5. Building

This script provides colored output and tracks timing/caching for each step.
