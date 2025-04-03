import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";

import NodeAttributes from "../utils/node-attributes.js";

const name = "google-font-preconnect";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "missingPreconnect";

/**
 * Rule to enforce preconnect usage with Google Fonts
 */
export const googleFontPreconnect = createRule<Options, MessageId>({
  create: (context) => ({
    JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
      if (
        node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
        node.name.name !== "link"
      ) {
        return;
      }

      const attributes = new NodeAttributes(node);
      if (!attributes.has("href") || !attributes.hasValue("href")) {
        return;
      }

      const hrefValue = attributes.value("href");
      const preconnectMissing =
        !attributes.has("rel") ||
        !attributes.hasValue("rel") ||
        attributes.value("rel") !== "preconnect";

      if (
        typeof hrefValue === "string" &&
        hrefValue.startsWith("https://fonts.gstatic.com") &&
        preconnectMissing
      ) {
        context.report({
          data: { url },
          messageId: "missingPreconnect",
          node,
        });
      }
    },
  }),
  defaultOptions: [],
  meta: {
    docs: {
      description: "Ensure `preconnect` is used with Google Fonts.",
      recommended: true,
      url,
    },
    messages: {
      missingPreconnect:
        '`rel="preconnect"` is missing from Google Font. See: {{url}}',
    },
    schema: [],
    type: "problem",
  },
  name,
});
