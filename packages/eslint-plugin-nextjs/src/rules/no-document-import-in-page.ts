import * as path from "node:path";

import { defineRule } from "../utils/define-rule.js";

const url = "https://nextjs.org/docs/messages/no-document-import-in-page";

export const noDocumentImportInPage = defineRule({
  create: (context) => ({
      ImportDeclaration: (node) => {
        if (node.source.value !== "next/document") {
          return;
        }

        const paths = context.filename.split("pages");
        const page = paths[paths.length - 1];

        if (
          !page ||
          page.startsWith(`${path.sep}_document`) ||
          page.startsWith(`${path.posix.sep}_document`)
        ) {
          return;
        }

        context.report({
          message: `\`<Document />\` from \`next/document\` should not be imported outside of \`pages/_document.js\`. See: ${url}`,
          node,
        });
      },
    }),
  meta: {
    docs: {
      description:
        "Prevent importing `next/document` outside of `pages/_document.js`.",
      recommended: true,
      url,
    },
    schema: [],
    type: "problem",
  },
});
