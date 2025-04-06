import type { ESLint, Linter } from "eslint";

import fs from "node:fs";

import { googleFontDisplay } from "./rules/google-font-display.js";
// import { googleFontPreconnect } from "./rules/google-font-preconnect.js";
// import { inlineScriptId } from "./rules/inline-script-id.js";
// import { nextScriptForGa } from "./rules/next-script-for-ga.js";
// import { noAssignModuleVariable } from "./rules/no-assign-module-variable.js";
// import { noAsyncClientComponent } from "./rules/no-async-client-component.js";
// import { noBeforeInteractiveScriptOutsideDocument } from "./rules/no-before-interactive-script-outside-document.js";
// import { noCssTags } from "./rules/no-css-tags.js";
// import { noDocumentImportInPage } from "./rules/no-document-import-in-page.js";
// import { noDuplicateHead } from "./rules/no-duplicate-head.js";
// import { noHeadElement } from "./rules/no-head-element.js";
// import { noHeadImportInDocument } from "./rules/no-head-import-in-document.js";
// import { noHtmlLinkForPages } from "./rules/no-html-link-for-pages.js";
// import { noImgElement } from "./rules/no-img-element.js";
// import { noPageCustomFont } from "./rules/no-page-custom-font.js";
// import { noScriptComponentInHead } from "./rules/no-script-component-in-head.js";
// import { noStyledJsxInDocument } from "./rules/no-styled-jsx-in-document.js";
// import { noSyncScripts } from "./rules/no-sync-scripts.js";
// import { noTitleInDocumentHead } from "./rules/no-title-in-document-head.js";
// import { noTypos } from "./rules/no-typos.js";
// import { noUnwantedPolyfillio } from "./rules/no-unwanted-polyfillio.js";

const pkg = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const plugin: ESLint.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  // rule definitions
  rules: {
    "google-font-display": googleFontDisplay,
    // "google-font-preconnect": googleFontPreconnect,
    // "inline-script-id": inlineScriptId,
    // "next-script-for-ga": nextScriptForGa,
    // "no-assign-module-variable": noAssignModuleVariable,
    // "no-async-client-component": noAsyncClientComponent,
    // "no-before-interactive-script-outside-document":
    //   noBeforeInteractiveScriptOutsideDocument,
    // "no-css-tags": noCssTags,
    // "no-document-import-in-page": noDocumentImportInPage,
    // "no-duplicate-head": noDuplicateHead,
    // "no-head-element": noHeadElement,
    // "no-head-import-in-document": noHeadImportInDocument,
    // "no-html-link-for-pages": noHtmlLinkForPages,
    // "no-img-element": noImgElement,
    // "no-page-custom-font": noPageCustomFont,
    // "no-script-component-in-head": noScriptComponentInHead,
    // "no-styled-jsx-in-document": noStyledJsxInDocument,
    // "no-sync-scripts": noSyncScripts,
    // "no-title-in-document-head": noTitleInDocumentHead,
    // "no-typos": noTypos,
    // "no-unwanted-polyfillio": noUnwantedPolyfillio,
  },
};

/**
 * Same as `@next/eslint-plugin-next` but only warnings.
 */
const recommendedRules: Linter.RulesRecord = {
  "nextjs/google-font-display": "warn",
  // "nextjs/google-font-preconnect": "warn",
  // "nextjs/inline-script-id": "warn",
  // "nextjs/next-script-for-ga": "warn",
  // "nextjs/no-assign-module-variable": "warn",
  // "nextjs/no-async-client-component": "warn",
  // "nextjs/no-before-interactive-script-outside-document": "warn",
  // "nextjs/no-css-tags": "warn",
  // "nextjs/no-document-import-in-page": "warn",
  // "nextjs/no-duplicate-head": "warn",
  // "nextjs/no-head-element": "warn",
  // "nextjs/no-head-import-in-document": "warn",
  // "nextjs/no-html-link-for-pages": "warn",
  // "nextjs/no-img-element": "warn",
  // "nextjs/no-page-custom-font": "warn",
  // "nextjs/no-script-component-in-head": "warn",
  // "nextjs/no-styled-jsx-in-document": "warn",
  // "nextjs/no-sync-scripts": "warn",
  // "nextjs/no-title-in-document-head": "warn",
  // "nextjs/no-typos": "warn",
  // "nextjs/no-unwanted-polyfillio": "warn",
};

/**
 * The only config we need because we're only using warnings.
 */
const recommendedConfig: Linter.Config = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: {
    nextjs: plugin,
  },
  rules: recommendedRules,
};

/**
 * ESLint V9 plugin for Next.js projects
 */
const nextjsPlugin: ESLint.Plugin = {
  ...plugin,
  configs: {
    recommended: recommendedConfig,
  },
};

export default nextjsPlugin;
