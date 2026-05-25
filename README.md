# `js-style-kit`

A zero-configuration style guide for [oxlint](https://oxc.rs) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter).

[![CI](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml)
[![Release](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml)
[![npm version](https://img.shields.io/npm/v/js-style-kit.svg)](https://www.npmjs.com/package/js-style-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Status

`js-style-kit` v2 is a breaking rewrite that swaps ESLint + Prettier for oxlint + oxfmt. If you're on v1, see [MIGRATION_FROM_V1.md](./docs/MIGRATION_FROM_V1.md). The conversion plan and outstanding decisions live in [OXLINT_MIGRATION.md](./docs/OXLINT_MIGRATION.md).

## Overview

This monorepo ships:

- [`js-style-kit`](./packages/style-kit/README.md) — the main package. Three factory exports (`oxlintConfig`, `oxfmtConfig`, `styleKit`) for wiring oxlint and oxfmt.
- [`@repo/typescript-config`](./packages/typescript-config/) — shared TypeScript configs used by the monorepo's apps and packages.

## Repository Structure

```sh
/
├── apps/
│   ├── next-test-app/        # Next.js app for validating configs
│   ├── vite-test-app/        # Vite app for validating configs
│   └── vite-plus-test-app/   # Vite+ fixture for the inline-config path
├── packages/
│   ├── style-kit/            # Main package: oxlint + oxfmt factories
│   └── typescript-config/    # Shared TypeScript configurations
├── docs/
│   ├── OXLINT_MIGRATION.md   # Conversion plan + open questions
│   └── MIGRATION_FROM_V1.md  # Upgrade guide for v1 users
├── .changeset/               # Changesets for versioning
├── .github/                  # GitHub Actions workflows
└── turbo.json                # Turborepo configuration
```

## Local Development

```bash
bun install
bun run build:stylekit
bun run test
```

See [CLAUDE.md](./CLAUDE.md) for the full list of repo-level commands.

## License

MIT
