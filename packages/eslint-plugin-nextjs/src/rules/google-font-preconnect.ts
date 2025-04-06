import type { RuleDefinition } from "@eslint/core";

import NodeAttributes from "../utils/node-attributes.js";

const name = "google-font-preconnect";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "missingPreconnect";

/**
 * Rule to enforce preconnect usage with Google Fonts
 */
export const googleFontPreconnect: RuleDefinition = {
  create: (context) => ({
    JSXOpeningElement: (node) => {
      if (node.name.type !== "JSXIdentifier" || node.name.name !== "link") {
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
  meta: {
    docs: {
      description: "Ensure `preconnect` is used with Google Fonts.",
      recommended: true,
      url,
    },
    messages: {
      missingPreconnect:
        '`rel="preconnect"` is missing from Google Font. See: {{url}}',
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
