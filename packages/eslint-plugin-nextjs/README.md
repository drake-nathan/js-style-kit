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

## Requirements

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

> **Note**: The API _will_ break in v1. I want to clean up this API follow ESLint standards.

This plugin ships two configs for both legacy and flat ESLint configuration formats:

- "recommended" or "recommended/flat" - includes most rules from Next.js
- "core-web-vitals" or "core-web-vitals/flat" - same thing but two rules get upgraded to errors 🤷‍♂️

You probably want Core Web Vitals (that's what ships inside of `eslint-config-next`), but you never need both.

### Legacy Config

```js
{
  extends: ["nextjs/core-web-vitals"],
}
```

### Flat Config

```js
import nextjs from "eslint-plugin-nextjs";

export default [
  // ... other configs
  nextjs.configs["core-web-vitals/flat"],
];
```

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
      "nextjs/google-font-display": "warn",
      "nextjs/no-img-element": "warn",
    },
  },
];
```

## Rules

See Vercel's [documentation](https://nextjs.org/docs/app/api-reference/config/eslint#rules) for rule details. I'll add a proper rule table here in the future.
