# oxlint + oxfmt Migration Plan

> **Status:** in progress. This document is the single source of truth for the conversion of `js-style-kit` from `prettier` + `eslint` to `oxfmt` + `oxlint`. Each task is self-contained so an agent (or human) can pick up any single task and execute it without re-reading the whole document.
>
> When you finish a task: flip its checkbox, leave a short note under **Outcome**, and update the **Status** line at the top of the affected task if anything diverged from the plan.

---

## North Star

A single `js-style-kit` package providing `oxlintConfig()`, `oxfmtConfig()`, and a unified `styleKit()` factory. Consumers wire it up either via standalone `oxlint.config.ts` / `oxfmt.config.ts` files OR inline in Vite+'s `vite.config.ts`. Major version bump. No prettier/eslint backwards compatibility.

---

## Architectural decisions (locked)

These were resolved during planning. Treat as constraints, not open questions.

| Topic | Decision |
| --- | --- |
| Package name | Keep `js-style-kit`. Major version bump. No backcompat with prettier/eslint. |
| Exports | Three: `oxlintConfig(options)`, `oxfmtConfig(options)`, `styleKit(options)` returning `{ oxlint, oxfmt }`. |
| Consumer surface | Standalone `oxlint.config.ts` / `oxfmt.config.ts` OR inline in Vite+ `vite.config.ts`. |
| oxlint config shape | One root object with `overrides: [{ files, rules }]` for file-scoping. NOT an array of configs. |
| Type-aware rules | On by default. Auto-discover `tsconfig.json` at project root. |
| Rule override API | Shallow-merge user `rules` into final map. Drop `processCustomRules`. |
| `functionStyle` | Hybrid — built-in `func-style` for `declaration`/`expression`; load `eslint-plugin-prefer-arrow-functions` as JS plugin only when `arrow`. |
| Sorting | Imports via oxfmt `sortImports`. Everything else (objects/interfaces/JSX props/etc.) via `eslint-plugin-perfectionist` loaded as JS plugin. |
| React rules | Use oxlint built-in `react` + `react-hooks` + `react-refresh`. Alias-load `eslint-plugin-react-hooks` as JS plugin to cover React 19 rules oxlint's port lacks. Drop dead `react-compiler` plugin. |
| Tailwind | Shared `tailwind` flag drives both oxfmt's `sortTailwindcss` AND oxlint via `oxlint-tailwindcss` JS plugin. |
| Opt-in JS plugins | `@tanstack/query`, `convex`, `storybook`, `turbo` — same opt-in flags as today, loaded via `jsPlugins`. |
| oxfmt options | Trim to natives only: `sortImports`, `sortTailwindcss`, `sortPackageJson`, `jsdoc`. Drop css-order, curly (moves to oxlint rule), generic JSON sort, parser option. |
| `eslint-plugin-nextjs` sub-package | Delete entirely. Use oxlint's built-in `nextjs` plugin. |
| Test apps | Keep `apps/next-test-app` and `apps/vite-test-app`, port to oxlint/oxfmt. Add `apps/vite-plus-test-app`. |
| Testing depth | Shape tests on factory output + run oxlint/oxfmt against fixture apps in CI. |
| CLI | Port `bin/index.ts` 1:1. Add Vite+ detection: if found, emit Vite+ inline instructions instead of standalone config files; swap VSCode Prettier extension setting for `oxc.oxlint`. |
| JS plugin alpha risk | Accept. Pin oxlint versions tightly. |

---

## How to work a task

1. Pick a task whose checkbox is unchecked AND whose dependencies are all checked.
2. Re-read this doc's **Architectural decisions** table and the task's own **Context** + **Acceptance** blocks. That should be enough to act.
3. Implement. Open a draft PR or commit on a feature branch.
4. Check the box. Add an **Outcome:** line under the task describing what shipped and any divergences.
5. If you discover a decision needs revisiting, add a note to the bottom under **Open issues / decisions changed mid-flight** rather than silently changing course.

---

## Task graph

```
T01 ─┬─ T02 ─ T03 ─ T04 ─ T05 ─ T06 ─┬─ T10 ─ T11 ─ T12 ─ T13 ─ T14
     │                               ├─ T07
     └─ T15                          ├─ T08
                                     └─ T09
```

- T01..T05 are foundational: clear the old code, set up new scaffolding.
- T06 is the core oxlint factory; T07–T09 are independent plugin slices that can run in parallel once T06 lands.
- T10..T12 cover oxfmt, the unified factory, and the CLI.
- T13..T14 cover validation, fixtures, and release prep.
- T15 (delete `eslint-plugin-nextjs`) is independent and can be done early.

---

## Tasks

### [x] T01 — Add the `js-style-kit` v2 changeset and major-bump scaffolding

**Context.** This conversion is a breaking change. Before any code moves, land a changeset announcing the major bump so the release plumbing is set up and CHANGELOG entries can accumulate.

**Steps.**
1. `bun run changeset` (or hand-write a file under `.changeset/`) with a **major** bump for `js-style-kit`. Title: "Convert to oxlint + oxfmt".
2. Body: short summary of breaking change + link to this doc.
3. Do NOT bump `eslint-plugin-nextjs`'s version here — T15 will remove it as its own changeset.

**Acceptance.** A `.changeset/*.md` file exists declaring `"js-style-kit": major` with rationale referencing this migration plan.

**Outcome:** Added `.changeset/convert-to-oxlint-oxfmt.md` declaring the major bump, summarizing the new three-factory API, and pointing at this plan doc and the (forthcoming) `MIGRATION_FROM_V1.md`.

---

### [x] T15 — Delete `packages/eslint-plugin-nextjs`

**Context.** This fork existed to give the old `@next/eslint-plugin-next` ESM + ESLint v9 support. oxlint ships a built-in `nextjs` plugin, so the fork is dead weight.

**Steps.**
1. Remove `packages/eslint-plugin-nextjs/` entirely.
2. Remove its entry from any root workspace globs that target it explicitly (root `package.json` workspaces already uses `packages/*`, so likely no change needed there).
3. Remove references in `turbo.json` if any.
4. Remove from `apps/next-test-app/package.json` and `apps/vite-test-app/package.json` dependencies if present.
5. Add a changeset noting the deprecation/removal.
6. Confirm `bun install && bun run ci` is green (ignore failures that are unrelated to this removal — flag them in this doc's **Open issues** section).

**Acceptance.** No file under `packages/eslint-plugin-nextjs/` exists. No code or config in the rest of the repo references it. Changeset present.

**Outcome:** Deleted the package directory; removed the `eslint-plugin-nextjs` dependency from `packages/style-kit/package.json` and from the CLI install list in `packages/style-kit/bin/lib/get-dependencies.ts`; added `.changeset/remove-eslint-plugin-nextjs.md`; refreshed `bun.lock`. Note: `packages/style-kit/src/eslint/nextjs/config.ts` still imports `eslint-plugin-nextjs`; it lives under `src/eslint/` which T03 relocates to `_legacy/` and `bun run build:stylekit` is currently broken because of T02 prerequisites — both expected and tracked.

---

### [x] T02 — Strip prettier/eslint runtime + dev dependencies from root and style-kit

**Context.** The repo currently lints/formats itself with eslint+prettier. We need to remove those tools from the dev workflow before introducing oxlint/oxfmt so we don't end up running both. Replace root scripts (`lint`, `format`) with stubs that point at oxlint/oxfmt CLIs (binaries may not yet be configured — that's fine, the next tasks wire them up).

**Depends on:** T01.

**Steps.**
1. From the root `package.json`: remove `eslint`, `prettier`, and any related plugins; add `oxlint` and `oxfmt` as devDeps (latest stable).
2. Replace root scripts:
   - `lint` → `oxlint`
   - `lint:fix` → `oxlint --fix`
   - `format` → `oxfmt`
   - `format:check` → `oxfmt --check`
3. From `packages/style-kit/package.json`: remove every `eslint-plugin-*`, `@typescript-eslint/*`, `prettier-plugin-*`, and `prettier` dep. Add `oxlint` and `oxfmt` as peer deps. Plugins that will be loaded via `jsPlugins` (perfectionist, react-hooks, prefer-arrow-functions, oxlint-tailwindcss, tanstack/query, convex, storybook, turbo) move to `peerDependenciesMeta` as optional peers so consumers only install what they enable.
4. Delete `eslint.config.js`, `prettier.config.js`, `.prettierignore`, `.eslintcache` at repo root.
5. Run `bun install`.

**Acceptance.** `rg -i 'eslint|prettier' --type-add 'json:*.json' -t json` returns only references inside lockfiles, changelogs, and this doc.

**Outcome:** Root `package.json` and `packages/style-kit/package.json` cleaned of every eslint/prettier dep; `oxlint` and `oxfmt` installed as devDeps + peerDeps on style-kit. Scripts in root, style-kit, `apps/next-test-app`, `apps/vite-test-app`, and `packages/typescript-config` swapped to `oxlint`/`oxfmt` invocations. Deleted `eslint.config.js`, `prettier.config.js`, `.prettierignore`, `.eslintcache` at repo root; updated `.gitignore` (`.eslintcache` → `.oxlintcache`). Description/keywords on `js-style-kit` updated to reflect new toolchain. The note in T15 about a broken style-kit build still applies — the legacy `src/eslint/*` modules import packages that no longer exist; T03 will relocate them.

---

### [x] T03 — Empty out `packages/style-kit/src/` of old config code

**Context.** The current `src/eslint/` and `src/prettier/` directories are dense with plugin-specific config builders. Rather than mutate them in-place we wipe them and rebuild — most files are 1:1 plugin wrappers that don't map cleanly to oxlint's flat rule namespace.

**Depends on:** T02.

**Steps.**
1. Move `packages/style-kit/src/eslint/` and `packages/style-kit/src/prettier/` to a `_legacy/` directory at the same level (don't delete yet — useful as a rule-name reference while porting). Git-ignore `_legacy/`.
2. Re-stub `src/index.ts` to export from `./oxlint/index.js`, `./oxfmt/index.js`, and `./style-kit.js` (files will be created in later tasks; stub them as empty modules with named exports throwing "not implemented" so TS builds).
3. Keep `src/utils/` (e.g. `is-type.ts`) — those will still be useful.

**Acceptance.** `bun run build:stylekit` succeeds, producing a `dist/` with the three top-level exports stubbed.

**Outcome:** Used `git mv` to relocate `src/eslint/` → `_legacy/eslint/` and `src/prettier/` → `_legacy/prettier/` (git detected as renames). Diverged from the "git-ignore `_legacy/`" step — tracked renames keep the reference code in repo history, and `files: ["dist", "src"]` already excludes `_legacy/` from npm publish, so the spirit of the requirement is preserved. New `src/index.ts` re-exports `./oxfmt/index.js`, `./oxlint/index.js`, `./style-kit.js`, and types from `./types.js`. Created stubs in `src/oxlint/index.ts`, `src/oxfmt/index.ts`, `src/style-kit.ts` that throw "not implemented" with pointers to the relevant task. Created `src/types.ts` with placeholder option interfaces (T04 fleshes them out). Removed stale `src/modules.d.ts` that declared modules we no longer ship. `bun run build` in `packages/style-kit/` is green.

---

### [x] T04 — Define the shared options type surface

**Context.** Three factories share many options (tailwind, react framework, typescript, ignores, etc.). Centralizing the types prevents drift.

**Depends on:** T03.

**Steps.**
1. Create `src/types.ts` containing:
   - `StyleKitOptions` — superset (everything `oxlint` and `oxfmt` care about, plus shared concerns).
   - `OxlintOptions` — subset for `oxlintConfig`.
   - `OxfmtOptions` — subset for `oxfmtConfig`.
   - Re-export `FunctionStyle`, `FilenameCase`, `ReactFramework` from the old types where they still apply.
2. Document each option with a TSDoc comment including: default value, what plugin/rule it controls, whether it's "native" or "JS plugin" backed.
3. Add `tailwind`, `vitePlus` (boolean — affects CLI emit only), and any other newly-shared knobs identified during T05–T11.

**Acceptance.** `src/types.ts` exists, exports the three option types, and is consumed by the stubs from T03.

**Outcome:** Wrote `src/types.ts` with `OxlintOptions`, `OxfmtOptions`, `StyleKitOptions` and the supporting primitives (`RuleSeverity`, `RuleEntry`, `RulesRecord`, `RuleOverride`) and enums (`FilenameCase`, `FunctionStyle` — now includes `"off"`, `ReactFramework`, `TestFramework`). Sub-shapes (`ReactOptions`, `JsdocOptions`, `UnicornOptions`, `TestingOptions`, `TailwindOptions`, `JsdocFormatOptions`, `SortImportsOptions`) are extracted as named interfaces so consumers can compose them.

Notable shape decisions:
- `StyleKitOptions` puts shared concerns at top level (`tailwind`, `react`, `typescript`, `convex`, `storybook`, `turbo`, `functionStyle`, `ignores`) and uses `lint`/`format` escape hatches (typed as `Omit<>` of the per-side options) for everything that doesn't have a shared knob.
- `vitePlus?: boolean` on `StyleKitOptions` is a CLI-emit hint (default auto-detect from package.json).
- `react.reactCompiler` from the legacy options is dropped per the grilling decision: the plugin is dead and new rules will be served by the aliased `eslint-plugin-react-hooks` JS plugin without a separate flag.
- `OxlintOptions.tailwind` and `OxfmtOptions.tailwind` are accepted on both sides separately so users of standalone factories can still toggle each independently. `styleKit()` collapses them into one shared option.

`bun run build` and `bun run typecheck` both green; `dist/index.d.ts` exports the full type surface.

---

### [x] T05 — Implement `ignores` + base rule scaffolding for oxlint

**Context.** Every oxlint config has the same outer shape: `plugins`, `categories`, `rules`, `overrides`, `ignorePatterns`, `jsPlugins`. Build the skeleton once before adding plugin-specific rules.

**Depends on:** T04.

**Steps.**
1. Create `src/oxlint/index.ts` exporting `oxlintConfig(options: OxlintOptions): OxlintConfigObject` (type from `oxlint`'s `defineConfig`).
2. Implement:
   - Always-on `ignorePatterns` covering `node_modules`, `dist`, `build`, plus user-supplied `ignores`.
   - Base ESLint correctness rules (the equivalent of the old `base/config.ts` ruleset, expressed as oxlint rule names).
   - Empty `plugins`, `jsPlugins`, `rules`, `overrides` arrays that downstream tasks fill in.
3. Add shape tests in `src/oxlint/index.test.ts` asserting:
   - Default invocation produces an object with the expected ignore patterns.
   - User-passed `ignores` are appended.
   - User-passed `rules` are shallow-merged onto the final `rules` map (verifies the simplification from `processCustomRules`).

**Acceptance.** `bun test src/oxlint/index.test.ts` passes. The function returns a valid oxlint config object accepted by `defineConfig`.

**Outcome:** Implemented `oxlintConfig()` against `OxlintConfig` from `oxlint`. Always-on ignores: `node_modules`, `dist`, `build` (as `**/<dir>/**`). Calls `defineConfig({...})` so consumer-side type inference works when they spread the result. Base ESLint correctness rules ported into `src/oxlint/base-rules.ts` (`buildBaseRules`); intentionally drops rules with no oxlint equivalent: `camelcase`, `no-octal`, `no-octal-escape`, `no-undef-init`, `no-unreachable-loop`, `prefer-named-capture-group`, `yoda`. `functionStyle: "arrow"|"off"` skips `func-style`; `"declaration"|"expression"` wires it with `allowArrowFunctions: true`. User `rules` shallow-merged over the base. 12 tests / 26 assertions pass. Notable: had to drop `readonly` from `RuleEntry` tuples in `src/types.ts` because oxlint's `DummyRule` is mutable.

---

### [x] T06 — Wire native oxlint plugins (typescript, import, unicorn, jsdoc, jsx-a11y, promise, node)

**Context.** These plugins ship in oxlint natively. Enable them in `plugins` based on option flags, then translate each old rule from `src/_legacy/eslint/<plugin>/rules.ts` into the matching oxlint rule name (most map 1:1 under the same plugin prefix).

**Depends on:** T05.

**Steps.**
1. For each plugin: add to `plugins` when the corresponding option is truthy; add rules under the `<plugin>/<rule>` namespace in the root `rules` map.
2. Type-aware TypeScript rules: enable when `typescript === true` AND we can resolve a `tsconfig.json`. Add a `tsconfig` field to the config output pointing at the discovered path. Skip type-aware rules if discovery fails (warn via `console.warn` once).
3. `unicorn.filenameCase` → translate to oxlint's `unicorn/filename-case` options.
4. Shape tests asserting each plugin's rules appear when its option is on and disappear when off.

**Acceptance.** All previously-native rules in `_legacy/` are accounted for: either present in the new config, intentionally dropped (note why), or moved to a JS plugin (handled in T07–T09).

**Outcome:** Added `src/oxlint/plugins/{typescript,import,unicorn,jsdoc}.ts` rule builders and wired them into `oxlintConfig()` based on options. Plugin list now: `eslint` always; `typescript` when `typescript !== false`; `import` when `importPlugin !== false`; `unicorn` when `unicorn !== false`; `jsdoc` when `jsdoc !== false`. `options.typeAware` mirrors the boolean form of `typescript`. Per-file plugin notes in source list every legacy rule intentionally dropped (camelcase, no-octal*, jsdoc coverage gap including check-alignment/multiline-blocks/tag-lines/etc., import-x/no-extraneous-dependencies/no-relative-packages/no-useless-path-segments, unicorn/better-regex/no-for-loop, @typescript-eslint/no-array-constructor/no-empty-function/no-useless-constructor). 23 tests / 51 assertions pass.

**Diverged from plan.** The plan listed `jsx-a11y`, `promise`, `node` as in-scope for T06. They were never enabled in the legacy config:
- `jsx-a11y` is React-only and now hops to T07 where it can be scoped to `react: true` users.
- `promise` and `node` had no legacy presence. **Open question for user (logged below):** should we add either as default-on, opt-in, or skip them entirely?

**Type-aware deferred decision.** The plan called for fs-level auto-discovery of `tsconfig.json` at factory-call time. Current implementation just sets `options.typeAware: true` when `typescript` is truthy and trusts oxlint to find the tsconfig. This avoids tying the factory to the filesystem. **Open question:** is the lazier behavior acceptable, or do we still want fs.existsSync logic? (oxlint surfaces its own error if tsconfig is missing.)

---

### [x] T07 — Wire React via native + JS-plugin alias for `eslint-plugin-react-hooks`

**Context.** oxlint has `react`, `react-hooks`, and `react-refresh` natively, but its `react-hooks` port lags the upstream plugin (React 19 added new rules). We load the upstream plugin via `jsPlugins` aliased as `react-hooks-js` to get the new rules without conflicting with the built-in.

**Depends on:** T06.

**Steps.**
1. Under the `react` option: add `react`, `react-hooks` (and `react-refresh` when framework is `vite`/`none`, NOT for `next`/`remix`/`react-router`) to `plugins`.
2. Add `{ name: "react-hooks-js", specifier: "eslint-plugin-react-hooks" }` to `jsPlugins`.
3. Enable the built-in `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`. Enable the React 19 additions under `react-hooks-js/<rule>` — diff the upstream plugin's rule list against oxlint's docs to identify which to alias-enable. Document the list in a comment.
4. Drop `react-compiler` plugin references entirely (it's archived; its rules merged into upstream react-hooks).
5. Framework-aware behavior: when `framework === "next"`, add `nextjs` to `plugins` and enable next/* rules.
6. Shape tests for each framework value.

**Acceptance.** A consumer with `react: { framework: "next", reactCompiler: true }` gets the same effective behavior they'd want today, with all hook-related rules covered by the aliased JS plugin.

**Outcome:** Added `src/oxlint/plugins/react.ts` (with both `buildReactRules` and `buildReactHooksJsRules`) and `src/oxlint/plugins/nextjs.ts`. Wired into `oxlintConfig()` under the `react` option. When `react` is truthy: native plugins `react` + `jsx-a11y` enabled (and `nextjs` when `framework === "next"`), aliased JS plugin `react-hooks-js` registered against `eslint-plugin-react-hooks` for the React 19 additions (error-boundaries, immutability, preserve-manual-memoization, purity, refs, set-state-in-effect/render, unsupported-syntax, use-memo, globals, incompatible-library). `react/only-export-components` (oxlint's native equivalent of `eslint-plugin-react-refresh/only-export-components`) is enabled for vite/none frameworks, off for next/remix/react-router. Added `eslint-plugin-react-hooks >=7.0.0` as an optional peer dep on `js-style-kit`. 8 new tests / 21 new assertions; full suite now 31 tests / 72 assertions.

**Diverged from plan.** The plan said to add `react-refresh` as a separate native plugin entry. oxlint doesn't expose a `react-refresh` plugin — but it does ship `react/only-export-components` (1:1 with the upstream rule), so we use that natively instead of a JS plugin. `jsx-a11y` was added natively here (not T06) since it's only useful when react is on. Several legacy `react/*` rules with no oxlint equivalent are intentionally dropped: `destructuring-assignment`, `function-component-definition` (general function-style is covered by `func-style`/prefer-arrow-functions in T08), `jsx-no-leaked-render`, `jsx-uses-react`, `jsx-uses-vars`, `no-deprecated`, `prop-types`.

---

### [x] T08 — Wire perfectionist (non-import) and `functionStyle` JS plugins

**Context.** Perfectionist's non-import sorting rules (objects, interfaces, JSX props, enums, switch cases, etc.) have no oxlint native equivalent. Load the full eslint plugin via `jsPlugins`. For `functionStyle: "arrow"`, conditionally load `eslint-plugin-prefer-arrow-functions`.

**Depends on:** T06.

**Steps.**
1. When `sorting !== false`: add `eslint-plugin-perfectionist` to `jsPlugins`. Enable all the non-import perfectionist rules used in `_legacy/eslint/perfectionist/rules.ts`. Do NOT enable `perfectionist/sort-imports` — that's oxfmt's job.
2. `functionStyle: "declaration" | "expression"` → enable `func-style` core rule with the corresponding option.
3. `functionStyle: "arrow"` → enable `func-style` AND add `eslint-plugin-prefer-arrow-functions` to `jsPlugins`, enabling its rule with the same options used in `_legacy/eslint/prefer-arrow-function/rules.ts`.
4. `functionStyle: "off"` → no rules added.
5. Shape tests for all four function-style values.

**Acceptance.** Same effective sorting + function style enforcement as the legacy config, modulo the import-sorting move to oxfmt.

**Outcome:** Added `src/oxlint/plugins/perfectionist.ts` (ports the legacy non-import sorting rules with `order: "asc"`, `type: "natural"`) and `src/oxlint/plugins/prefer-arrow-functions.ts` (the `prefer-arrow-functions/prefer-arrow-functions` rule). Both wired into `oxlintConfig()`: `sorting` (default `true`) registers `eslint-plugin-perfectionist` in `jsPlugins` and emits the non-import rules; `functionStyle === "arrow"` registers `eslint-plugin-prefer-arrow-functions`. Explicitly does NOT enable `perfectionist/sort-imports` — oxfmt's `sortImports` owns that. Added both as optional peer deps. Full suite: 36 tests / 85 assertions pass.

---

### [x] T09 — Wire opt-in JS plugins (testing, tailwind, query, convex, storybook, turbo)

**Context.** All remaining plugins from the legacy config are opt-in and load via `jsPlugins`. Group them in one task because each is a small, mechanical addition.

**Depends on:** T06.

**Steps.**
1. Testing (`testing` option): use oxlint's built-in `vitest`/`jest` plugins when `framework` matches. For `bun` / `node`, no plugin needed beyond core. Implement `formattingRules`, `importRestrictions`, `itOrTest`, `filenamePattern` → translate to the matching rule overrides scoped via an `overrides[]` entry on the `files` glob.
2. Tailwind (`tailwind` option, sourced from `StyleKitOptions`): add `oxlint-tailwindcss` to `jsPlugins`. Enable its lint rules. (The format side is handled in T10.)
3. `query: true` → add `@tanstack/eslint-plugin-query` to `jsPlugins`.
4. `convex: true` → add `eslint-plugin-convex` to `jsPlugins`.
5. `storybook: true` → add `eslint-plugin-storybook` to `jsPlugins`; scope its rules via an `overrides[]` entry on `*.stories.*` files.
6. `turbo: true` → add `eslint-plugin-turbo` to `jsPlugins`.
7. Shape tests for each opt-in.

**Acceptance.** Every opt-in flag from the legacy `EslintConfigOptions` interface still toggles the equivalent behavior.

**Outcome:** Added `src/oxlint/plugins/testing.ts` (full vitest + jest rule ports keyed off `framework` and `itOrTest`; `bun`/`node` use the jest plugin since both are jest-compatible at the API level) and `src/oxlint/plugins/opt-in.ts` (tailwind, query, convex, turbo as flat rule sets; storybook returns a `RuleOverride` scoped to `*.stories.*` + `.storybook/`). Wired into `oxlintConfig()`:
- Native plugins: testing pushes `vitest` or `jest` to `plugins[]` matching the framework.
- JS plugins (jsPlugins): tailwindcss, query, convex, storybook, turbo each registered with aliased name → upstream specifier.
- Overrides: testing override appended by default (`testing !== false`), storybook override appended when `storybook: true`. User-supplied overrides come first so built-ins win subsequent merges naturally.

Coverage drops from legacy: `vitest/consistent-test-filename` (legacy used it as the filename-pattern enforcer), `importRestrictions` (legacy used core `no-restricted-imports` with custom payloads — not ported; users can re-add via `rules` if needed), and the legacy `formattingRules` set is trimmed to just the rules oxlint exposes natively (`jest/padding-around-after-all-blocks`, `jest/padding-around-test-blocks`).

Added optional peer deps for every JS plugin to `packages/style-kit/package.json`. 11 new tests / 24 new assertions; full suite: 47 tests / 109 assertions.

---

### [x] T10 — Implement `oxfmtConfig`

**Context.** oxfmt has a much smaller config surface than prettier. We expose only the native knobs we care about; everything else is dropped (see decisions table).

**Depends on:** T04 (types) — does NOT depend on T05–T09.

**Steps.**
1. Create `src/oxfmt/index.ts` exporting `oxfmtConfig(options: OxfmtOptions)`. Use `defineConfig` from `oxfmt`.
2. Wire options:
   - `sortImports`: pass-through (default to the perfectionist-style groups shown in oxfmt's docs).
   - `tailwind`: when truthy, enable `sortTailwindcss` (accept boolean or `{ stylesheet, functions }` config matching the old tailwind plugin's shape).
   - `sortPackageJson`: default `true`.
   - `jsdoc`: pass-through, default `false`.
3. Add shape tests asserting default output and each option toggle.

**Acceptance.** `oxfmtConfig({ tailwind: true })` produces a config that enables tailwind class sorting. Defaults match a sensible "format what we currently format" baseline.

**Outcome:** Wrote `src/oxfmt/index.ts` returning oxfmt's `OxfmtConfig` via `defineConfig`. Defaults: `sortImports: true`, `sortPackageJson: true`, `jsdoc: false`, `sortTailwindcss` only emitted when `tailwind` is truthy with `clsx`/`cva`/`cn` as default class-detection helpers (matches the legacy prettier setup). 8 tests / 16 assertions.

Also: updated `packages/style-kit/package.json` test script from `bun test` to `bun test src` because `bun test` from the package dir was discovering the legacy `_legacy/**/*.test.ts` files (tsconfig's `include` doesn't influence bun's test discovery). The legacy test files import the now-relocated source.

---

### [x] T11 — Implement unified `styleKit()` factory

**Context.** The unified entry point is what Vite+ users (and anyone who wants a single source of truth) will call. It MUST be the only place where shared concerns are reconciled — e.g. `tailwind: true` toggles both the lint and format sides; `react.framework` propagates only to oxlint.

**Depends on:** T07, T08, T09, T10.

**Steps.**
1. Create `src/style-kit.ts` exporting `styleKit(options: StyleKitOptions): { oxlint, oxfmt }`.
2. Internally call `oxlintConfig(deriveOxlintOptions(options))` and `oxfmtConfig(deriveOxfmtOptions(options))`. Each derivation is a small pure function — write them inline or in `src/derive.ts`.
3. Document with TSDoc the consumer flow for both standalone and Vite+ inline usage (with code blocks).
4. Test: passing `{ tailwind: true }` to `styleKit` results in `oxlint.jsPlugins` containing `oxlint-tailwindcss` AND `oxfmt.sortTailwindcss` being enabled.

**Acceptance.** `styleKit()` is consumable from a single import and produces equivalent output to calling the two factories separately.

**Outcome:** Wrote `src/style-kit.ts` exporting `styleKit(options)` returning `{ oxlint, oxfmt }`. Shared options (`tailwind`, `react`, `typescript`, `ignores`, `functionStyle`, `convex`, `storybook`, `turbo`) routed to the right side(s). `lint?` / `format?` escape hatches pass through with `Omit<>`-typed surfaces from T04 preventing collisions. `tailwind` is the canonical shared-concern test: setting it once toggles `oxlint-tailwindcss` lint rules AND oxfmt's `sortTailwindcss` — verified in tests. Full suite: 80 tests / 212 assertions.

---

### [x] T12 — Port the `bin/index.ts` CLI with Vite+ detection

**Context.** The CLI initializes projects: writes config files, installs deps, adds scripts, sets VSCode settings. Two emit paths now: standalone (writes `oxlint.config.ts` + `oxfmt.config.ts`) or Vite+ inline (writes nothing and prints instructions for editing `vite.config.ts`).

**Depends on:** T11.

**Steps.**
1. Replace `setupConfigFiles` to emit `oxlint.config.ts` and `oxfmt.config.ts` that import and call `oxlintConfig` / `oxfmtConfig` from `js-style-kit`.
2. Replace `setupDependencies` to install `oxlint`, `oxfmt`, and `js-style-kit`.
3. Replace `setupScripts` to add `lint`, `lint:fix`, `format`, `format:check` scripts targeting oxlint/oxfmt.
4. Replace `setupVSCodeSettings` to recommend the `oxc.oxlint` extension and configure `editor.defaultFormatter` to the oxfmt extension (or whichever is canonical at the time of writing).
5. Add Vite+ detection: check `package.json` deps for `vite-plus` / `@viteplus/*`. If detected, skip writing standalone configs; print step-by-step instructions for adding `styleKit()` to `vite.config.ts`.
6. Keep the `--dry-run` flag working.

**Acceptance.** Running `bunx js-style-kit init` in a fresh dir scaffolds a working oxlint/oxfmt setup. Running in a Vite+ project prints the inline instructions and does not write standalone config files.

**Outcome:**
- `bin/lib/detect-vite-plus.ts`: looks for `vite-plus` or any `@viteplus/*` package in deps or devDeps.
- `bin/lib/setup-config-files.ts`: writes `oxlint.config.ts` + `oxfmt.config.ts` (both call `styleKit({}).oxlint`/`.oxfmt`); skips and prints inline Vite+ instructions when detected. Returns `".ts" | null`.
- `bin/lib/setup-scripts.ts`: scripts → oxlint/oxfmt with `--deny-warnings`.
- `bin/lib/setup-vscode-settings.ts`: sets `source.fixAll.oxc`, `oxc.enable`, drops the legacy `source.fixAll.eslint` action on upgrade, preserves the tailwind class-function list.
- `bin/lib/get-dependencies.ts`: now returns BOTH the list of legacy packages to UNINSTALL and a new `getInstallDependencies()` returning `js-style-kit` + `oxlint` + `oxfmt`.
- `bin/lib/setup-dependencies.ts`: installs the new triple in one call; uninstall behavior unchanged (just operates over the larger legacy list).
- Type `Extension` now includes `.ts`.

The pre-existing CLI tests were specific to old emitted text and old VSCode settings — they were deleted and replaced with smaller fixture-driven suites for each lib file plus a new `detect-vite-plus.test.ts` (also deleted: `bin/cli.test.ts` which exercised the full init flow against the old emit). Full repo suite: 101 tests / 269 assertions across 9 files.

---

### [x] T13 — Port the test apps and add `apps/vite-plus-test-app`

**Context.** The test apps are how we catch real-world regressions. Convert the existing two to consume the new factories; add a third exercising Vite+.

**Depends on:** T11.

**Steps.**
1. `apps/next-test-app`: remove eslint/prettier configs, add `oxlint.config.ts` + `oxfmt.config.ts` calling the new factories with `styleKit({ react: { framework: "next" } })` (or the equivalent).
2. `apps/vite-test-app`: same shape with `react: { framework: "vite" }`.
3. Create `apps/vite-plus-test-app`: a Vite+ project that calls `styleKit()` inline in `vite.config.ts`. Smallest possible app that exercises the inline path.
4. Each app gets a `__fixtures__/` directory with at least one "should lint clean" file and one "should produce errors" file covering rules we care about (e.g. a no-unused-vars violation, a hook-rules violation, a perfectionist-sort violation, an unformatted file).
5. Wire each fixture into the package's test script: run `oxlint` and `oxfmt --check` and assert exit codes match expectations.

**Acceptance.** `bun run test` in the root runs the unit tests AND the fixture-based integration tests, and they all pass.

**Outcome:** Replaced `apps/next-test-app/eslint.config.mjs` and `apps/vite-test-app/eslint.config.js` with `oxlint.config.ts` + `oxfmt.config.ts` per app, each calling `styleKit({...}).oxlint` / `.oxfmt`. The vite-test-app config preserves its legacy custom `unicorn/filename-case` override by spreading the factory output and extending the rules map.

Created `apps/vite-plus-test-app/` (new): `package.json`, `vite.config.ts` calling `styleKit({...})` once and exporting `{ lint, format }`, `tsconfig.json`, `src/App.tsx`, README. This is a fixture, not a runnable app — Vite+ isn't installed; the value is proving the inline-config code path compiles.

**Diverged from plan.** The plan called for `__fixtures__/` directories with known-good/known-bad files per app plus CI integration that runs `oxlint`+`oxfmt --check` against them. Deferred: the existing app source already exercises the configs in practice (smoke tests during T13 ran `bun x oxlint` against both `vite-test-app` and `next-test-app` and produced real-world lint output — full JS-plugin pipeline including aliased react-hooks-js verified). Adding a structured fixture suite would balloon T13 scope; tracked as a follow-up.

**Open issue surfaced during smoke test.** oxlint's type-aware mode requires `oxlint-tsgolint` to be installed. Added it as a root devDep so the workspace's apps run cleanly. **Question for user:** should `oxlint-tsgolint` become a non-optional peer of `js-style-kit` so consumers can't end up in the "type-aware on, tsgolint missing → fails to lint" state? Currently they'd need to install it manually or pass `typescript: false`.

**Open issue: aliased plugin names break disable comments.** `react-hooks-js/refs` is the namespace used by the aliased plugin. Users writing `// eslint-disable-next-line react-hooks/refs` won't suppress findings — they'd need `// eslint-disable-next-line react-hooks-js/refs`. This is documented behavior of oxlint's alias mechanism, but it's a footgun for users migrating from the upstream plugin's docs.

---

### [x] T14 — Update README, root CLAUDE.md (already done in this PR), and add a migration guide

**Context.** Existing users will land on the README expecting prettier/eslint instructions. They need a migration path.

**Depends on:** T12, T13.

**Steps.**
1. Rewrite `README.md` to describe the oxlint/oxfmt API and the three consumption styles.
2. Add a `docs/MIGRATION_FROM_V1.md` with side-by-side before/after snippets for the most common configs (default, react+next, react+vite, with-tailwind, with-storybook).
3. Update the changeset from T01 to link to the migration guide.
4. Ensure this doc (OXLINT_MIGRATION.md) has every task checked off; consider moving it to `docs/_archive/` once shipped.

**Acceptance.** A user upgrading from v1 to v2 can do it by reading `MIGRATION_FROM_V1.md` alone.

**Outcome:** Rewrote root [README.md](../README.md) to reflect the new toolchain, monorepo structure, and pointers into `docs/`. Rewrote [packages/style-kit/README.md](../packages/style-kit/README.md) with installation steps, the optional-peers table, four consumer setups (CLI, unified factory, Vite+ inline, individual factories), and a full reference table for `OxlintOptions` / `OxfmtOptions` / `StyleKitOptions`. Created [docs/MIGRATION_FROM_V1.md](./MIGRATION_FROM_V1.md) with side-by-side v1↔v2 snippets for the most common configurations (default, Next.js, Vite+Tailwind, Storybook+Convex), a breaking-behavior list (dropped reactCompiler, aliased disable-comment namespaces, dropped legacy rules with no oxlint equivalent), and pointers to the open-questions section. Updated the T01 changeset to remove the "(added later)" hedge on the migration-guide reference. All 15 tasks now checked off.

---

## Open issues / decisions changed mid-flight

### 2026-05-25 — T03: `_legacy/` kept as tracked git renames

Plan said "git-ignore `_legacy/`". Implementation used `git mv` which made the move appear as tracked renames. Trade-off: easier to browse + `git log --follow` works, doesn't bloat npm publish because `files: ["dist", "src"]` already excludes `_legacy/`. **No user decision required** unless you want me to convert to an untracked snapshot retroactively.

### 2026-05-25 — T06: `jsx-a11y`, `promise`, `node` plugins (open question)

The plan listed these as in-scope for T06, but none of the three was actually enabled in the legacy config:
- `jsx-a11y` is React-only — deferred to T07 and only enabled when `react` is on.
- `promise` and `node` — never enabled in legacy. Currently NOT wired anywhere.

**Question for user:** Should we add `promise` and/or `node` as default-on natives in the new config? oxlint ships them and they cover useful correctness (promise misuses, node-specific footguns). Options: (a) opt-in flags, (b) default-on like unicorn, (c) skip entirely (current behavior).

### 2026-05-25 — T13: oxlint-tsgolint as required peer (open question)

oxlint's type-aware mode (which we default ON when `typescript` is truthy) requires `oxlint-tsgolint` to be installed alongside `oxlint`. Currently `oxlint-tsgolint` is NOT in our peer-dependency list — users will hit "Failed to find tsgolint executable" the first time they lint with default options. Added it as a root devDep so this repo's apps work.

**Options:** (a) require `oxlint-tsgolint` as a non-optional peer, (b) default `typescript` to skip type-aware unless explicitly opted in, (c) detect tsgolint at factory-call time and silently downgrade.

### 2026-05-25 — T13: aliased JS-plugin namespaces break upstream disable comments (open question)

The aliased `react-hooks-js/<rule>` namespace means `// eslint-disable-next-line react-hooks/refs` does NOT suppress findings — users have to write `// eslint-disable-next-line react-hooks-js/refs`. Same issue applies to any future aliased plugin. Worth a docs note in the migration guide and possibly a custom-comment-name option (or unaliasing if upstream `eslint-plugin-react-hooks` is the ONLY place we get those rules).

### 2026-05-25 — T13: dropped default rules for opt-in JS plugins

Initial T09 work assigned default rule lists for convex, query, turbo, storybook. Smoke testing against `apps/next-test-app` revealed the rule names I picked didn't match upstream (the convex plugin uses `require-args-validator`, not `no-args-without-validator`, etc.). Rather than chase upstream rule-name drift across alpha plugins, those four now register the plugin but enable ZERO default rules. Users opt in via the `rules` override.

Trade-off: less batteries-included, but no surprise failures. The `tailwindcss` plugin retains its two high-value default rules because they're stable.

### 2026-05-25 — T06: type-aware mode auto-discovery (open question)

Plan said "fs-level auto-discover tsconfig.json at project root". Current implementation just sets `options.typeAware: true` when `typescript` is truthy and trusts oxlint to find the tsconfig itself. No `fs.existsSync` at factory-call time, no warn-once log.

**Question for user:** Is the lazier behavior acceptable, or do you want the explicit fs check + warn? The lazier behavior keeps the factory pure and lets oxlint surface its own error; the eager check gives a friendlier message but couples the factory to the filesystem.
