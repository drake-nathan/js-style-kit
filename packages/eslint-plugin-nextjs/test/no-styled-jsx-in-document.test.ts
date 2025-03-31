import { describe } from "bun:test";
import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-styled-jsx-in-document");

const tests = {
  invalid: [
    {
      code: `
            import Document, { Html, Head, Main, NextScript } from 'next/document'

            export class MyDocument extends Document {
              static async getInitialProps(ctx) {
                const initialProps = await Document.getInitialProps(ctx)
                return { ...initialProps }
              }

              render() {
                return (
                  <Html>
                    <Head />
                    <style jsx>{"\
                    body{\
                      color:red;\
                    }\
                    "}</style>
                    <body>
                      <Main />
                      <NextScript />
                    </body>
                  </Html>
                )
              }
            }`,
      errors: [
        {
          message: `\`styled-jsx\` should not be used in \`pages/_document.js\`. See: https://nextjs.org/docs/messages/no-styled-jsx-in-document`,
        },
      ],
      filename: "pages/_document.js",
    },
  ],

  valid: [
    {
      code: `import Document, { Html, Head, Main, NextScript } from 'next/document'

        export class MyDocument extends Document {
          static async getInitialProps(ctx) {
            const initialProps = await Document.getInitialProps(ctx)
            return { ...initialProps }
          }

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
        }`,
      filename: "pages/_document.js",
    },
    {
      code: `import Document, { Html, Head, Main, NextScript } from 'next/document'

        export class MyDocument extends Document {
          static async getInitialProps(ctx) {
            const initialProps = await Document.getInitialProps(ctx)
            return { ...initialProps }
          }

          render() {
            return (
              <Html>
                <Head />
                <style>{"\
                  body{\
                    color:red;\
                  }\
                "}</style>
                <style {...{nonce: '123' }}></style>
                <body>
                  <Main />
                  <NextScript />
                </body>
              </Html>
            )
          }
        }`,
      filename: "pages/_document.js",
    },
    {
      code: `
          export default function Page() {
            return (
              <>
                <p>Hello world</p>
                <style jsx>{\`
                  p {
                    color: orange;
                  }
                \`}</style>
              </>
            )
          }
          `,
      filename: "pages/index.js",
    },
  ],
};

describe("no-styled-jsx-in-document", () => {
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
