import type { ESLint, Linter } from "eslint";

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

const plugin: ESLint.Plugin = {
  rules: {
    "google-font-display": googleFontDisplay,
    "google-font-preconnect": googleFontPreconnect,
    "inline-script-id": inlineScriptId,
    "next-script-for-ga": nextScriptForGa,
    "no-assign-module-variable": noAssignModuleVariable,
    "no-async-client-component": noAsyncClientComponent,
    "no-before-interactive-script-outside-document":
      noBeforeInteractiveScriptOutsideDocument,
    "no-css-tags": noCssTags,
    "no-document-import-in-page": noDocumentImportInPage,
    "no-duplicate-head": noDuplicateHead,
    "no-head-element": noHeadElement,
    "no-head-import-in-document": noHeadImportInDocument,
    "no-html-link-for-pages": noHtmlLinkForPages,
    "no-img-element": noImgElement,
    "no-page-custom-font": noPageCustomFont,
    "no-script-component-in-head": noScriptComponentInHead,
    "no-styled-jsx-in-document": noStyledJsxInDocument,
    "no-sync-scripts": noSyncScripts,
    "no-title-in-document-head": noTitleInDocumentHead,
    "no-typos": noTypos,
    "no-unwanted-polyfillio": noUnwantedPolyfillio,
  },
};

const recommendedRules: Linter.RulesRecord = {
  // warnings
  "google-font-display": "warn",
  "google-font-preconnect": "warn",
  // errors
  "inline-script-id": "error",
  "next-script-for-ga": "warn",
  "no-assign-module-variable": "error",
  "no-async-client-component": "warn",
  "no-before-interactive-script-outside-document": "warn",
  "no-css-tags": "warn",
  "no-document-import-in-page": "error",
  "no-duplicate-head": "error",
  "no-head-element": "warn",
  "no-head-import-in-document": "error",
  "no-html-link-for-pages": "warn",
  "no-img-element": "warn",
  "no-page-custom-font": "warn",
  "no-script-component-in-head": "error",
  "no-styled-jsx-in-document": "warn",
  "no-sync-scripts": "warn",
  "no-title-in-document-head": "warn",
  "no-typos": "warn",
  "no-unwanted-polyfillio": "warn",
};

const coreWebVitalsRules: Linter.RulesRecord = {
  ...recommendedRules,
  "no-html-link-for-pages": "error",
  "no-sync-scripts": "error",
};

const createRuleConfig = (rules: Linter.RulesRecord, isFlat = false) => {
  return {
    plugins: isFlat ? { nextjs: plugin } : ["nextjs"],
    rules,
  };
};

const recommendedFlatConfig = createRuleConfig(recommendedRules, true);
const recommendedLegacyConfig = createRuleConfig(recommendedRules, false);
const coreWebVitalsFlatConfig = createRuleConfig(coreWebVitalsRules, true);
const coreWebVitalsLegacyConfig = createRuleConfig(coreWebVitalsRules, false);

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
  name: "nextjs",
};

export const rules = plugin.rules;
