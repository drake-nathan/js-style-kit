# `js-style-kit`

A zero-configuration style guide for [oxlint](https://oxc.rs/docs/guide/usage/linter) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter).

[![CI](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml/badge.svg)](https://github.com/drake-nathan/js-style-kit/actions/workflows/ci.yaml)
[![npm version](https://img.shields.io/npm/v/js-style-kit.svg)](https://www.npmjs.com/package/js-style-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Upgrading from v1 (ESLint + Prettier)? See [MIGRATION_FROM_V1.md](../../docs/MIGRATION_FROM_V1.md).

## Features

- **Three factory exports** — `oxlintConfig`, `oxfmtConfig`, and a unified `styleKit` that drives both from one options bag.
- **Native plugins first** — TypeScript, import, unicorn, jsdoc, react, react-hooks, react-refresh, nextjs, jsx-a11y, vitest, jest all come from oxlint's built-in Rust plugins (fast).
- **JS-plugin alpha bridge** — Perfectionist (non-import sorting), prefer-arrow-functions, the upstream `eslint-plugin-react-hooks` (aliased for React 19 rules), oxlint-tailwindcss, plus opt-in @tanstack/query, convex, storybook, and turbo.
- **One shared knob for tailwind** — toggles both lint rules and class sorting.
- **CLI** — `bunx js-style-kit init` scaffolds standalone config files, or detects Vite+ and prints inline instructions instead.

## Install

```bash
bun add --dev js-style-kit oxlint oxfmt
# or
npm install --save-dev js-style-kit oxlint oxfmt
```

For type-aware TypeScript rules, also install `oxlint-tsgolint`:

```bash
bun add --dev oxlint-tsgolint
```

Optional peer deps — install only the ones you opt in to via options:

| Option | Required peer |
| --- | --- |
| `react` (any framework) | `eslint-plugin-react-hooks` |
| `sorting` (default on) | `eslint-plugin-perfectionist` |
| `functionStyle: "arrow"` (default) | `eslint-plugin-prefer-arrow-functions` |
| `tailwind: true` | `oxlint-tailwindcss` |
| `query: true` | `@tanstack/eslint-plugin-query` |
| `convex: true` | `@convex-dev/eslint-plugin` |
| `storybook: true` | `eslint-plugin-storybook` |
| `turbo: true` | `eslint-plugin-turbo` |

## Quick Start

### Option 1 — CLI

```bash
bunx js-style-kit init
```

Detects your package manager, installs `oxlint` + `oxfmt`, removes any leftover prettier/eslint deps from older setups, writes `oxlint.config.ts` + `oxfmt.config.ts`, adds lint/format scripts to `package.json`, and updates `.vscode/settings.json` to use the oxc.oxlint extension.

If your project uses **Vite+**, the CLI skips writing standalone config files and prints a snippet for inlining `styleKit()` in `vite.config.ts`.

### Option 2 — Unified factory (standalone)

`oxlint.config.ts`:

```ts
import { styleKit } from "js-style-kit";

export default styleKit({
  react: { framework: "next" },
  tailwind: true,
}).oxlint;
```

`oxfmt.config.ts`:

```ts
import { styleKit } from "js-style-kit";

export default styleKit({
  react: { framework: "next" },
  tailwind: true,
}).oxfmt;
```

### Option 3 — Inline in Vite+

`vite.config.ts`:

```ts
import { defineConfig } from "vite-plus";
import { styleKit } from "js-style-kit";

const { oxlint, oxfmt } = styleKit({
  react: { framework: "vite" },
  tailwind: true,
});

export default defineConfig({
  lint: oxlint,
  format: oxfmt,
});
```

### Option 4 — Use the individual factories

If you don't need the cross-tool wiring `styleKit()` provides:

```ts
// oxlint.config.ts
import { oxlintConfig } from "js-style-kit";

export default oxlintConfig({ react: { framework: "next" }, tailwind: true });

// oxfmt.config.ts
import { oxfmtConfig } from "js-style-kit";

export default oxfmtConfig({ tailwind: true });
```

## Options

All three factories share the same option types (see [`src/types.ts`](./src/types.ts) for full TSDoc annotations).

### `OxlintOptions`

| Option | Default | Notes |
| --- | --- | --- |
| `convex` | `false` | Loads `@convex-dev/eslint-plugin` via `jsPlugins`. |
| `functionStyle` | `"arrow"` | `"arrow"` loads `eslint-plugin-prefer-arrow-functions`. `"declaration"` / `"expression"` use oxlint's `func-style` rule. `"off"` disables enforcement. |
| `ignores` | `[]` | Appended to the always-on `node_modules`, `dist`, `build` ignores. |
| `importPlugin` | `true` | Toggle the native `import` plugin. |
| `jsdoc` | `{ requireJsdoc: false }` | Native `jsdoc` plugin. Pass `false` to disable. |
| `overrides` | `[]` | User-supplied `RuleOverride[]` appended to the override list. |
| `query` | `false` | Loads `@tanstack/eslint-plugin-query`. |
| `react` | `false` | `true` or `{ framework: "next" \| "vite" \| "remix" \| "react-router" \| "none" }`. Loads `react`, `react-hooks`, `jsx-a11y` natives plus the aliased `react-hooks-js` (eslint-plugin-react-hooks) for React 19 rules. `framework: "next"` adds the `nextjs` plugin. |
| `rules` | `{}` | Shallow-merged onto the final rule map (user wins). |
| `sorting` | `true` | Non-import sorting via `eslint-plugin-perfectionist`. Imports go to oxfmt. |
| `storybook` | `false` | Loads `eslint-plugin-storybook`, scoped to `*.stories.*` and `.storybook/`. |
| `testing` | vitest defaults | Pass `false` to disable. Object form: `{ framework: "vitest" \| "jest" \| "bun" \| "node", files, itOrTest, filenamePattern, formattingRules, importRestrictions }`. Native vitest/jest plugins; bun/node use the jest plugin. |
| `tailwind` | `false` | Loads `oxlint-tailwindcss`. Object form `{ stylesheet, functions }` is forwarded to the plugin. |
| `turbo` | `false` | Loads `eslint-plugin-turbo`. |
| `typescript` | `true` | Native `typescript` plugin + `options.typeAware: true`. Pass `false` to disable; pass a string to point at a tsconfig path. |
| `unicorn` | `{ filenameCase: "kebabCase" }` | Native `unicorn` plugin. Pass `false` to disable. |

### `OxfmtOptions`

| Option | Default | Notes |
| --- | --- | --- |
| `sortImports` | `true` | Pass an object to customize groups. |
| `sortPackageJson` | `true` | Set `false` to disable. |
| `tailwind` | `false` | When set, enables `sortTailwindcss` with `clsx`/`cva`/`cn` as default class-detection helpers. |
| `jsdoc` | `false` | Enable oxfmt's jsdoc formatter pass. |

Other oxfmt knobs (printWidth, singleQuote, semi, trailingComma, etc.) fall through via oxfmt's open index signature — set them on the returned config directly, or in your Vite+ `format` block.

### `StyleKitOptions`

Superset of the above with shared concerns at the top level (`tailwind`, `react`, `typescript`, `ignores`, `functionStyle`, `convex`, `storybook`, `turbo`). For options that don't have a shared knob, use `lint?` / `format?` escape hatches:

```ts
styleKit({
  react: { framework: "next" },
  tailwind: true,
  lint: { sorting: false, importPlugin: false },
  format: { sortPackageJson: false, jsdoc: true },
});
```

## License

MIT
