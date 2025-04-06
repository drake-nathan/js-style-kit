import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-before-interactive-script-outside-document");

const message =
  "`next/script`'s `beforeInteractive` strategy should not be used outside of `pages/_document.js`. See: https://nextjs.org/docs/messages/no-before-interactive-script-outside-document";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
      import Head from "next/head";
      import Script from "next/script";

      export default function Index() {
        return (
          <Script
            id="scriptBeforeInteractive"
            src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
            strategy="beforeInteractive"
          ></Script>
        );
      }`,
      errors: [{ message }],
      filename: "pages/index.js",
      name: "should report error when using beforeInteractive in pages/index.js",
    },
    {
      code: `
      import Head from "next/head";
      import Script from "next/script";

      export default function Index() {
        return (
          <Script
            id="scriptBeforeInteractive"
            src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
            strategy="beforeInteractive"
          ></Script>
        );
      }`,
      errors: [{ message }],
      filename: "components/outside-known-dirs.js",
      name: "should report error when using beforeInteractive in components directory",
    },
    {
      code: `
      import Script from "next/script";

      export default function Index() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      errors: [{ message }],
      filename: "/Users/user_name/projects/project-name/pages/layout.tsx",
      name: "should report error when using beforeInteractive in pages/layout.tsx",
    },
    {
      code: `
      import Script from "next/script";

      export default function Index() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      errors: [{ message }],
      filename:
        "C:\\Users\\username\\projects\\project-name\\pages\\layout.tsx",
      name: "should report error when using beforeInteractive in Windows path pages/layout.tsx",
    },
    {
      code: `
      import Script from "next/script";

      export default function Index() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      errors: [{ message }],
      filename: "/Users/user_name/projects/project-name/src/pages/layout.tsx",
      name: "should report error when using beforeInteractive in src/pages/layout.tsx",
    },
    {
      code: `
      import Script from "next/script";

      export default function test() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      errors: [{ message }],
      filename:
        "C:\\Users\\username\\projects\\project-name\\src\\pages\\layout.tsx",
      name: "should report error when using beforeInteractive in Windows path src/pages/layout.tsx",
    },
  ],
  valid: [
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import Script from 'next/script'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head>
                <meta charSet="utf-8" />
              </Head>
              <body>
                <Main />
                <NextScript />
                <Script
                  id="scriptBeforeInteractive"
                  src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
                  strategy="beforeInteractive"
                ></Script>
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      filename: "pages/_document.js",
      name: "should allow beforeInteractive in pages/_document.js",
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import ScriptComponent from 'next/script'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head>
                <meta charSet="utf-8" />
              </Head>
              <body>
                <Main />
                <NextScript />
                <ScriptComponent
                  id="scriptBeforeInteractive"
                  src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
                  strategy="beforeInteractive"
                ></ScriptComponent>
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      filename: "pages/_document.tsx",
      name: "should allow beforeInteractive with renamed component in pages/_document.tsx",
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'next/document'
      import ScriptComponent from 'next/script'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head>
                <meta charSet="utf-8" />
              </Head>
              <body>
                <Main />
                <NextScript />
                <ScriptComponent
                  id="scriptBeforeInteractive"
                  src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
                ></ScriptComponent>
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      filename: "pages/_document.tsx",
      name: "should allow script without strategy in pages/_document.tsx",
    },
    {
      code: `
      import Script from "next/script";

      export default function Index() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      filename: "/Users/user_name/projects/project-name/app/layout.tsx",
      name: "should allow beforeInteractive in app/layout.tsx",
    },
    {
      code: `
      import Script from "next/script";

      export default function test() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      filename: "C:\\Users\\username\\projects\\project-name\\app\\layout.tsx",
      name: "should allow beforeInteractive in Windows path app/layout.tsx",
    },
    {
      code: `
      import Script from "next/script";

      export default function Index() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      filename: "/Users/user_name/projects/project-name/src/app/layout.tsx",
      name: "should allow beforeInteractive in src/app/layout.tsx",
    },
    {
      code: `
      import Script from "next/script";

      export default function test() {
        return (
          <html lang="en">
            <body className={inter.className}>{children}</body>
            <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptBeforeInteractive"
              strategy='beforeInteractive'
            />
          </html>
        );
      }`,
      filename:
        "C:\\Users\\username\\projects\\project-name\\src\\app\\layout.tsx",
      name: "should allow beforeInteractive in Windows path src/app/layout.tsx",
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
}).run("no-before-interactive-script-outside-document", NextESLintRule, tests);
