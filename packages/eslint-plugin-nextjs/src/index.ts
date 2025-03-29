import type { ESLint, Linter, Rule } from "eslint";

import { googleFontDisplay } from "./rules/google-font-display.js";
import { googleFontPreconnect } from "./rules/google-font-preconnect.js";
import { inlineScriptId } from "./rules/inline-script-id.js";
import { nextScriptForGa } from "./rules/next-script-for-ga.js";
import { noAssignModuleVariable } from "./rules/no-assign-module-variable.js";
import { noAsyncClientComponent } from "./rules/no-async-client-component.js";
import { noBeforeInteractiveScriptOutsideDocument } from "./rules/no-before-interactive-script-outside-document.js";
import { noCssTags } from "./rules/no-css-tags.js";
import { noDocumentImportInPage } from "./rules/no-document-import-in-page.js";
import { noDuplicateHead } from "./rules/no-duplicate-head.js";
import { noHeadElement } from "./rules/no-head-element.js";
import { noHeadImportInDocument } from "./rules/no-head-import-in-document.js";
import { noHtmlLinkForPages } from "./rules/no-html-link-for-pages.js";
import { noImgElement } from "./rules/no-img-element.js";
import { noPageCustomFont } from "./rules/no-page-custom-font.js";
import { noScriptComponentInHead } from "./rules/no-script-component-in-head.js";
import { noStyledJsxInDocument } from "./rules/no-styled-jsx-in-document.js";
import { noSyncScripts } from "./rules/no-sync-scripts.js";
import { noTitleInDocumentHead } from "./rules/no-title-in-document-head.js";
import { noTypos } from "./rules/no-typos.js";
import { noUnwantedPolyfillio } from "./rules/no-unwanted-polyfillio.js";

/**
 * The namespace prefix for all rules in this plugin
 */
const name = "nextjs";

interface PluginConfig extends ESLint.Plugin {
  configs: {
    "core-web-vitals": Linter.LegacyConfig;
    "core-web-vitals/flat": Linter.Config;
    recommended: Linter.LegacyConfig;
    "recommended/flat": Linter.Config;
  };
  name: string;
  rules: {
    "nextjs/google-font-display": Rule.RuleModule;
    "nextjs/google-font-preconnect": Rule.RuleModule;
    "nextjs/inline-script-id": Rule.RuleModule;
    "nextjs/next-script-for-ga": Rule.RuleModule;
    "nextjs/no-assign-module-variable": Rule.RuleModule;
    "nextjs/no-async-client-component": Rule.RuleModule;
    "nextjs/no-before-interactive-script-outside-document": Rule.RuleModule;
    "nextjs/no-css-tags": Rule.RuleModule;
    "nextjs/no-document-import-in-page": Rule.RuleModule;
    "nextjs/no-duplicate-head": Rule.RuleModule;
    "nextjs/no-head-element": Rule.RuleModule;
    "nextjs/no-head-import-in-document": Rule.RuleModule;
    "nextjs/no-html-link-for-pages": Rule.RuleModule;
    "nextjs/no-img-element": Rule.RuleModule;
    "nextjs/no-page-custom-font": Rule.RuleModule;
    "nextjs/no-script-component-in-head": Rule.RuleModule;
    "nextjs/no-styled-jsx-in-document": Rule.RuleModule;
    "nextjs/no-sync-scripts": Rule.RuleModule;
    "nextjs/no-title-in-document-head": Rule.RuleModule;
    "nextjs/no-typos": Rule.RuleModule;
    "nextjs/no-unwanted-polyfillio": Rule.RuleModule;
  };
}

const plugin: ESLint.Plugin = {
  name,
  rules: {
    [`${name}/google-font-display`]: googleFontDisplay,
    [`${name}/google-font-preconnect`]: googleFontPreconnect,
    [`${name}/inline-script-id`]: inlineScriptId,
    [`${name}/next-script-for-ga`]: nextScriptForGa,
    [`${name}/no-assign-module-variable`]: noAssignModuleVariable,
    [`${name}/no-async-client-component`]: noAsyncClientComponent,
    [`${name}/no-before-interactive-script-outside-document`]:
      noBeforeInteractiveScriptOutsideDocument,
    [`${name}/no-css-tags`]: noCssTags,
    [`${name}/no-document-import-in-page`]: noDocumentImportInPage,
    [`${name}/no-duplicate-head`]: noDuplicateHead,
    [`${name}/no-head-element`]: noHeadElement,
    [`${name}/no-head-import-in-document`]: noHeadImportInDocument,
    [`${name}/no-html-link-for-pages`]: noHtmlLinkForPages,
    [`${name}/no-img-element`]: noImgElement,
    [`${name}/no-page-custom-font`]: noPageCustomFont,
    [`${name}/no-script-component-in-head`]: noScriptComponentInHead,
    [`${name}/no-styled-jsx-in-document`]: noStyledJsxInDocument,
    [`${name}/no-sync-scripts`]: noSyncScripts,
    [`${name}/no-title-in-document-head`]: noTitleInDocumentHead,
    [`${name}/no-typos`]: noTypos,
    [`${name}/no-unwanted-polyfillio`]: noUnwantedPolyfillio,
  },
};

const recommendedRules: Linter.RulesRecord = {
  // warnings
  "nextjs/google-font-display": "warn",
  "nextjs/google-font-preconnect": "warn",
  // errors
  "nextjs/inline-script-id": "error",
  "nextjs/next-script-for-ga": "warn",
  "nextjs/no-assign-module-variable": "error",
  "nextjs/no-async-client-component": "warn",
  "nextjs/no-before-interactive-script-outside-document": "warn",
  "nextjs/no-css-tags": "warn",
  "nextjs/no-document-import-in-page": "error",
  "nextjs/no-duplicate-head": "error",
  "nextjs/no-head-element": "warn",
  "nextjs/no-head-import-in-document": "error",
  "nextjs/no-html-link-for-pages": "warn",
  "nextjs/no-img-element": "warn",
  "nextjs/no-page-custom-font": "warn",
  "nextjs/no-script-component-in-head": "error",
  "nextjs/no-styled-jsx-in-document": "warn",
  "nextjs/no-sync-scripts": "warn",
  "nextjs/no-title-in-document-head": "warn",
  "nextjs/no-typos": "warn",
  "nextjs/no-unwanted-polyfillio": "warn",
};

const coreWebVitalsRules: Linter.RulesRecord = {
  ...recommendedRules,
  "nextjs/no-html-link-for-pages": "error",
  "nextjs/no-sync-scripts": "error",
};

const createRuleConfig = (
  pluginName: string,
  rules: Linter.RulesRecord,
  isFlat = false,
) => {
  return {
    plugins: isFlat ? { [pluginName]: plugin } : [pluginName],
    rules,
  };
};

const recommendedFlatConfig = createRuleConfig(name, recommendedRules, true);
const recommendedLegacyConfig = createRuleConfig(name, recommendedRules, false);
const coreWebVitalsFlatConfig = createRuleConfig(
  name,
  coreWebVitalsRules,
  true,
);
const coreWebVitalsLegacyConfig = createRuleConfig(
  name,
  coreWebVitalsRules,
  false,
);

/**
 * ESLint plugin for Next.js projects
 */
export default {
  ...plugin,
  configs: {
    /**
     * Legacy config (ESLint < v9) with Core Web Vitals rules (recommended with some warnings upgrade to errors)
     */
    "core-web-vitals": coreWebVitalsLegacyConfig,
    /**
     * Flat config (ESLint v9+) with Core Web Vitals rules (recommended with some warnings upgrade to errors)
     */
    "core-web-vitals/flat": coreWebVitalsFlatConfig,
    /**
     * Legacy config (ESLint < v9) with recommended rules
     */
    recommended: recommendedLegacyConfig,
    /**
     * Flat config (ESLint v9+) with recommended rules
     */
    "recommended/flat": recommendedFlatConfig,
  },
} as PluginConfig;

export const rules = plugin.rules;
