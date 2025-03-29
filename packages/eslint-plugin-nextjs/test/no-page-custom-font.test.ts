import { describe } from "bun:test";
import { RuleTester as ESLintTesterV9 } from "eslint";
import { RuleTester as ESLintTesterV8 } from "eslint-v8";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-page-custom-font");

const filename = "pages/_document.js";

const tests = {
  invalid: [
    {
      code: `
      import Head from 'next/head'
      export default function IndexPage() {
        return (
          <div>
            <Head>
              <link
                href="https://fonts.googleapis.com/css2?family=Inter"
                rel="stylesheet"
              />
            </Head>
            <p>Hello world!</p>
          </div>
        )
      }
      `,
      errors: [
        {
          message:
            "Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font",
          type: "JSXOpeningElement",
        },
      ],
      filename: "pages/index.tsx",
    },
    {
      code: `
      import Head from 'next/head'


      function Links() {
        return (
          <>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Open+Sans"
              rel="stylesheet"
              />
          </>
        )
      }

      export default function IndexPage() {
        return (
          <div>
            <Head>
              <Links />
            </Head>
            <p>Hello world!</p>
          </div>
        )
      }
      `,
      errors: [
        {
          message:
            "Using `<link />` outside of `<Head>` will disable automatic font optimization. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font",
        },
        {
          message:
            "Using `<link />` outside of `<Head>` will disable automatic font optimization. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font",
        },
      ],
      filename,
    },
  ],

  valid: [
    {
      code: `import Document, { Html, Head } from "next/document";
    class MyDocument extends Document {
      render() {
        return (
          <Html>
            <Head>
              <link
                href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
                rel="stylesheet"
              />
            </Head>
          </Html>
        );
      }
    }
    export default MyDocument;`,
      filename,
    },
    {
      code: `import NextDocument, { Html, Head } from "next/document";
    class Document extends NextDocument {
      render() {
        return (
          <Html>
            <Head>
              <link
                href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
                rel="stylesheet"
              />
            </Head>
          </Html>
        );
      }
    }
    export default Document;
    `,
      filename,
    },
    {
      code: `export default function CustomDocument() {
      return (
        <Html>
          <Head>
            <link
              href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
              rel="stylesheet"
            />
          </Head>
        </Html>
      )
    }`,
      filename,
    },
    {
      code: `function CustomDocument() {
      return (
        <Html>
          <Head>
            <link
              href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
              rel="stylesheet"
            />
          </Head>
        </Html>
      )
    }

    export default CustomDocument;
    `,
      filename,
    },
    {
      code: `
      import Document, { Html, Head } from "next/document";
      class MyDocument {
        render() {
          return (
            <Html>
              <Head>
                <link
                  href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
                  rel="stylesheet"
                />
              </Head>
            </Html>
          );
        }
      }

      export default MyDocument;`,
      filename,
    },
    {
      code: `export default function() {
      return (
        <Html>
          <Head>
            <link
              href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap"
              rel="stylesheet"
            />
          </Head>
        </Html>
      )
    }`,
      filename,
    },
  ],
};

describe("no-page-custom-font", () => {
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
