import { type OxlintConfig, defineConfig } from "oxlint";

import type {
  JsdocOptions,
  OxlintOptions,
  RulesRecord,
  UnicornOptions,
} from "../types.js";

import { buildBaseRules } from "./base-rules.js";
import { buildImportRules } from "./plugins/import.js";
import { buildJsdocRules } from "./plugins/jsdoc.js";
import { buildTypescriptRules } from "./plugins/typescript.js";
import { buildUnicornRules } from "./plugins/unicorn.js";

/**
 * Always-on ignore patterns. User-supplied `ignores` are appended.
 */
const DEFAULT_IGNORES = ["**/node_modules/**", "**/dist/**", "**/build/**"];

const isObject = <T extends object>(value: unknown): value is T =>
  value !== null && typeof value === "object";

/**
 * Build an oxlint configuration object suitable for spreading into
 * `defineConfig(...)` in an `oxlint.config.ts`, or passing inline to Vite+.
 *
 * Wires the native built-in plugins (`eslint`, `typescript`, `import`,
 * `unicorn`, `jsdoc`) per the options. JS plugins (perfectionist,
 * prefer-arrow-functions, react-hooks alias, etc.) are layered on in T07+.
 */
export const oxlintConfig = (options: OxlintOptions = {}): OxlintConfig => {
  const {
    functionStyle = "arrow",
    ignores = [],
    importPlugin = true,
    jsdoc = { requireJsdoc: false },
    overrides: userOverrides = [],
    rules: userRules,
    typescript = true,
    unicorn = { filenameCase: "kebabCase" },
  } = options;

  const ignorePatterns = [...DEFAULT_IGNORES, ...ignores];
  const tsOn = Boolean(typescript);

  // Plugin list (native, Rust-backed). Order matters for readability only.
  const plugins: OxlintConfig["plugins"] = ["eslint"];
  if (tsOn) plugins.push("typescript");
  if (importPlugin) plugins.push("import");
  if (unicorn) plugins.push("unicorn");
  if (jsdoc !== false) plugins.push("jsdoc");

  // Assemble rules.
  let rules: RulesRecord = { ...buildBaseRules(functionStyle, tsOn) };

  if (tsOn) {
    rules = { ...rules, ...buildTypescriptRules() };
  }
  if (importPlugin) {
    rules = { ...rules, ...buildImportRules(tsOn) };
  }
  if (unicorn) {
    const filenameCase = isObject<UnicornOptions>(unicorn)
      ? unicorn.filenameCase
      : undefined;
    rules = { ...rules, ...buildUnicornRules(filenameCase) };
  }
  if (jsdoc !== false) {
    const requireJsdoc = isObject<JsdocOptions>(jsdoc)
      ? Boolean(jsdoc.requireJsdoc)
      : false;
    rules = { ...rules, ...buildJsdocRules(requireJsdoc) };
  }

  // User overrides win (shallow merge).
  if (userRules) {
    rules = { ...rules, ...userRules };
  }

  return defineConfig({
    ignorePatterns,
    jsPlugins: [],
    options: {
      // Type-aware rules. Default ON when `typescript` is truthy and the
      // host has `oxlint-tsgolint` installed; oxlint surfaces its own
      // diagnostic if the tsconfig can't be found or the binding is
      // missing. The user can pass `typescript: false` to disable.
      typeAware: tsOn,
    },
    overrides: userOverrides,
    plugins,
    rules,
  });
};
