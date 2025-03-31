import type { Rule } from "eslint";

// Direct imports of rules to avoid circular dependencies
import { googleFontDisplay } from "../../src/rules/google-font-display.js";
import { googleFontPreconnect } from "../../src/rules/google-font-preconnect.js";
import { inlineScriptId } from "../../src/rules/inline-script-id.js";
import { nextScriptForGa } from "../../src/rules/next-script-for-ga.js";
import { noAssignModuleVariable } from "../../src/rules/no-assign-module-variable.js";
import { noAsyncClientComponent } from "../../src/rules/no-async-client-component.js";
import { noBeforeInteractiveScriptOutsideDocument } from "../../src/rules/no-before-interactive-script-outside-document.js";
import { noCssTags } from "../../src/rules/no-css-tags.js";
import { noDocumentImportInPage } from "../../src/rules/no-document-import-in-page.js";
import { noDuplicateHead } from "../../src/rules/no-duplicate-head.js";
import { noHeadElement } from "../../src/rules/no-head-element.js";
import { noHeadImportInDocument } from "../../src/rules/no-head-import-in-document.js";
import { noHtmlLinkForPages } from "../../src/rules/no-html-link-for-pages.js";
import { noImgElement } from "../../src/rules/no-img-element.js";
import { noPageCustomFont } from "../../src/rules/no-page-custom-font.js";
import { noScriptComponentInHead } from "../../src/rules/no-script-component-in-head.js";
import { noStyledJsxInDocument } from "../../src/rules/no-styled-jsx-in-document.js";
import { noSyncScripts } from "../../src/rules/no-sync-scripts.js";
import { noTitleInDocumentHead } from "../../src/rules/no-title-in-document-head.js";
import { noTypos } from "../../src/rules/no-typos.js";
import { noUnwantedPolyfillio } from "../../src/rules/no-unwanted-polyfillio.js";

// Map of rule names to rule modules
const ruleMap: Record<string, Rule.RuleModule> = {
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
};

/**
 * Helper function to get a specific ESLint rule for testing
 */
export const getRule = (ruleName: string): Rule.RuleModule => {
  const rule = ruleMap[ruleName];

  if (!rule) {
    throw new Error(`Rule ${ruleName} not found`);
  }

  return rule;
};
