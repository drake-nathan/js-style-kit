import type { RuleDefinition } from "@eslint/core";

import * as path from "node:path";

const name = "no-document-import-in-page";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noDocumentImportInPage";

/**
 * Rule to prevent importing next/document outside of pages/_document.js
 */
export const noDocumentImportInPage: RuleDefinition = {
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
        data: { url },
        messageId: "noDocumentImportInPage",
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
    messages: {
      noDocumentImportInPage:
        "`<Document />` from `next/document` should not be imported outside of `pages/_document.js`. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
