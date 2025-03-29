import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-head-import-in-document");

const tests = {
  invalid: [
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import Head from 'next/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      errors: [
        {
          message:
            "`next/head` should not be imported in `pages/_document.js`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document",
          type: "ImportDeclaration",
        },
      ],
      filename: "pages/_document.js",
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import Head from 'next/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      errors: [
        {
          message:
            "`next/head` should not be imported in `pages/_document.page.tsx`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document",
          type: "ImportDeclaration",
        },
      ],
      filename: "pages/_document.page.tsx",
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import Head from 'next/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      errors: [
        {
          message:
            "`next/head` should not be imported in `pages/_document/index.js`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document",
          type: "ImportDeclaration",
        },
      ],
      filename: "pages/_document/index.js",
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import Head from 'next/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      errors: [
        {
          message:
            "`next/head` should not be imported in `pages/_document/index.tsx`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document",
          type: "ImportDeclaration",
        },
      ],
      filename: "pages/_document/index.tsx",
    },
  ],
  valid: [
    {
      code: `import Document, { Html, Head, Main, NextScript } from 'next/document'

      class MyDocument extends Document {
        static async getInitialProps(ctx) {
          //...
        }

        render() {
          return (
            <Html>
              <Head>
              </Head>
            </Html>
          )
        }
      }

      export default MyDocument
    `,
      filename: "pages/_document.tsx",
    },
    {
      code: `import Head from "next/head";

      export default function IndexPage() {
        return (
          <Head>
            <title>My page title</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
        );
      }
    `,
      filename: "pages/index.tsx",
    },
  ],
};

describe("no-head-import-in-document", () => {
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
