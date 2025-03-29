import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-head-element");

const message =
  "Do not use `<head>` element. Use `<Head />` from `next/head` instead. See: https://nextjs.org/docs/messages/no-head-element";

const tests = {
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
    },
  ],
};

describe("no-head-element", () => {
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
