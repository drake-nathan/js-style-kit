# eslint-plugin-nextjs

## 1.1.2

### Patch Changes

- 07c3a67: Update dependencies to latest versions:
  - Updated `@eslint/core` from 0.16.0 to 0.17.0
  - Updated `eslint` from 9.38.0 to 9.39.1
  - Updated `@types/node` from 22.18.12 to 24.10.0 (major version bump)

## 1.1.1

### Patch Changes

- 4edd771: ## Dependency Updates
  - Updated `eslint` from 9.37.0 to 9.38.0

## 1.1.0

### Minor Changes

- 451cb8e: Include `src` in package for better IDE navigation and "go to definition" experience.

## 1.0.6

### Patch Changes

- 4bc6ea3: Update dependencies

## 1.0.5

### Patch Changes

- 48b8f45: Update dependencies

## 1.0.4

### Patch Changes

- c1a8a2b: Update dependencies

## 1.0.3

### Patch Changes

- a58f068: Update all dependencies

## 1.0.2

### Patch Changes

- ac88f4b: Update all dependencies to latest

## 1.0.1

### Patch Changes

- 391399a: Reconfigure TSUP to exclude dependencies from bundle. Add `eslint-plugin-import-x` to style kit.

## 1.0.0

### Major Changes

- 7ea2ade: # V1 - ESLint V9 / TypeScript upgrades

  ## Changes
  - Merged old configs to a single `recommended` flat config (no legacy support, use 0.1.2 for legacy support).
  - All rules now "warn" by default, which is best practice so that you can distinguish between ESLint issues and TypeScript issues.
  - Now exports in ESM only. This is easy to use in with the flat config.
  - I intended to ship with full TS coverage, but `@typescript-eslint/utils` nuked my builds and I couldn't get there.

  ## Migration

  Only use this version if you plan to roll your own ESLint config with ESM and ESLint v9 using flat config. If you need CJS or legacy, refer to v0.1.2.

  If you're not rolling your own config, just use what you get from Next.js. I still hope they will update their plugin soon.

  To use this plugin with the new format, simply add it to your config:

  ```js
  // eslint.config.js/mjs
  import nextjs from "eslint-plugin-nextjs";

  export default [
    // ... other configs
    nextjs.configs.recommended,
  ];
  ```

  If you're project has `"type": "module"` in `package.json`, you can use `eslint.config.js`, otherwise use `eslint.config.mjs` which will allow you to use ESM syntax in that file.

## 0.1.2

### Patch Changes

- 9228672: Fix plugin rule naming

## 0.1.1

### Patch Changes

- 1f2b572: Refine README

## 0.1.0

### Minor Changes

- bbf34f0: Copy original source code and adjust for new repo.

## 0.0.1

### Patch Changes

- 12e2986: init package
