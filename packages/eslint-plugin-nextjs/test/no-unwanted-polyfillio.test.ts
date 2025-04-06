import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-unwanted-polyfillio");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `import {Head} from 'next/document';

      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <script src='https://polyfill.io/v3/polyfill.min.js?features=WeakSet%2CPromise%2CPromise.prototype.finally%2Ces2015%2Ces5%2Ces6'></script>
            </div>
          );
        }
    }`,
      errors: [
        {
          message:
            "No duplicate polyfills from Polyfill.io are allowed. WeakSet, Promise, Promise.prototype.finally, es2015, es5, es6 are already shipped with Next.js. See: https://nextjs.org/docs/messages/no-unwanted-polyfillio",
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error for multiple polyfills already shipped with Next.js",
    },
    {
      code: `
      export class Blah {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <script src='https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.copyWithin'></script>
            </div>
          );
        }
    }`,
      errors: [
        {
          message:
            "No duplicate polyfills from Polyfill.io are allowed. Array.prototype.copyWithin is already shipped with Next.js. See: https://nextjs.org/docs/messages/no-unwanted-polyfillio",
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error for Array.prototype.copyWithin polyfill",
    },
    {
      code: `import NextScript from 'next/script';

      export function MyApp({ Component, pageProps }) {
          return (
            <div>
              <Component {...pageProps} />
              <NextScript src='https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.copyWithin' />
            </div>
          );
    }`,
      errors: [
        {
          message:
            "No duplicate polyfills from Polyfill.io are allowed. Array.prototype.copyWithin is already shipped with Next.js. See: https://nextjs.org/docs/messages/no-unwanted-polyfillio",
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error for Array.prototype.copyWithin polyfill in NextScript component",
    },
    {
      code: `import {Head} from 'next/document';

        export class ES2019Features extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <script src='https://polyfill.io/v3/polyfill.min.js?features=Object.fromEntries'></script>
              </div>
            );
          }
      }`,
      errors: [
        {
          message:
            "No duplicate polyfills from Polyfill.io are allowed. Object.fromEntries is already shipped with Next.js. See: https://nextjs.org/docs/messages/no-unwanted-polyfillio",
        },
      ],
      name: "should report error for Object.fromEntries polyfill",
    },
  ],

  valid: [
    {
      code: `import {Head} from 'next/document';

      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <script src='https://polyfill.io/v3/polyfill.min.js?features=AbortController'></script>
            </div>
          );
        }
    }`,
      name: "should allow AbortController polyfill",
    },
    {
      code: `import {Head} from 'next/document';

      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <script src='https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver'></script>
            </div>
          );
        }
    }`,
      name: "should allow IntersectionObserver polyfill",
    },
    {
      code: `import Script from 'next/script';

      export function MyApp({ Component, pageProps }) {
          return (
            <div>
              <Component {...pageProps} />
              <Script src='https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver' />
            </div>
          );
    }`,
      name: "should allow IntersectionObserver polyfill in Script component",
    },
    {
      code: `import Script from 'next/script';

      export function MyApp({ Component, pageProps }) {
          return (
            <div>
              <Component {...pageProps} />
              <Script src='https://polyfill-fastly.io/v3/polyfill.min.js?features=IntersectionObserver' />
            </div>
          );
    }`,
      name: "should allow polyfills from alternate domains",
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
}).run("no-unwanted-polyfillio", NextESLintRule, tests);
