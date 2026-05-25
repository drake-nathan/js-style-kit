import {
  type JsdocUserConfig,
  type OxfmtConfig,
  type SortImportsConfig,
  type SortTailwindcssConfig,
  defineConfig,
} from "oxfmt";

import type {
  OxfmtOptions,
  SortImportsOptions,
  TailwindOptions,
} from "../types.js";

const isObject = <T extends object>(value: unknown): value is T =>
  value !== null && typeof value === "object";

const DEFAULT_TAILWIND_FUNCTIONS = ["clsx", "cva", "cn"];

const buildSortImportsConfig = (
  input: boolean | SortImportsOptions | undefined,
): boolean | SortImportsConfig => {
  if (input === undefined || input === true) return true;
  if (input === false) return false;
  return input as SortImportsConfig;
};

const buildSortTailwindcssConfig = (
  input: true | TailwindOptions,
): SortTailwindcssConfig => {
  if (input === true) {
    return { functions: DEFAULT_TAILWIND_FUNCTIONS };
  }
  const cfg: SortTailwindcssConfig = {
    functions: input.functions ?? DEFAULT_TAILWIND_FUNCTIONS,
  };
  if (input.stylesheet) cfg.stylesheet = input.stylesheet;
  return cfg;
};

/**
 * Build an oxfmt configuration object suitable for spreading into
 * `defineConfig(...)` in an `oxfmt.config.ts`, or passing inline to Vite+.
 *
 * Exposes only the natives the style-kit cares about: `sortImports` (default
 * on), `sortPackageJson` (default on), `sortTailwindcss` (off unless `tailwind`
 * is truthy), `jsdoc` (off by default). All other oxfmt knobs (printWidth,
 * singleQuote, semi, etc.) fall through via Oxfmtrc's open-ended index signature
 * — users can set them on the returned config directly, or pass them in the
 * Vite+ `format` block.
 */
export const oxfmtConfig = (options: OxfmtOptions = {}): OxfmtConfig => {
  const {
    jsdoc = false,
    sortImports = true,
    sortPackageJson = true,
    tailwind = false,
  } = options;

  const cfg: OxfmtConfig = {
    jsdoc: jsdoc as JsdocUserConfig,
    sortImports: buildSortImportsConfig(sortImports),
    sortPackageJson,
  };

  if (tailwind) {
    cfg.sortTailwindcss = buildSortTailwindcssConfig(
      isObject<TailwindOptions>(tailwind) ? tailwind : true,
    );
  }

  return defineConfig(cfg);
};
