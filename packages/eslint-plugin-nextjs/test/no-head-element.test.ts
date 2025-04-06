import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-head-element");

const message =
  "Do not use `<head>` element. Use `<Head />` from `next/head` instead. See: https://nextjs.org/docs/messages/no-head-element";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
      export class MyComponent {
        render() {
          return (
            <div>
              <head>
                <title>My page title</title>
              </head>
            </div>
          );
        }
      }`,
      errors: [
        {
          message,
          type: "JSXOpeningElement",
        },
      ],
      filename: "./pages/index.js",
      name: "should report error when using head element in pages directory",
    },
    {
      code: `import Head from 'next/head';

      export class MyComponent {
        render() {
          return (
            <div>
              <head>
                <title>My page title</title>
              </head>
              <Head>
                <title>My page title</title>
              </Head>
            </div>
          );
        }
      }`,
      errors: [
        {
          message,
          type: "JSXOpeningElement",
        },
      ],
      filename: "pages/index.ts",
      name: "should report error when using both head element and Head component",
    },
  ],
  valid: [
    {
      code: `import Head from 'next/head';

      export class MyComponent {
        render() {
          return (
            <div>
              <Head>
                <title>My page title</title>
              </Head>
            </div>
          );
        }
      }
    `,
      filename: "pages/index.js",
      name: "should allow Head component from next/head in pages directory",
    },
    {
      code: `import Head from 'next/head';

      export class MyComponent {
        render() {
          return (
            <div>
              <Head>
                <title>My page title</title>
              </Head>
            </div>
          );
        }
      }
    `,
      filename: "pages/index.tsx",
      name: "should allow Head component from next/head in TypeScript files",
    },
    {
      code: `
      export default function Layout({ children }) {
        return (
          <html>
            <head>
              <title>layout</title>
            </head>
            <body>{children}</body>
          </html>
        );
      }
    `,
      filename: "./app/layout.js",
      name: "should allow head element in app directory layout files",
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
}).run("no-head-element", NextESLintRule, tests);
