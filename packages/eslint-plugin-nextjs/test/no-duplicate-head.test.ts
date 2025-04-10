import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-duplicate-head");

const message =
  "Do not include multiple instances of `<Head/>`. See: https://nextjs.org/docs/messages/no-duplicate-head";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
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
              <Head />
              <Head />
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      errors: [
        {
          message,
          type: "JSXElement",
        },
        {
          message,
          type: "JSXElement",
        },
      ],
      filename: "pages/_document.js",
      name: "should report error when multiple Head components are used in _document.js",
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import Head from 'next/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head>
                <meta charSet="utf-8" />
                <link
                  href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                  rel="stylesheet"
                />
              </Head>
              <body>
                <Main />
                <NextScript />
              </body>
              <Head>
                <script
                  dangerouslySetInnerHTML={{
                    __html: '',
                  }}
                />
              </Head>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      errors: [
        {
          message,
          type: "JSXElement",
        },
      ],
      filename: "pages/_document.page.tsx",
      name: "should report error when Head component is used multiple times with content in _document.page.tsx",
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
              <Head/>
            </Html>
          )
        }
      }

      export default MyDocument
    `,
      filename: "pages/_document.js",
      name: "should allow single Head component in _document.js",
    },
    {
      code: `import Document, { Html, Head, Main, NextScript } from 'next/document'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head>
                <meta charSet="utf-8" />
                <link
                  href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                  rel="stylesheet"
                />
              </Head>
            </Html>
          )
        }
      }

      export default MyDocument
    `,
      filename: "pages/_document.tsx",
      name: "should allow single Head component with content in _document.tsx",
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
}).run("no-duplicate-head", NextESLintRule, tests);
