# Convex Configuration

ESLint rules for Convex backend development.

[← Back to main README](../../../README.md)

## Overview

Convex configuration is **disabled by default** and provides rules from @convex-dev/eslint-plugin, which is Convex's own ESLint plugin.

> **Note:** This plugin is currently in **alpha** and is subject to change.

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  convex: true, // Enable Convex rules
});
```

## File Scope

Convex rules apply only to files in your `convex` directory.

## Learn More

- [Convex ESLint Plugin](https://docs.convex.dev/eslint) - Official documentation
- [Main README](../../../README.md)
