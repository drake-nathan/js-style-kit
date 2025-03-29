import * as path from "node:path";

import { defineRule } from "../utils/define-rule.js";

const url = "https://nextjs.org/docs/messages/no-styled-jsx-in-document";

export const noStyledJsxInDocument = defineRule({
  create: (context: any) => ({
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
        node.name.name === "style" &&
        node.attributes.find(
          (attr: any) =>
            attr.type === "JSXAttribute" && attr.name.name === "jsx",
        )
      ) {
        context.report({
          message: `\`styled-jsx\` should not be used in \`pages/_document.js\`. See: ${url}`,
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
    schema: [],
    type: "problem",
  },
});
