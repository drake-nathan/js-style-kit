import type { EslintRuleConfig } from "../types.js";

// This fixes an index signature issue
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type NextjsRules = {
  "nextjs/google-font-display": EslintRuleConfig;
  "nextjs/google-font-preconnect": EslintRuleConfig;
  "nextjs/inline-script-id": EslintRuleConfig;
  "nextjs/next-script-for-ga": EslintRuleConfig;
  "nextjs/no-assign-module-variable": EslintRuleConfig;
  "nextjs/no-async-client-component": EslintRuleConfig;
  "nextjs/no-before-interactive-script-outside-document": EslintRuleConfig;
  "nextjs/no-css-tags": EslintRuleConfig;
  "nextjs/no-document-import-in-page": EslintRuleConfig;
  "nextjs/no-duplicate-head": EslintRuleConfig;
  "nextjs/no-head-element": EslintRuleConfig;
  "nextjs/no-head-import-in-document": EslintRuleConfig;
  "nextjs/no-html-link-for-pages": EslintRuleConfig;
  "nextjs/no-img-element": EslintRuleConfig;
  "nextjs/no-page-custom-font": EslintRuleConfig;
  "nextjs/no-script-component-in-head": EslintRuleConfig;
  "nextjs/no-styled-jsx-in-document": EslintRuleConfig;
  "nextjs/no-sync-scripts": EslintRuleConfig;
  "nextjs/no-title-in-document-head": EslintRuleConfig;
  "nextjs/no-typos": EslintRuleConfig;
  "nextjs/no-unwanted-polyfillio": EslintRuleConfig;
};
