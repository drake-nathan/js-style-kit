---
"js-style-kit": minor
---

## New Features

- Added automatic test import restrictions to prevent importing from incorrect testing frameworks (e.g., importing `jest` utilities when configured for `vitest`)
  - New `importRestrictions` option in testing config (enabled by default)
  - Configurable via `testing.importRestrictions` in eslint config options
- Added support for React Router framework with `.react-router` directory in ignore patterns

## Improvements

- Enhanced testing configuration with explicit `typescript` option for conditional TypeScript-specific rule application
- Improved test coverage across jsdoc, react, typescript, and unicorn configurations
- Added `ReactFramework` type for better type safety when configuring React frameworks

## Dependency Updates

- Updated `eslint` from 9.37.0 to 9.38.0
- Updated `eslint-plugin-storybook` from 9.1.12 to 9.1.13
- Updated `prettier-plugin-tailwindcss` from 0.7.0 to 0.7.1

## Internal

- Added typecheck step to CI workflow
- Reorganized test files for better maintainability
