import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-script-component-in-head");

const message =
  "`next/script` should not be used in `next/head` component. Move `<Script />` outside of `<Head>` instead. See: https://nextjs.org/docs/messages/no-script-component-in-head";

const tests = {
  invalid: [
    {
      code: `
      import Head from "next/head";
      import Script from "next/script";

      export default function Index() {
        return (
            <Head>
              <Script></Script>
            </Head>
        );
      }`,
      errors: [{ message }],
      filename: "pages/index.js",
    },
  ],

  valid: [
    `import Script from "next/script";
     const Head = ({children}) => children

    export default function Index() {
      return (
        <Head>
          <Script></Script>
        </Head>
      );
    }
    `,
  ],
};

describe("no-script-component-in-head", () => {
  new ESLintTesterV8({
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
      ecmaVersion: 2018,
      sourceType: "module",
    },
  }).run("eslint-v8", NextESLintRule, tests);

  new ESLintTesterV9({
    languageOptions: {
      ecmaVersion: 2018,
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
