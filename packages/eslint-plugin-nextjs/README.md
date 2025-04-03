# `eslint-plugin-nextjs`

[![CI](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml)
[![Release](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/release.yaml)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-nextjs.svg)](https://www.npmjs.com/package/eslint-plugin-nextjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/drake-nathan/js-style-kit/graph/badge.svg?token=C57D67JAE0)](https://codecov.io/gh/drake-nathan/js-style-kit)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/drake-nathan/js-style-kit?labelColor=5C5C5C&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit%20Reviews)

## Overview

This is a unofficial fork of [`@next/eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next) with TypeScript and ESLint v9 support. I have no association with Vercel or the Next.js team. I just needed an updated version of the plugin for my style guide, [`js-style-kit`](https://js-style-kit.mintlify.app/introduction).

If you're using `eslint-config-next`, you _do not_ need this plugin.
You only need this plugin if you're rolling your own ESLint config.

Beginning with v1, this plugin is ESM only and requires ESLint v9. If you need legacy support, use v0.1.2.

## Requirements

- ESLint v9
- Node.js v20.11.0 or higher

## Installation

```bash
npm i eslint eslint-plugin-nextjs -D
# or
yarn add eslint eslint-plugin-nextjs -D
# or
pnpm add eslint eslint-plugin-nextjs -D
# or
bun add eslint eslint-plugin-nextjs -d
```

## Usage

I've cleaned up the API, so it's not 1:1 with the original plugin, but all of the rules remain the same (with upgraded type-safety).

The original plugin ships two configs, recommended and core-web-vitals. They're the same but the latter has two rules upgraded to errors. I've consolidated this to a single "recommended" config with all rules warnings by default.

My belief is that all ESLint rules should be warnings to allow you to distinguish between ESLint issues and TypeScript issues easily in your IDE (orange squiggly vs red squiggly).

If you're migrating from either config, all rules will still be enabled. I didn't changed any core functionality.

### Flat Config

```js
// eslint.config.js/mjs
import nextjs from "eslint-plugin-nextjs";

export default [
  // ... other configs
  nextjs.configs.recommended,
];
```

If you're project has `"type": "module"` in `package.json`, you can use `eslint.config.js`, otherwise use `eslint.config.mjs` which will allow you to use ESM syntax in that file.

### Custom Config

```js
import nextjs from "eslint-plugin-nextjs";

export default [
  // ... other configs
  {
    plugins: {
      nextjs,
    },
    rules: {
      // note that the prefix is different, the original plugin uses "@next/next/"
      "nextjs/google-font-display": "warn",
      "nextjs/no-img-element": "warn",
    },
  },
];
```

## Rules

See Vercel's [documentation](https://nextjs.org/docs/app/api-reference/config/eslint#rules) for rule details. I'll add a proper rule table here in the future.
