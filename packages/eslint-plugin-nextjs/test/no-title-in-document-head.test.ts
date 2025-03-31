import { describe } from "bun:test";
import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-title-in-document-head");

const tests = {
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
    },
  ],

  valid: [
    `import Head from "next/head";

     class Test {
      render() {
        return (
          <Head>
            <title>My page title</title>
          </Head>
        );
      }
     }`,

    `import Document, { Html, Head } from "next/document";

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
  ],
};

describe("no-title-in-document-head", () => {
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
  }).run("eslint", NextESLintRule, tests);
});
