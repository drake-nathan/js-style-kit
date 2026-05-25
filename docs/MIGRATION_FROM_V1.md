# Migrating from `js-style-kit` v1 (ESLint + Prettier) → v2 (oxlint + oxfmt)

`js-style-kit` v2 is a breaking rewrite. The package now wraps [oxlint](https://oxc.rs) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) instead of ESLint and Prettier. There is no compatibility layer with the v1 toolchain. This guide walks you through the upgrade.

## Why?

oxlint and oxfmt are Rust-based, orders of magnitude faster than ESLint and Prettier, and now support most existing ESLint plugins through the `jsPlugins` mechanism. Maintaining one styleguide across multiple projects is much easier on top of the oxc toolchain.

See [OXLINT_MIGRATION.md](./OXLINT_MIGRATION.md) for the full conversion plan and outstanding decisions.

## The easy path: rerun the CLI

```bash
bunx js-style-kit@latest init
```

The CLI:

- removes leftover prettier/eslint packages from `package.json`
- installs `oxlint`, `oxfmt`, `js-style-kit`
- deletes the old `eslint.config.*` / `prettier.config.*` files **(you should remove them manually if the CLI doesn't catch them)**
- writes `oxlint.config.ts` + `oxfmt.config.ts` calling `styleKit({})`
- updates `package.json` scripts
- updates `.vscode/settings.json` (recommends `oxc.oxlint`, drops `source.fixAll.eslint`)

If your project uses **Vite+**, the CLI skips standalone config files and prints a snippet to inline in your `vite.config.ts`.

## The manual path

### 1. Swap deps

```bash
# remove
bun remove eslint prettier @prettier/plugin-oxc \
  eslint-plugin-import-x eslint-plugin-jsdoc eslint-plugin-perfectionist \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-unicorn \
  prettier-plugin-tailwindcss prettier-plugin-packagejson \
  prettier-plugin-css-order prettier-plugin-sort-json prettier-plugin-curly \
  typescript-eslint @typescript-eslint/parser

# install
bun add --dev oxlint oxfmt oxlint-tsgolint
```

Plus the JS-plugin peers for any plugins you use (see the package README's [optional peers table](../packages/style-kit/README.md#install)).

### 2. Delete old config files

```
rm eslint.config.* prettier.config.* .prettierignore .eslintcache
```

### 3. Write new config files

`oxlint.config.ts`:

```ts
import { styleKit } from "js-style-kit";

export default styleKit({ /* your options */ }).oxlint;
```

`oxfmt.config.ts`:

```ts
import { styleKit } from "js-style-kit";

export default styleKit({ /* same options */ }).oxfmt;
```

### 4. Update scripts

```jsonc
{
  "scripts": {
    "lint": "oxlint --deny-warnings",
    "lint:fix": "oxlint --fix --deny-warnings",
    "format": "oxfmt .",
    "format:check": "oxfmt --check ."
  }
}
```

## Side-by-side: common configs

### Default (no React, no extras)

```ts
// v1 — eslint.config.js
import { eslintConfig, prettierConfig } from "js-style-kit";
export const eslint = eslintConfig();
export const prettier = prettierConfig();
```

```ts
// v2 — oxlint.config.ts + oxfmt.config.ts
import { styleKit } from "js-style-kit";

const { oxlint, oxfmt } = styleKit();

export default oxlint; // in oxlint.config.ts
export default oxfmt; // in oxfmt.config.ts
```

### Next.js

```ts
// v1
eslintConfig({ react: { framework: "next" } });
```

```ts
// v2
styleKit({ react: { framework: "next" } });
```

### Vite + Tailwind

```ts
// v1
eslintConfig({ react: { framework: "vite" } });
prettierConfig({ tailwindPlugin: { tailwindStylesheet: "./src/index.css" } });
```

```ts
// v2 — single shared `tailwind` knob drives BOTH sides
styleKit({
  react: { framework: "vite" },
  tailwind: { stylesheet: "./src/index.css" },
});
```

### With Storybook + Convex

```ts
// v1
eslintConfig({
  convex: true,
  react: { framework: "next" },
  storybook: true,
});
```

```ts
// v2 — same options surface, opt-in plugins now register JS plugins lazily
styleKit({
  convex: true,
  react: { framework: "next" },
  storybook: true,
});
```

> Default rule lists for convex/query/turbo/storybook are intentionally empty in v2 — register the plugins, then enable specific rules via the `lint.rules` override. See [OXLINT_MIGRATION.md](./OXLINT_MIGRATION.md) "open issues" for the rationale.

## Breaking behavior

- `react.reactCompiler` option dropped. The upstream `eslint-plugin-react-compiler` is archived; its rules now live in upstream `eslint-plugin-react-hooks` and are always enabled when `react` is on (via the aliased `react-hooks-js/*` namespace).
- `eslint-disable-next-line` comments referencing aliased JS-plugin namespaces need the alias: write `// eslint-disable-next-line react-hooks-js/refs`, not `react-hooks/refs`.
- `process.eslintConfig`-style "additionalConfigs" merging is gone — oxlint accepts a single config object with file-scoped `overrides[]`.
- Several legacy rules dropped because they have no oxlint equivalent (jsdoc/check-alignment, jsdoc/multiline-blocks, jsdoc/tag-lines, react/destructuring-assignment, react/function-component-definition, react/prop-types, unicorn/better-regex, …). The dropped lists are documented in each plugin file under `src/oxlint/plugins/`.
- The `eslint-plugin-nextjs` sub-package is gone. Use oxlint's built-in `nextjs` plugin (automatic when `react: { framework: "next" }`).

## Help / issues

- Plan + open questions: [OXLINT_MIGRATION.md](./OXLINT_MIGRATION.md)
- Bug reports: <https://github.com/drake-nathan/js-style-kit/issues>
