import { describe } from "bun:test";
import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("no-sync-scripts");

const message =
  "Synchronous scripts should not be used. See: https://nextjs.org/docs/messages/no-sync-scripts";

const tests = {
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
    },
  ],

  valid: [
    `import {Head} from 'next/document';

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
    `import {Head} from 'next/document';

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
  ],
};

describe("no-sync-scripts", () => {
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
