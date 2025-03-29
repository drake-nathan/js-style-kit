import type { Rule } from "eslint";

import { defineRule } from "../utils/define-rule.js";
import NodeAttributes from "../utils/node-attributes.js";

const url = "https://nextjs.org/docs/messages/google-font-display";

/**
 * Rule to enforce font-display behavior with Google Fonts
 */
export const googleFontDisplay = defineRule({
  create: (context: Rule.RuleContext) => ({
      JSXOpeningElement: (node: any) => {
        let message: string | undefined;

        if (node.name.name !== "link") {
          return;
        }

        const attributes = new NodeAttributes(node);
        if (!attributes.has("href") || !attributes.hasValue("href")) {
          return;
        }

        const hrefValue = attributes.value("href");
        const isGoogleFont =
          typeof hrefValue === "string" &&
          hrefValue.startsWith("https://fonts.googleapis.com/css");

        if (isGoogleFont) {
          const params = new URLSearchParams(hrefValue.split("?", 2)[1]);
          const displayValue = params.get("display");

          if (!params.has("display")) {
            message =
              "A font-display parameter is missing (adding `&display=optional` is recommended).";
          } else if (
            displayValue === "auto" ||
            displayValue === "block" ||
            displayValue === "fallback"
          ) {
            message = `${
              displayValue[0]?.toUpperCase() + displayValue.slice(1)
            } is not recommended.`;
          }
        }

        if (message) {
          context.report({
            message: `${message} See: ${url}`,
            node,
          });
        }
      },
    }),
  meta: {
    docs: {
      description: "Enforce font-display behavior with Google Fonts.",
      recommended: true,
      url,
    },
    schema: [],
    type: "problem",
  },
});
