import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("google-font-display");

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `import Head from "next/head";

      export default Test = () => {
       return (
         <Head>
           <link
             href="https://fonts.googleapis.com/css2?family=Krona+One"
             rel="stylesheet"
           />
         </Head>
       );
      };
     `,
      errors: [
        {
          message:
            "A font-display parameter is missing (adding `&display=optional` is recommended). See: https://nextjs.org/docs/messages/google-font-display",
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when font-display parameter is missing",
    },
    {
      code: `import Head from "next/head";

      export default Test = () => {
       return (
         <Head>
           <link
             href="https://fonts.googleapis.com/css2?family=Krona+One&display=block"
             rel="stylesheet"
           />
         </Head>
       );
      };
     `,
      errors: [
        {
          message:
            "Block is not recommended. See: https://nextjs.org/docs/messages/google-font-display",
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when display=block is used",
    },
    {
      code: `import Head from "next/head";

      export default Test = () => {
       return (
         <Head>
           <link
             href="https://fonts.googleapis.com/css2?family=Krona+One&display=auto"
             rel="stylesheet"
           />
         </Head>
       );
      };
     `,
      errors: [
        {
          message:
            "Auto is not recommended. See: https://nextjs.org/docs/messages/google-font-display",
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when display=auto is used",
    },
    {
      code: `import Head from "next/head";

      export default Test = () => {
       return (
         <Head>
           <link
             href="https://fonts.googleapis.com/css2?display=fallback&family=Krona+One"
             rel="stylesheet"
           />
         </Head>
       );
      };
     `,
      errors: [
        {
          message:
            "Fallback is not recommended. See: https://nextjs.org/docs/messages/google-font-display",
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when display=fallback is used",
    },
  ],

  valid: [
    {
      code: `import Head from "next/head";

     export default Test = () => {
      return (
        <Head>
          <link href={test} rel="test" />
          <link
            href={process.env.NEXT_PUBLIC_CANONICAL_URL}
            rel="canonical"
          />
          <link
            href={new URL("../public/favicon.ico", import.meta.url).toString()}
            rel="icon"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Krona+One&display=optional"
            rel="stylesheet"
          />
        </Head>
      );
     };
    `,
      name: "should allow non-Google Font links and Google Font with display=optional",
    },

    {
      code: `import Document, { Html, Head } from "next/document";

     class MyDocument extends Document {
      render() {
        return (
          <Html>
            <Head>
              <link
                href="https://fonts.googleapis.com/css?family=Krona+One&display=swap"
                rel="stylesheet"
              />
            </Head>
          </Html>
        );
      }
     }

     export default MyDocument;
    `,
      name: "should allow Google Font with display=swap in next/document",
    },

    {
      code: `import Document, { Html, Head } from "next/document";

     class MyDocument extends Document {
      render() {
        return (
          <Html>
            <Head>
              <link
                href="https://fonts.googleapis.com/css?family=Krona+One&display=swap"
                rel="stylesheet"
                crossOrigin=""
              />
            </Head>
          </Html>
        );
      }
     }

     export default MyDocument;
    `,
      name: "should allow Google Font with display=swap and crossOrigin attribute",
    },
  ],
};

new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        modules: true,
      },
    },
    sourceType: "module",
  },
}).run("google-font-display", NextESLintRule, tests);
