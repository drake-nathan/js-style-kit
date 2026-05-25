/**
 * Public option types for the three factories exported by `js-style-kit`:
 *
 * - {@link OxlintOptions}  — consumed by `oxlintConfig()`
 * - {@link OxfmtOptions}   — consumed by `oxfmtConfig()`
 * - {@link StyleKitOptions} — consumed by `styleKit()`; superset that drives
 *   both factories from a single options bag.
 *
 * Each option is annotated with whether it's backed by an **oxlint native
 * plugin** or by a **JS plugin** loaded via `jsPlugins`. JS plugins are still
 * in alpha — see `docs/OXLINT_MIGRATION.md` for the migration rationale.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/** oxlint rule severity. Mirrors ESLint's shape. */
export type RuleSeverity = "allow" | "deny" | "error" | "off" | "warn";

/**
 * A single rule override. Either a bare severity or a tuple of
 * `[severity, options]` / `[severity, options, options2]`.
 *
 * The shape intentionally matches what oxlint accepts under `rules` so user
 * overrides can be shallow-merged onto the final rule map.
 */
export type RuleEntry =
  | RuleSeverity
  | readonly [RuleSeverity]
  | readonly [RuleSeverity, unknown]
  | readonly [RuleSeverity, unknown, unknown];

/** Free-form `rules` map shallow-merged onto the final config. */
export type RulesRecord = Record<string, RuleEntry>;

/** File-pattern-scoped rule overrides; maps to oxlint's `overrides[]`. */
export interface RuleOverride {
  files: string[];
  rules: RulesRecord;
}

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type FilenameCase =
  | "camelCase"
  | "kebabCase"
  | "pascalCase"
  | "snakeCase";

/**
 * How functions should be written.
 *
 * - `"arrow"` (default): use `func-style` for declarations/expressions AND
 *   load `eslint-plugin-prefer-arrow-functions` (JS plugin) to push callbacks
 *   toward arrows.
 * - `"declaration"` / `"expression"`: use the built-in `func-style` rule only.
 * - `"off"`: no enforcement.
 */
export type FunctionStyle = "arrow" | "declaration" | "expression" | "off";

/**
 * Which React framework the consumer is using. Drives:
 * - whether the `nextjs` native plugin is enabled
 * - whether `react-refresh` rules apply (vite/none → yes; next/remix/react-router → no)
 */
export type ReactFramework =
  | "next"
  | "none"
  | "react-router"
  | "remix"
  | "vite";

/** Test runner / framework selection for the `testing` option. */
export type TestFramework = "bun" | "jest" | "node" | "vitest";

// ---------------------------------------------------------------------------
// Option sub-shapes
// ---------------------------------------------------------------------------

export interface ReactOptions {
  /** @default "none" */
  framework?: ReactFramework;
  /**
   * Explicit override for whether `react-refresh` rules are applied.
   * Defaults derive from {@link framework}: vite/none → true, otherwise false.
   */
  reactRefresh?: boolean;
}

export interface JsdocOptions {
  /**
   * Whether to require JSDoc blocks on public functions/classes.
   *
   * @default false
   */
  requireJsdoc?: boolean;
}

export interface UnicornOptions {
  /**
   * Filename casing enforced by `unicorn/filename-case`.
   *
   * @default "kebabCase"
   */
  filenameCase?: FilenameCase;
}

export interface TestingOptions {
  /** @default "test" */
  filenamePattern?: "spec" | "test";
  /** @default ["**\/*.{test,spec}.{ts,tsx,js,jsx}"] */
  files?: string[];
  /**
   * Apply formatting rules (padding around test blocks, etc.).
   *
   * @default true
   */
  formattingRules?: boolean;
  /** @default "vitest" */
  framework?: TestFramework;
  /**
   * Enforce that test helpers are imported from the right framework
   * (via `no-restricted-imports`).
   *
   * @default true
   */
  importRestrictions?: boolean;
  /** @default "it" */
  itOrTest?: "it" | "test";
}

export interface TailwindOptions {
  /**
   * Path to the project's Tailwind entry stylesheet. Required by some
   * `oxlint-tailwindcss` rules and by `oxfmt`'s `sortTailwindcss`.
   */
  stylesheet?: string;
  /**
   * Function/tagged-template names whose string args should be treated as
   * Tailwind class strings.
   *
   * @default ["clsx", "cva", "cn"]
   */
  functions?: string[];
}

// ---------------------------------------------------------------------------
// Oxlint options
// ---------------------------------------------------------------------------

export interface OxlintOptions {
  /**
   * Enable `@convex-dev/eslint-plugin` (JS plugin).
   *
   * @default false
   */
  convex?: boolean;
  /**
   * Function-style enforcement. See {@link FunctionStyle}.
   *
   * @default "arrow"
   */
  functionStyle?: FunctionStyle;
  /**
   * Additional ignore patterns appended to oxlint's `ignorePatterns`.
   * `node_modules`, `dist`, and `build` are always ignored.
   */
  ignores?: string[];
  /**
   * Enable oxlint's native `import` plugin.
   *
   * @default true
   */
  importPlugin?: boolean;
  /**
   * JSDoc rules (native `jsdoc` plugin). Pass `false` to disable.
   *
   * @default { requireJsdoc: false }
   */
  jsdoc?: false | JsdocOptions;
  /**
   * File-pattern-scoped rule overrides. Translated to oxlint's `overrides[]`.
   * User-supplied entries are appended to the package's defaults.
   */
  overrides?: RuleOverride[];
  /**
   * Enable `@tanstack/eslint-plugin-query` (JS plugin).
   *
   * @default false
   */
  query?: boolean;
  /**
   * Enable React rules (native `react` + `react-hooks` + aliased
   * `react-hooks-js` JS plugin for React 19 additions).
   *
   * @default false
   */
  react?: boolean | ReactOptions;
  /**
   * Shallow-merged onto the final root `rules` map. Use {@link overrides}
   * for file-scoped tweaks.
   */
  rules?: RulesRecord;
  /**
   * Enable non-import sorting rules from `eslint-plugin-perfectionist`
   * (JS plugin). Import sorting is owned by oxfmt.
   *
   * @default true
   */
  sorting?: boolean;
  /**
   * Enable `eslint-plugin-storybook` rules (JS plugin), scoped to
   * `*.stories.*` files via overrides.
   *
   * @default false
   */
  storybook?: boolean;
  /**
   * Testing rules (native `vitest` / `jest`, framework-dependent). Pass
   * `false` to disable.
   */
  testing?: false | TestingOptions;
  /**
   * Tailwind lint rules (`oxlint-tailwindcss` JS plugin). Pass an object
   * to point at the stylesheet / class-detection helpers.
   *
   * @default false
   */
  tailwind?: boolean | TailwindOptions;
  /**
   * Enable `eslint-plugin-turbo` (JS plugin).
   *
   * @default false
   */
  turbo?: boolean;
  /**
   * Enable native TypeScript rules. Type-aware rules require a tsconfig:
   * - `true` (default): auto-discover `tsconfig.json` at the project root;
   *   enable type-aware rules if found.
   * - `string`: explicit tsconfig path.
   * - `false`: disable TypeScript rules entirely.
   */
  typescript?: boolean | string;
  /**
   * Enable native `unicorn` rules. Pass an object to customize.
   *
   * @default { filenameCase: "kebabCase" }
   */
  unicorn?: boolean | UnicornOptions;
}

// ---------------------------------------------------------------------------
// Oxfmt options
// ---------------------------------------------------------------------------

export interface JsdocFormatOptions {
  /**
   * Treat single-line jsdoc blocks as candidates for wrapping.
   *
   * @default true
   */
  multiline?: boolean;
}

export interface SortImportsOptions {
  /**
   * Group ordering for import sorting, mirroring
   * `eslint-plugin-perfectionist/sort-imports`.
   */
  groups?: ReadonlyArray<string | readonly string[]>;
}

export interface OxfmtOptions {
  /**
   * jsdoc formatter pass. Pass an object to configure.
   *
   * @default false
   */
  jsdoc?: boolean | JsdocFormatOptions;
  /**
   * Native import sorting. Pass `false` to disable, an object to customize
   * groups.
   *
   * @default true (default groups)
   */
  sortImports?: boolean | SortImportsOptions;
  /**
   * Sort `package.json` keys.
   *
   * @default true
   */
  sortPackageJson?: boolean;
  /**
   * Tailwind class sorting. Pass an object to point at the stylesheet /
   * helper functions.
   *
   * @default false
   */
  tailwind?: boolean | TailwindOptions;
}

// ---------------------------------------------------------------------------
// StyleKit options (unified)
// ---------------------------------------------------------------------------

/**
 * Unified options for {@link styleKit}. A superset of {@link OxlintOptions}
 * and {@link OxfmtOptions} with shared concerns reconciled in one place — so
 * `tailwind: true` toggles BOTH lint rules AND class sorting, `react.framework`
 * propagates to whichever side needs it, etc.
 *
 * Lint-only options live under {@link lint}; format-only options live under
 * {@link format}.
 */
export interface StyleKitOptions {
  /**
   * Enable `@convex-dev/eslint-plugin` (lint only).
   *
   * @default false
   */
  convex?: boolean;
  /**
   * Per-side overrides for anything that doesn't have a shared knob.
   */
  format?: Omit<OxfmtOptions, "tailwind">;
  /** @default "arrow" */
  functionStyle?: FunctionStyle;
  /** Additional ignore patterns (lint only — oxfmt has its own ignore file). */
  ignores?: string[];
  /**
   * Per-side overrides for anything that doesn't have a shared knob.
   */
  lint?: Omit<
    OxlintOptions,
    | "convex"
    | "functionStyle"
    | "ignores"
    | "react"
    | "storybook"
    | "tailwind"
    | "turbo"
    | "typescript"
  >;
  /**
   * Enable React rules.
   *
   * @default false
   */
  react?: boolean | ReactOptions;
  /**
   * Enable storybook rules (lint only, scoped to `*.stories.*`).
   *
   * @default false
   */
  storybook?: boolean;
  /**
   * Tailwind. Drives BOTH the lint side (`oxlint-tailwindcss` JS plugin)
   * AND the format side (oxfmt's `sortTailwindcss`).
   *
   * @default false
   */
  tailwind?: boolean | TailwindOptions;
  /**
   * Enable `eslint-plugin-turbo` (lint only).
   *
   * @default false
   */
  turbo?: boolean;
  /**
   * TypeScript rules + type-aware mode. See {@link OxlintOptions.typescript}.
   *
   * @default true
   */
  typescript?: boolean | string;
  /**
   * Hint for the CLI emit path. When `true`, the `js-style-kit init` CLI
   * emits Vite+ inline instructions instead of writing standalone
   * `oxlint.config.ts` / `oxfmt.config.ts` files. Has no effect at
   * factory-call time.
   *
   * @default auto-detected from package.json deps
   */
  vitePlus?: boolean;
}
