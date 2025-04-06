import type { RuleDefinition } from "@eslint/core";

import { URLSearchParams } from "node:url";

import NodeAttributes from "../utils/node-attributes.js";

const name = "google-font-display";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "missingFontDisplay" | "notRecommendedFontDisplay";

/**
 * Rule to enforce font-display behavior with Google Fonts
 */
export const googleFontDisplay: RuleDefinition = {
  create: (context) => ({
    JSXOpeningElement: (node: any) => {
      let messageId: MessageId | undefined;
      let data: Record<string, string> | undefined;

      if (node.name.type !== "JSXIdentifier" || node.name.name !== "link") {
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
        const queryPart =
          hrefValue.includes("?") ?
            hrefValue.substring(hrefValue.indexOf("?") + 1)
          : "";
        const params = new URLSearchParams(queryPart);
        const displayValue = params.get("display");

        if (!params.has("display")) {
          messageId = "missingFontDisplay";
          data = { url };
        } else if (
          displayValue === "auto" ||
          displayValue === "block" ||
          displayValue === "fallback"
        ) {
          messageId = "notRecommendedFontDisplay";
          data = {
            display: displayValue[0]?.toUpperCase() + displayValue.slice(1),
            url,
          };
        }
      }

      if (messageId) {
        context.report({
          data,
          messageId,
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
    messages: {
      missingFontDisplay:
        "A font-display parameter is missing (adding `&display=optional` is recommended). See: {{url}}",
      notRecommendedFontDisplay: "{{display}} is not recommended. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
};
