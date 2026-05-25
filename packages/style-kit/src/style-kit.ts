import type { OxfmtConfig } from "oxfmt";
import type { OxlintConfig } from "oxlint";

import type {
  OxfmtOptions,
  OxlintOptions,
  StyleKitOptions,
} from "./types.js";

import { oxfmtConfig } from "./oxfmt/index.js";
import { oxlintConfig } from "./oxlint/index.js";

/**
 * Unified entry point. Returns both an oxlint config object and an
 * oxfmt config object derived from a single options bag. Shared
 * concerns (tailwind, react, typescript, function-style, ignores) are
 * routed to whichever side(s) care; per-side knobs live under
 * `options.lint` and `options.format`.
 *
 * Use this when you want one source of truth for both tools:
 *
 * ```ts
 * // oxlint.config.ts
 * import { styleKit } from "js-style-kit";
 *
 * export default styleKit({ react: { framework: "next" }, tailwind: true }).oxlint;
 *
 * // oxfmt.config.ts
 * export default styleKit({ react: { framework: "next" }, tailwind: true }).oxfmt;
 * ```
 *
 * Or, inline in Vite+'s `vite.config.ts`:
 *
 * ```ts
 * import { styleKit } from "js-style-kit";
 *
 * const { oxlint, oxfmt } = styleKit({ react: true, tailwind: true });
 *
 * export default defineConfig({ lint: oxlint, format: oxfmt });
 * ```
 */
export const styleKit = (
  options: StyleKitOptions = {},
): { oxfmt: OxfmtConfig; oxlint: OxlintConfig } => {
  const {
    convex = false,
    format: formatOverrides = {},
    functionStyle = "arrow",
    ignores = [],
    lint: lintOverrides = {},
    react = false,
    storybook = false,
    tailwind = false,
    turbo = false,
    typescript = true,
  } = options;

  const oxlintOpts: OxlintOptions = {
    ...lintOverrides,
    convex,
    functionStyle,
    ignores,
    react,
    storybook,
    tailwind,
    turbo,
    typescript,
  };

  const oxfmtOpts: OxfmtOptions = {
    ...formatOverrides,
    tailwind,
  };

  return {
    oxfmt: oxfmtConfig(oxfmtOpts),
    oxlint: oxlintConfig(oxlintOpts),
  };
};
