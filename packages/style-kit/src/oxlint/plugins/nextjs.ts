import type { RulesRecord } from "../../types.js";

/**
 * Native `nextjs` plugin rules. Replaces the legacy `eslint-plugin-nextjs`
 * fork that lived as a sub-package in this monorepo. 1:1 rule mapping.
 */
export const buildNextjsRules = (): RulesRecord => ({
  "nextjs/google-font-display": "warn",
  "nextjs/google-font-preconnect": "warn",
  "nextjs/inline-script-id": "warn",
  "nextjs/next-script-for-ga": "warn",
  "nextjs/no-assign-module-variable": "warn",
  "nextjs/no-async-client-component": "warn",
  "nextjs/no-before-interactive-script-outside-document": "warn",
  "nextjs/no-css-tags": "warn",
  "nextjs/no-document-import-in-page": "warn",
  "nextjs/no-duplicate-head": "warn",
  "nextjs/no-head-element": "warn",
  "nextjs/no-head-import-in-document": "warn",
  "nextjs/no-html-link-for-pages": "warn",
  "nextjs/no-img-element": "warn",
  "nextjs/no-page-custom-font": "warn",
  "nextjs/no-script-component-in-head": "warn",
  "nextjs/no-styled-jsx-in-document": "warn",
  "nextjs/no-sync-scripts": "warn",
  "nextjs/no-title-in-document-head": "warn",
  "nextjs/no-typos": "warn",
  "nextjs/no-unwanted-polyfillio": "warn",
});
