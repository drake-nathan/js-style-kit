---
"js-style-kit": patch
---

## Dependencies Updated

- `eslint-plugin-jsdoc`: 61.1.5 → 61.1.8
- `eslint-plugin-react-hooks`: 7.0.0 → 7.0.1
- `eslint-plugin-storybook`: 9.1.13 → 9.1.15
- `prettier-plugin-curly`: 0.3.2 → 0.4.0

## Features

- Add Convex-specific filename rule: Convex files (`**/convex/**/*.{ts,js}`) now enforce camelCase naming convention via `unicorn/filename-case` when the unicorn plugin is enabled

## Infrastructure

- Remove GitHub Actions caching for node_modules because bun is faster than GitHub Actions
