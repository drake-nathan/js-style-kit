import type { ReactFramework, RulesRecord } from "../../types.js";

/**
 * Native `react` plugin rules. Includes core react, react-hooks (`rules-of-hooks`,
 * `exhaustive-deps`), and `only-export-components` (the equivalent of
 * `eslint-plugin-react-refresh/only-export-components`).
 *
 * Rules from the legacy config with no oxlint equivalent (intentionally
 * dropped): `react/destructuring-assignment`, `react/function-component-definition`
 * (general function-style is covered by `func-style` / prefer-arrow-functions
 * in T08), `react/jsx-no-leaked-render`, `react/jsx-uses-react`,
 * `react/jsx-uses-vars`, `react/no-deprecated`, `react/prop-types`.
 *
 * @param framework - React framework. Enables `react/only-export-components`
 *   only when framework is `vite` or `none` (the targets that use Fast Refresh
 *   directly; Next.js / Remix / React Router handle refresh themselves).
 */
export const buildReactRules = (framework: ReactFramework): RulesRecord => {
  const useRefresh = framework === "vite" || framework === "none";

  return {
    "react/button-has-type": "warn",
    "react/display-name": "warn",
    "react/exhaustive-deps": "warn",
    "react/jsx-boolean-value": "warn",
    "react/jsx-curly-brace-presence": "warn",
    "react/jsx-fragments": "warn",
    "react/jsx-key": "warn",
    "react/jsx-no-comment-textnodes": "warn",
    "react/jsx-no-duplicate-props": "warn",
    "react/jsx-no-target-blank": ["warn", { allowReferrer: true }],
    "react/jsx-no-undef": "warn",
    "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
    "react/jsx-pascal-case": "warn",
    "react/no-array-index-key": "warn",
    "react/no-children-prop": "warn",
    "react/no-danger-with-children": "warn",
    "react/no-direct-mutation-state": "warn",
    "react/no-find-dom-node": "warn",
    "react/no-is-mounted": "warn",
    "react/no-render-return-value": "warn",
    "react/no-string-refs": "warn",
    "react/no-unescaped-entities": "warn",
    "react/no-unknown-property": "warn",
    "react/no-unsafe": "warn",
    "react/no-unstable-nested-components": "warn",
    ...(useRefresh
      ? { "react/only-export-components": ["warn", { allowConstantExport: true }] }
      : {}),
    "react/require-render-return": "warn",
    "react/rules-of-hooks": "warn",
    "react/self-closing-comp": "warn",
  };
};

/**
 * React 19 hooks rules that ride on `eslint-plugin-react-hooks` via the
 * aliased `react-hooks-js/*` JS plugin namespace. oxlint's built-in
 * `react` plugin's hooks port lags these additions.
 *
 * These were "reactCompiler" rules in the legacy config; the
 * `react-compiler` plugin is archived and the rules now live in
 * upstream `eslint-plugin-react-hooks`.
 */
export const buildReactHooksJsRules = (): RulesRecord => ({
  "react-hooks-js/error-boundaries": "warn",
  "react-hooks-js/globals": "warn",
  "react-hooks-js/immutability": "warn",
  "react-hooks-js/incompatible-library": "warn",
  "react-hooks-js/preserve-manual-memoization": "warn",
  "react-hooks-js/purity": "warn",
  "react-hooks-js/refs": "warn",
  "react-hooks-js/set-state-in-effect": "warn",
  "react-hooks-js/set-state-in-render": "warn",
  "react-hooks-js/unsupported-syntax": "warn",
  "react-hooks-js/use-memo": "warn",
});
