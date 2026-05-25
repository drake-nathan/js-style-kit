---
"js-style-kit": major
---

Convert `js-style-kit` to oxlint + oxfmt.

This is a breaking rewrite. The package no longer ships ESLint or Prettier
configuration — it now exposes three factories built around the oxc
toolchain:

- `oxlintConfig(options)` — returns a single oxlint config object (with
  `overrides[]` for file-pattern scoping).
- `oxfmtConfig(options)` — returns an oxfmt config object.
- `styleKit(options)` — unified entry point that returns
  `{ oxlint, oxfmt }`, so a Vite+ user can wire both inline in
  `vite.config.ts`.

There is no backwards-compatibility layer with prettier/eslint. Consumers
upgrading from v1 should follow `docs/MIGRATION_FROM_V1.md` and the
conversion plan in `docs/OXLINT_MIGRATION.md`.
