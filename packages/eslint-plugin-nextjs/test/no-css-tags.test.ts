import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-css-tags");

const message =
  "Do not include stylesheets manually. See: https://nextjs.org/docs/messages/no-css-tags";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
      import {Head} from 'next/document';

        export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <link href="/_next/static/css/styles.css" rel="stylesheet" />
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
      name: "should report error when including Next.js CSS file in Head component",
    },
    {
      code: `
      <div>
        <link href="/_next/static/css/styles.css" rel="stylesheet" />
      </div>`,
      errors: [
        {
          message,
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when including Next.js CSS file in any component",
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
            </div>
          );
        }
    }`,
      name: "should allow Head component without CSS links",
    },

    {
      code: `import {Head} from 'next/document';
      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet" />
            </div>
          );
        }
    }`,
      name: "should allow external font CSS links",
    },

    {
      code: `import {Head} from 'next/document';
      export class Blah extends Head {
        render(props) {
          return (
            <div>
              <h1>Hello title</h1>
              <link {...props} />
            </div>
          );
        }
    }`,
      name: "should allow link with spread props",
    },

    {
      code: `import {Head} from 'next/document';
      export class Blah extends Head {
        render(props) {
          return (
            <div>
              <h1>Hello title</h1>
              <link rel="stylesheet" {...props} />
            </div>
          );
        }
    }`,
      name: "should allow stylesheet link with spread props",
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
}).run("no-css-tags", NextESLintRule, tests);
