import type { RuleDefinition } from "@eslint/core";

import * as path from "node:path";

const name = "no-styled-jsx-in-document";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noStyledJsxInDocument";

/**
 * Rule to prevent usage of styled-jsx in pages/_document.js
 */
export const noStyledJsxInDocument: RuleDefinition = {
  create: (context) => ({
    JSXOpeningElement: (node: any) => {
      const document = context.filename.split("pages", 2)[1];
      if (!document) {
        return;
      }
      const { dir, name } = path.parse(document);

      if (
        !(
          name.startsWith("_document") ||
          (dir === "/_document" && name === "index")
        )
      ) {
        return;
      }

      if (
        node.name.type === "JSXIdentifier" &&
        node.name.name === "style" &&
        node.attributes.find(
          (attr: any): attr is any =>
            attr.type === "JSXAttribute" &&
            attr.name.type === "JSXIdentifier" &&
            attr.name.name === "jsx",
        )
      ) {
        context.report({
          data: { url },
          messageId: "noStyledJsxInDocument",
          node,
        });
      }
    },
  }),
  meta: {
    docs: {
      description: "Prevent usage of `styled-jsx` in `pages/_document.js`.",
      recommended: true,
      url,
    },
    messages: {
      noStyledJsxInDocument:
        "`styled-jsx` should not be used in `pages/_document.js`. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
