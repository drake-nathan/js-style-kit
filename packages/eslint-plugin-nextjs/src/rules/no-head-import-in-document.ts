import type { RuleDefinition } from "@eslint/core";

import * as path from "node:path";

const name = "no-head-import-in-document";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noHeadImportInDocument";

/**
 * Rule to prevent usage of next/head in pages/_document.js
 */
export const noHeadImportInDocument: RuleDefinition = {
  create: (context) => ({
    ImportDeclaration: (node) => {
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
          data: { document, url },
          messageId: "noHeadImportInDocument",
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
    messages: {
      noHeadImportInDocument:
        "`next/head` should not be imported in `pages{{document}}`. Use `<Head />` from `next/document` instead. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
