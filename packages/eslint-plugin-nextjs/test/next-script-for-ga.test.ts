import { RuleTester } from "eslint";

import { getRule } from "./utils/get-rule";

const NextESLintRule = getRule("next-script-for-ga");

const ERROR_MSG =
  "Prefer `next/script` component when using the inline script for Google Analytics. See: https://nextjs.org/docs/messages/next-script-for-ga";

interface Tests {
  invalid: RuleTester.InvalidTestCase[];
  valid: RuleTester.ValidTestCase[];
}

const tests: Tests = {
  invalid: [
    {
      code: `
        export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <script async src='https://www.googletagmanager.com/gtag/js?id=$\{GA_TRACKING_ID}' />
                <script
                  dangerouslySetInnerHTML={{
                    __html: \`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '\${GA_TRACKING_ID}', {
                        page_path: window.location.pathname,
                      });
                  \`,
                }}/>
              </div>
            );
          }
      }`,
      errors: [
        {
          message: ERROR_MSG,
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when using Google Analytics inline script",
    },
    {
      code: `
        export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1> qqq
                {/* Google Tag Manager - Global base code */}
                <script
                dangerouslySetInnerHTML={{
                  __html: \`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer', '\${GTM_ID}');
                  \`,
                }}/>
              </div>
            );
          }
      }`,
      errors: [
        {
          message: ERROR_MSG,
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when using Google Tag Manager inline script",
    },
    {
      code: `
        export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <script dangerouslySetInnerHTML={{
                    __html: \`
                      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

                        ga('create', 'UA-XXXXX-Y', 'auto');
                        ga('send', 'pageview');
                    \`,
                  }}/>
              </div>
            );
          }
      }`,
      errors: [
        {
          message: ERROR_MSG,
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when using traditional Google Analytics inline script",
    },
    {
      code: `
        export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <script dangerouslySetInnerHTML={{
                    __html: \`
                        window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                        ga('create', 'UA-XXXXX-Y', 'auto');
                        ga('send', 'pageview');
                    \`,
                  }}/>
                <script async src='https://www.google-analytics.com/analytics.js'></script>
              </div>
            );
          }
      }`,
      errors: [
        {
          message: ERROR_MSG,
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when using alternative Google Analytics inline script with external source",
    },
    {
      code: `
        export class Blah extends Head {
          createGoogleAnalyticsMarkup() {
            return {
              __html: \`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'UA-148481588-2');\`,
            };
          }

          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <script dangerouslySetInnerHTML={this.createGoogleAnalyticsMarkup()} />
                <script async src='https://www.google-analytics.com/analytics.js'></script>
              </div>
            );
          }
      }`,
      errors: [
        {
          message: ERROR_MSG,
          type: "JSXOpeningElement",
        },
      ],
      name: "should report error when using method-generated Google Analytics markup",
    },
  ],

  valid: [
    {
      code: `import Script from 'next/script'

      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <Script
                src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
                strategy="lazyOnload"
              />
              <Script id="google-analytics">
                {\`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'GA_MEASUREMENT_ID');
                \`}
              </Script>
            </div>
          );
        }
    }`,
      name: "should allow Google Analytics with next/script component",
    },
    {
      code: `import Script from 'next/script'

      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <Script id="google-analytics">
                {\`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

                    ga('create', 'UA-XXXXX-Y', 'auto');
                    ga('send', 'pageview');
                })\`}
              </Script>
            </div>
          );
        }
    }`,
      name: "should allow traditional Google Analytics with next/script component",
    },
    {
      code: `import Script from 'next/script'

        export class Blah extends Head {
        render() {
            return (
            <div>
                <h1>Hello title</h1>
                <Script id="google-analytics">
                    {\`window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
                    ga('create', 'UA-XXXXX-Y', 'auto');
                    ga('send', 'pageview');
                    })\`}
                </Script>
            </div>
            );
        }
    }`,
      name: "should allow alternative Google Analytics with next/script component",
    },
    {
      code: `export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <script dangerouslySetInnerHTML={{}} />
              </div>
            );
          }
      }`,
      name: "should allow script with empty dangerouslySetInnerHTML",
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
}).run("next-script-for-ga", NextESLintRule, tests);
