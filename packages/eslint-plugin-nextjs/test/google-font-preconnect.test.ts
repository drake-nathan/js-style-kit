import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("google-font-preconnect");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
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
      name: "should report error when rel attribute is missing from Google Font link",
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
      name: "should report error when rel attribute is not 'preconnect' for Google Font link",
    },
  ],

  valid: [
    {
      code: `export const Test = () => (
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
      name: "should allow Google Font link with rel='preconnect' and other non-Google Font links",
    },
  ],
};

new RuleTester({
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
}).run("google-font-preconnect", NextESLintRule, tests);
