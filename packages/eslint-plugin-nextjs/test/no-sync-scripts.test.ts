import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-sync-scripts");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const message =
  "Synchronous scripts should not be used. See: https://nextjs.org/docs/messages/no-sync-scripts";

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
                <script src='https://blah.com'></script>
              </div>
            );
          }
      }`,
      errors: [{ message, type: "JSXOpeningElement" }],
      name: "should report error when using script with src attribute without async",
    },
    {
      code: `
      import {Head} from 'next/document';

        export class Blah extends Head {
          render(props) {
            return (
              <div>
                <h1>Hello title</h1>
                <script src={props.src}></script>
              </div>
            );
          }
      }`,
      errors: [{ message, type: "JSXOpeningElement" }],
      name: "should report error when using script with dynamic src attribute without async",
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
              <script src='https://blah.com' async></script>
            </div>
          );
        }
    }`,
      name: "should allow script with async attribute",
    },
    {
      code: `import {Head} from 'next/document';

      export class Blah extends Head {
        render(props) {
          return (
            <div>
              <h1>Hello title</h1>
              <script {...props} ></script>
            </div>
          );
        }
    }`,
      name: "should allow script with spread attributes",
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
}).run("no-sync-scripts", NextESLintRule, tests);
