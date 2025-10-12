# `js-style-kit`

A zero-configuration style guide for ESLint and Prettier that provides sensible default settings and flexible configuration options.

[![CI](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml)
[![Release](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml)
[![npm version](https://img.shields.io/npm/v/js-style-kit.svg)](https://www.npmjs.com/package/js-style-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/drake-nathan/js-style-kit/graph/badge.svg?token=C57D67JAE0)](https://codecov.io/gh/drake-nathan/js-style-kit)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/drake-nathan/js-style-kit?labelColor=5C5C5C&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit%20Reviews)

## Overview

This repo consists of two packages:

- [`js-style-kit`](./packages/style-kit/README.md) - The main package of this repo, a prettier/eslint style guide.
- [`eslint-plugin-nextjs`](./packages/eslint-plugin-nextjs/README.md) - A fork of `@next/eslint-plugin-next` with TypeScript and ESLint v9 support.

## Repository Structure

This is a monorepo managed with Turborepo and bun.

```sh
/
├── apps/
│   ├── next-test-app/        # Next.js app for testing
│   └── vite-test-app/        # Vite app for testing
├── packages/
│   ├── eslint-plugin-nextjs/ # Fork of @nextjs/eslint-plugin-nextjs with TypeScript and ESLint v9 support
│   ├── style-kit/            # Main package with ESLint and Prettier configurations
│   └── typescript-config/    # Shared TypeScript configurations for the monorepo
├── .changeset/               # Changesets for versioning
├── .github/                  # GitHub Actions workflows
└── turbo.json                # Turborepo configuration
```
