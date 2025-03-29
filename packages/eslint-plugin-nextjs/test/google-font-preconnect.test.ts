import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("google-font-preconnect");

const tests = {
  invalid: [
    {
      code: `
      export const Test = () => (
        <div>
          <link href="https://fonts.gstatic.com"/>
        </div>
      )
    `,
      errors: [
        {
          message:
            '`rel="preconnect"` is missing from Google Font. See: https://nextjs.org/docs/messages/google-font-preconnect',
          type: "JSXOpeningElement",
        },
      ],
    },
    {
      code: `
      export const Test = () => (
        <div>
          <link rel="preload" href="https://fonts.gstatic.com"/>
        </div>
      )
    `,
      errors: [
        {
          message:
            '`rel="preconnect"` is missing from Google Font. See: https://nextjs.org/docs/messages/google-font-preconnect',
          type: "JSXOpeningElement",
        },
      ],
    },
  ],

  valid: [
    `export const Test = () => (
        <div>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link
            href={process.env.NEXT_PUBLIC_CANONICAL_URL}
            rel="canonical"
          />
          <link
            href={new URL("../public/favicon.ico", import.meta.url).toString()}
            rel="icon"
          />
        </div>
      )
    `,
  ],
};

describe("google-font-preconnect", () => {
  new ESLintTesterV8({
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
      ecmaVersion: 2020,
      sourceType: "module",
    },
  }).run("eslint-v8", NextESLintRule, tests);

  new ESLintTesterV9({
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          modules: true,
        },
      },
      sourceType: "module",
    },
  }).run("eslint-v9", NextESLintRule, tests);
});
