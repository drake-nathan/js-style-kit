import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-script-component-in-head");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const message =
  "`next/script` should not be used in `next/head` component. Move `<Script />` outside of `<Head>` instead. See: https://nextjs.org/docs/messages/no-script-component-in-head";

const tests: Tests = {
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
      name: "should report error when using Script component inside Head component",
    },
  ],

  valid: [
    {
      code: `import Script from "next/script";
     const Head = ({children}) => children

    export default function Index() {
      return (
        <Head>
          <Script></Script>
        </Head>
      );
    }
    `,
      name: "should allow Script component inside custom Head component",
    },
  ],
};

new RuleTester({
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
}).run("no-script-component-in-head", NextESLintRule, tests);
