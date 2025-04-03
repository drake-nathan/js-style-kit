import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

import NodeAttributes from "../utils/node-attributes.js";

const SUPPORTED_SRCS = [
  "www.google-analytics.com/analytics.js",
  "www.googletagmanager.com/gtag/js",
];
const SUPPORTED_HTML_CONTENT_URLS = [
  "www.google-analytics.com/analytics.js",
  "www.googletagmanager.com/gtm.js",
];

const name = "next-script-for-ga";
const url = `https://nextjs.org/docs/messages/${name}`;
const description =
  "Prefer `next/script` component when using the inline script for Google Analytics.";

// Check if one of the items in the list is a substring of the passed string
const containsStr = (str: string, strList: string[]) => {
  return strList.some((s) => str.includes(s));
};

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "useNextScript";

/**
 * Rule to enforce using next/script for Google Analytics
 */
export const nextScriptForGa = createRule<Options, MessageId>({
  create: (context) => ({
    JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
      if (
        node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
        node.name.name !== "script"
      ) {
        return;
      }
      if (node.attributes.length === 0) {
        return;
      }
      const attributes = new NodeAttributes(node);

      // Check if the Alternative async tag is being used to add GA.
      // https://developers.google.com/analytics/devguides/collection/analyticsjs#alternative_async_tag
      // https://developers.google.com/analytics/devguides/collection/gtagjs
      if (
        typeof attributes.value("src") === "string" &&
        containsStr(attributes.value("src"), SUPPORTED_SRCS)
      ) {
        context.report({
          data: { url },
          messageId: "useNextScript",
          node,
        });
        return;
      }

      // Check if inline script is being used to add GA.
      // https://developers.google.com/analytics/devguides/collection/analyticsjs#the_google_analytics_tag
      // https://developers.google.com/tag-manager/quickstart
      if (
        attributes.value("dangerouslySetInnerHTML") &&
        attributes.value("dangerouslySetInnerHTML").length > 0
      ) {
        const htmlContent = attributes.value("dangerouslySetInnerHTML")[0].value
          .quasis?.[0].value.raw;
        if (
          htmlContent &&
          containsStr(htmlContent, SUPPORTED_HTML_CONTENT_URLS)
        ) {
          context.report({
            data: { url },
            messageId: "useNextScript",
            node,
          });
        }
      }
    },
  }),
  defaultOptions: [],
  meta: {
    docs: {
      description,
      recommended: true,
      url,
    },
    messages: {
      useNextScript:
        "Prefer `next/script` component when using the inline script for Google Analytics. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});
