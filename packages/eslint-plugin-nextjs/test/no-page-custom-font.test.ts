import { describe } from "bun:test";
import { RuleTester } from "eslint";

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
    {
      code: `
      import Head from 'next/head'
      
      const CustomPage = () => {
        return (
          <div>
            <Head>
              <link
                href="https://fonts.googleapis.com/css2?family=Inter"
                rel="stylesheet"
              />
            </Head>
          </div>
        )
      }
      
      export default CustomPage
      `,
      errors: [
        {
          message:
            "Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font",
        },
      ],
      filename: "pages/custom.js",
    },
    {
      code: `
      import Head from 'next/head'
      
      export default class CustomPage {
        render() {
          return (
            <div>
              <Head>
                <link
                  href="https://fonts.googleapis.com/css2?family=Inter"
                  rel="stylesheet"
                />
              </Head>
            </div>
          )
        }
      }
      `,
      errors: [
        {
          message:
            "Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font",
        },
      ],
      filename: "pages/class-page.js",
    },
    // Test case for when we cannot find a default export identifier
    // This covers lines 47-48 in no-page-custom-font.ts
    {
      code: `
      import Head from 'next/head'
      
      function MyComponent() {
        return (
          <div>
            <Head>
              <link
                href="https://fonts.googleapis.com/css2?family=Inter"
                rel="stylesheet"
              />
            </Head>
          </div>
        )
      }
      
      // Export default but not immediately identifiable
      export default (props) => <MyComponent {...props} />
      `,
      errors: [
        {
          message:
            "Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font",
        },
      ],
      filename: "pages/complex-export.js",
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
    // Test case for a non-Google Font link href
    {
      code: `
      import Document, { Html, Head } from "next/document";
      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head>
                <link
                  href="/styles.css"
                  rel="stylesheet"
                />
              </Head>
            </Html>
          );
        }
      }
      export default MyDocument;
      `,
      filename,
    },
    // Test case for a link without href attribute
    {
      code: `
      import Document, { Html, Head } from "next/document";
      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head>
                <link rel="stylesheet" />
              </Head>
            </Html>
          );
        }
      }
      export default MyDocument;
      `,
      filename,
    },
  ],
};

describe("no-page-custom-font", () => {
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
