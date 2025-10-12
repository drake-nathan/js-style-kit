---
"js-style-kit": minor
---

## New Features

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

## Bug Fixes

- **Storybook configuration**: Fixed incorrect rule name `import/no-anonymous-default-export` to use the correct `import-x/no-anonymous-default-export` (packages/style-kit/src/eslint/storybook/config.ts:30)

## Documentation

- **Removed Mintlify docs site**: The `docs/` directory and all Mintlify documentation have been removed in favor of improved README files
- **Enhanced README documentation**:
  - Updated main package README with streamlined content (packages/style-kit/README.md)
  - Added CLI tool README (packages/style-kit/bin/README.md)
  - Added comprehensive per-plugin READMEs with all rule documentation:
    - Base ESLint rules (packages/style-kit/src/eslint/base/README.md)
    - Import/Export rules (packages/style-kit/src/eslint/import/README.md)
    - JSDoc rules (packages/style-kit/src/eslint/jsdoc/README.md)
    - Perfectionist rules (packages/style-kit/src/eslint/perfectionist/README.md)
    - TanStack Query rules (packages/style-kit/src/eslint/query/README.md)
    - React rules (packages/style-kit/src/eslint/react/README.md)
    - Storybook rules (packages/style-kit/src/eslint/storybook/README.md)
    - Testing rules (packages/style-kit/src/eslint/testing/README.md)
    - Turbo rules (packages/style-kit/src/eslint/turbo/README.md)
    - TypeScript rules (packages/style-kit/src/eslint/typescript/README.md)
    - Unicorn rules (packages/style-kit/src/eslint/unicorn/README.md)
  - Added Prettier configuration README (packages/style-kit/src/prettier/README.md)

## Dependencies

- `@tanstack/eslint-plugin-query`: Added at ^5.91.0
- `eslint-plugin-react-hooks`: 6.0.0-rc.1 → 7.0.0
- `eslint-plugin-jsdoc`: 61.0.1 → 61.1.1
- `@types/node`: 22.18.8 → 22.18.10
- `@typescript-eslint/parser`: 8.45.0 → 8.46.0
- `eslint`: 9.36.0 → 9.37.0
- `eslint-plugin-perfectionist`: 4.15.0 → 4.15.1
- `eslint-plugin-react-refresh`: 0.4.22 → 0.4.23
- `eslint-plugin-storybook`: 9.1.9 → 9.1.10
- `typescript-eslint`: 8.45.0 → 8.46.0
