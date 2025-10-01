# js-style-kit

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
