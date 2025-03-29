import * as path from "node:path";

import { defineRule } from "../utils/define-rule.js";

const url = "https://nextjs.org/docs/messages/no-head-import-in-document";

export const noHeadImportInDocument = defineRule({
  create: (context: any) => ({
    ImportDeclaration: (node: any) => {
      if (node.source.value !== "next/head") {
        return;
      }

      const document = context.filename.split("pages", 2)[1];
      if (!document) {
        return;
      }

      const { dir, name } = path.parse(document);

      if (
        name.startsWith("_document") ||
        (dir === "/_document" && name === "index")
      ) {
        context.report({
          message: `\`next/head\` should not be imported in \`pages${document}\`. Use \`<Head />\` from \`next/document\` instead. See: ${url}`,
          node,
        });
      }
    },
  }),
  meta: {
    docs: {
      description: "Prevent usage of `next/head` in `pages/_document.js`.",
      recommended: true,
      url,
    },
    schema: [],
    type: "problem",
  },
});
