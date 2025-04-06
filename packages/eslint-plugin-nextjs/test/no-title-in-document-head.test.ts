import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-title-in-document-head");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
      import { Head } from "next/document";

      class Test {
        render() {
          return (
            <Head>
              <title>My page title</title>
            </Head>
          );
        }
      }`,
      errors: [
        {
          message:
            "Do not use `<title>` element with `<Head />` component from `next/document`. Titles should defined at the page-level using `<Head />` from `next/head` instead. See: https://nextjs.org/docs/messages/no-title-in-document-head",
          type: "JSXElement",
        },
      ],
      name: "should report error when using title element in document Head component",
    },
  ],

  valid: [
    {
      code: `import Head from "next/head";

     class Test {
      render() {
        return (
          <Head>
            <title>My page title</title>
          </Head>
        );
      }
     }`,
      name: "should allow title element in regular Head component from next/head",
    },

    {
      code: `import Document, { Html, Head } from "next/document";

     class MyDocument extends Document {
      render() {
        return (
          <Html>
            <Head>
            </Head>
          </Html>
        );
      }
     }

     export default MyDocument;
     `,
      name: "should allow document Head component without title element",
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
}).run("no-title-in-document-head", NextESLintRule, tests);
