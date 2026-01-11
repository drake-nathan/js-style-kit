# js-style-kit

## 0.8.11

### Patch Changes

- 97b4ad3: Updated dependencies:
  - `typescript-eslint` to 8.52.0
  - `eslint-plugin-jest` to 29.12.1
  - `eslint-plugin-jsdoc` to 62.0.0
  - `eslint-plugin-perfectionist` to 5.3.1
  - `eslint-plugin-storybook` to 10.1.11
  - `eslint-plugin-turbo` to 2.7.3
  - `globals` to 17.0.0
  - `prettier-plugin-css-order` to 2.2.0

- Updated dependencies [97b4ad3]
  - eslint-plugin-nextjs@1.1.4

## 0.8.10

### Patch Changes

- 712937b: Update dependencies:
  - `typescript-eslint` 8.49.0 → 8.50.1
  - `eslint-plugin-jest` 29.4.0 → 29.11.0
  - `eslint-plugin-perfectionist` 4.15.1 → 5.1.0
  - `eslint-plugin-react-refresh` 0.4.24 → 0.4.26
  - `eslint-plugin-storybook` 10.1.8 → 10.1.10
  - `eslint-plugin-turbo` 2.6.3 → 2.7.2

## 0.8.9

### Patch Changes

- bce9418: Update dependencies to latest versions
  - Update `@convex-dev/eslint-plugin` from 1.0.0 to 1.1.1
  - Update `@typescript-eslint/parser` from 8.48.1 to 8.49.0
  - Update `typescript-eslint` from 8.48.1 to 8.49.0
  - Update `eslint-plugin-jsdoc` from 61.4.1 to 61.5.0
  - Update `eslint-plugin-storybook` from 10.1.4 to 10.1.8

## 0.8.8

### Patch Changes

- dbbfec6: Update dependencies:
  - prettier: 3.7.3 → 3.7.4
  - @prettier/plugin-oxc: 0.1.2 → 0.1.3
  - typescript-eslint: 8.48.0 → 8.48.1
  - @typescript-eslint/parser: 8.48.0 → 8.48.1
  - eslint-plugin-storybook: 10.1.2 → 10.1.4
  - eslint-plugin-turbo: 2.6.1 → 2.6.3

## 0.8.7

### Patch Changes

- d4b94b1: Update dependencies:
  - prettier: 3.6.2 -> 3.7.3 (fixes --experimental-cli flag support)
  - @prettier/plugin-oxc: 0.0.5 -> 0.1.2
  - typescript-eslint: 8.47.0 -> 8.48.0
  - @typescript-eslint/parser: 8.47.0 -> 8.48.0
  - eslint-plugin-jest: 29.1.0 -> 29.2.1
  - eslint-plugin-jsdoc: 61.2.1 -> 61.4.1
  - eslint-plugin-storybook: 10.0.8 -> 10.1.2
  - prettier-plugin-curly: 0.4.0 -> 0.4.1
  - prettier-plugin-packagejson: 2.5.19 -> 2.5.20
  - prettier-plugin-tailwindcss: 0.7.1 -> 0.7.2
  - glob: 12.0.0 -> 13.0.0

## 0.8.6

### Patch Changes

- 6962743: Update dependencies to latest versions

  **js-style-kit:**
  - Update `@prettier/plugin-oxc` from 0.0.4 to 0.0.5
  - Update `@typescript-eslint/parser` from 8.46.4 to 8.47.0
  - Update `typescript-eslint` from 8.46.4 to 8.47.0
  - Update `eslint-plugin-jsdoc` from 61.2.0 to 61.2.1
  - Update `eslint-plugin-storybook` from 10.0.7 to 10.0.8
  - Update `glob` from 11.0.3 to 12.0.0 (dev dependency)

  **eslint-plugin-nextjs:**
  - Update `@eslint/core` from 0.17.0 to 1.0.0 (dev dependency)

- Updated dependencies [6962743]
  - eslint-plugin-nextjs@1.1.3

## 0.8.5

### Patch Changes

- e39268d: Update dependencies:
  - TypeScript ESLint packages: 8.46.3 → 8.46.4
  - eslint-plugin-jest: 29.0.1 → 29.1.0
  - eslint-plugin-jsdoc: 61.1.12 → 61.2.0
  - eslint-plugin-storybook: 10.0.3 → 10.0.7
  - eslint-plugin-turbo: 2.6.0 → 2.6.1
  - Build tooling and type definitions (tsup, @types/bun, @types/node)

## 0.8.4

### Patch Changes

- 07c3a67: Update dependencies to latest versions:
  - Updated `@typescript-eslint/parser` from 8.46.2 to 8.46.3
  - Updated `eslint` from 9.38.0 to 9.39.1
  - Updated `eslint-plugin-jsdoc` from 61.1.8 to 61.1.12
  - Updated `eslint-plugin-storybook` from 9.1.15 to 10.0.3 (major version bump)
  - Updated `eslint-plugin-turbo` from 2.5.8 to 2.6.0
  - Updated `eslint-plugin-unicorn` from 61.0.2 to 62.0.0 (major version bump)
  - Updated `globals` from 16.4.0 to 16.5.0
  - Updated `typescript-eslint` from 8.46.2 to 8.46.3
  - Updated `@types/node` from 22.18.12 to 24.10.0 (major version bump)

- Updated dependencies [07c3a67]
  - eslint-plugin-nextjs@1.1.2

## 0.8.3

### Patch Changes

- dd2aea5: Add `build/` to ignore patterns, optimize config order

## 0.8.2

### Patch Changes

- c1fe317: ## Dependencies Updated
  - `eslint-plugin-jsdoc`: 61.1.5 → 61.1.8
  - `eslint-plugin-react-hooks`: 7.0.0 → 7.0.1
  - `eslint-plugin-storybook`: 9.1.13 → 9.1.15
  - `prettier-plugin-curly`: 0.3.2 → 0.4.0

  ## Features
  - Add Convex-specific filename rule: Convex files (`**/convex/**/*.{ts,js}`) now enforce camelCase naming convention via `unicorn/filename-case` when the unicorn plugin is enabled

  ## Infrastructure
  - Remove GitHub Actions caching for node_modules because bun is faster than GitHub Actions

## 0.8.1

### Patch Changes

- 8e658f4: Fix missing Convex ESLint rule `@convex-dev/require-args-validator` and update dependencies:
  - `@typescript-eslint/parser`: 8.46.0 → 8.46.2
  - `typescript-eslint`: 8.46.0 → 8.46.2
  - `eslint-plugin-jsdoc`: 61.1.4 → 61.1.5

## 0.8.0

### Minor Changes

- 4edd771: ## New Features
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

### Patch Changes

- 345eb67: Bump `@convex-dev/eslint-plugin` to 1.0.0
- Updated dependencies [4edd771]
  - eslint-plugin-nextjs@1.1.1

## 0.7.0

### Minor Changes

- 451cb8e: Include `src` in package for better IDE navigation and "go to definition" experience.

### Patch Changes

- 9041653: Add ability to specify filename case to the unicorn eslint config
- a652e45: Add `@convex-dev/eslint-plugin` as an ESLint configuration option
- Updated dependencies [451cb8e]
  - eslint-plugin-nextjs@1.1.0

## 0.6.1

### Patch Changes

- 3e7e8b2: - Switch to pinned dependencies to protect from bad releases
  - Upgrade `prettier-plugin-tailwindcss` to 0.7.0 which patches the plugin types and removes the need for our manual patch script

## 0.6.0

### Minor Changes

- 4bc6ea3: ## New Features

  ### TanStack Query Plugin Support

  Added comprehensive support for [`@tanstack/eslint-plugin-query`](https://tanstack.com/query/v4/docs/eslint/eslint-plugin-query) to help catch common mistakes when using TanStack Query.
  - **New `query` option**: Enable TanStack Query rules via the `query: true` configuration option
  - **7 Query-specific rules** (all set to `warn`):
    - `exhaustive-deps` - Ensures query keys are exhaustive
    - `infinite-query-property-order` - Enforces consistent property ordering in infinite queries
    - `mutation-property-order` - Enforces consistent property ordering in mutations
    - `no-rest-destructuring` - Prevents rest destructuring of query results
    - `no-unstable-deps` - Warns about unstable dependencies in query keys
    - `no-void-query-fn` - Prevents void-returning query functions
    - `stable-query-client` - Ensures query client is stable across renders

  ### React Hooks v7 with React Compiler Rules

  Upgraded `eslint-plugin-react-hooks` from 6.0.0-rc.1 to 7.0.0, bringing official React compiler support.
  - **New `reactCompiler` option**: Control React compiler rules (defaults to `true` when React is enabled)
  - **10 New React Compiler rules** (all set to `warn`):
    - `error-boundaries` - Validates error boundary patterns
    - `globals` - Prevents unsafe global access
    - `immutability` - Enforces immutability patterns
    - `incompatible-library` - Warns about libraries incompatible with React compiler
    - `preserve-manual-memoization` - Preserves existing memoization patterns
    - `purity` - Enforces component purity
    - `refs` - Validates ref usage patterns
    - `set-state-in-effect` - Detects unsafe state updates in effects
    - `set-state-in-render` - Prevents state updates during render
    - `use-memo` - Suggests useMemo for expensive computations

  ## Breaking Changes
  - Removed `react/hook-use-state` rule (functionality now covered by React compiler rules)

  ## Dependencies
  - `@tanstack/eslint-plugin-query`: Added at ^5.91.0
  - `eslint-plugin-react-hooks`: 6.0.0-rc.1 → 7.0.0
  - `@typescript-eslint/parser`: 8.45.0 → 8.46.0
  - `eslint`: 9.36.0 → 9.37.0
  - `eslint-plugin-jsdoc`: 60.6.0 → 61.0.1
  - `eslint-plugin-perfectionist`: 4.15.0 → 4.15.1
  - `eslint-plugin-react-refresh`: 0.4.22 → 0.4.23
  - `eslint-plugin-storybook`: 9.1.9 → 9.1.10
  - `typescript-eslint`: 8.45.0 → 8.46.0

### Patch Changes

- Updated dependencies [4bc6ea3]
  - eslint-plugin-nextjs@1.0.6

## 0.5.3

### Patch Changes

- eca2133: Add remix/react-router option to react config

## 0.5.2

### Patch Changes

- 48b8f45: Update dependencies
- Updated dependencies [48b8f45]
  - eslint-plugin-nextjs@1.0.5

## 0.5.1

### Patch Changes

- c1a8a2b: Update dependencies
- Updated dependencies [c1a8a2b]
  - eslint-plugin-nextjs@1.0.4

## 0.5.0

### Minor Changes

- 501a652: ## 🎉 New Features

  ### ESLint Configuration
  - Fixed CLI init command (more features coming soon!)

  ### Prettier Configuration
  - Add the new OXC parser (much faster) and enabled it by default (can be disabled with `parser: "default"`)

  ## 📦 Package Updates

  ### Dependencies
  - Added `@prettier/plugin-oxc` `v0.0.4`
  - `@typescript-eslint/parser` → `8.39.0` (from `8.34.0`)
  - `eslint` → `9.32.0` (from `9.29.0`)
  - `eslint-import-resolver-typescript` → `4.4.4` (from `4.4.3`)
  - `eslint-plugin-import-x` → `4.16.1` (from `4.16.0`)
  - `eslint-plugin-jest` → `29.0.1` (from `28.8.5`)
  - `eslint-plugin-jsdoc` → `52.0.2` (from `51.0.1`)
  - `eslint-plugin-perfectionist` → `4.15.0` (from `4.14.0`)
  - `eslint-plugin-storybook` → `9.1.1` (from `9.0.9`)
  - `eslint-plugin-turbo` → `2.5.5` (from `2.5.4`)
  - `eslint-plugin-unicorn` → `60.0.0` (from `59.0.1`)
  - `globals` → `16.3.0` (from `16.2.0`)
  - `prettier` → `3.6.2` (from `3.5.3`)
  - `prettier-plugin-packagejson` → `2.5.19` (from `2.5.15`)
  - `prettier-plugin-tailwindcss` → `0.6.14` (from `0.6.12`)
  - `typescript-eslint` → `8.39.0` (from `8.34.0`)

## 0.4.2

### Patch Changes

- a58f068: Update all dependencies
- Updated dependencies [a58f068]
  - eslint-plugin-nextjs@1.0.3

## 0.4.1

### Patch Changes

- ac88f4b: Update all dependencies to latest
- Updated dependencies [ac88f4b]
  - eslint-plugin-nextjs@1.0.2

## 0.4.0

### Minor Changes

- 2df9b74: - Remove react-compiler plugin in favor of the same rule in the react-hooks plugin
  - Remove react compiler config options, to disable, just turn off the rule ("react-hooks/react-compiler": "off")

## 0.3.0

### Minor Changes

- 43899bd: Add new `rules` property to the eslint config options which routes rules to their respective configs.

### Patch Changes

- 391399a: Reconfigure TSUP to exclude dependencies from bundle. Add `eslint-plugin-import-x` to style kit.
- 924f681: Update cli to not create style-kit.config file
- da8c614: Consolidate eslint ignores, add some rule types, and update packages.
- Updated dependencies [391399a]
  - eslint-plugin-nextjs@1.0.1

## 0.2.12

### Patch Changes

- Updated dependencies [7ea2ade]
  - eslint-plugin-nextjs@1.0.0

## 0.2.11

### Patch Changes

- f02ee1a: Update `eslint-plugin-nextjs` version

## 0.2.10

### Patch Changes

- 1f2b572: Implement `eslint-plugin-nextjs` in eslint config
- Updated dependencies [1f2b572]
  - eslint-plugin-nextjs@0.1.1

## 0.2.9

### Patch Changes

- a76d254: disable react refresh by default

## 0.2.8

### Patch Changes

- 984914e: Fix storybook plugin config

## 0.2.7

### Patch Changes

- ef405c7: Add `eslint-plugin-react-refresh`

## 0.2.6

### Patch Changes

- 9edcf99: Move tailwind patch script from postinstall to run with prettier config init.

## 0.2.5

### Patch Changes

- 18e4f60: Add `eslint-plugin-storybook` to ESLint config options.

## 0.2.4

### Patch Changes

- e5629f1: Add `prettier-plugin-curly` to prettier config by default.

## 0.2.3

### Patch Changes

- 33bbab3: Patch tailwind postinstall script

## 0.2.2

### Patch Changes

- 0fb16b1: tweak ci and release gh action

## 0.2.1

### Patch Changes

- 5416cf8: Fix bug in prettier-plugin-tailwind implementation

## 0.2.0

### Minor Changes

- 4a94737: Add CLI tool to install style kit with proper settings

### Patch Changes

- c1ee66b: Add `eslint-plugin-unicorn`
- e943525: Add support for `eslint-plugin-turbo`

## 0.1.6

### Patch Changes

- f60afd4: Update testing config to includes jest rules

## 0.1.5

### Patch Changes

- 87480a0: Add `eslint-plugin-vitest` with new config

## 0.1.4

### Patch Changes

- 5f1685f: Refine docs for alpha release

## 0.1.3

### Patch Changes

- e04635d: Change `react` to accept options, optimize "camelcase" rule.

## 0.1.2

### Patch Changes

- ddfc826: Add prettier-plugin-css-order

## 0.1.1

### Patch Changes

- d758c68: Add prefer-arrow-functions to autofix function preference

## 0.1.0

### Minor Changes

- c2c4d64: Add ability to add extra configs to ESLint.

## 0.0.6

### Patch Changes

- 018dd51: Finish JSDoc rules

## 0.0.5

### Patch Changes

- 5ba206a: change some types and add jsdoc and react compiler

## 0.0.4

### Patch Changes

- e8a039c: Add package.json fields for GH package link

## 0.0.3

### Patch Changes

- 4e7ba03: Continue on ESLint setup

## 0.0.2

### Patch Changes

- 29e115b: Initial release
