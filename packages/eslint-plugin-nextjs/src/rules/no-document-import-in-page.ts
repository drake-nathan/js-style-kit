import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";
import * as path from "node:path";

const name = "no-document-import-in-page";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noDocumentImportInPage";

/**
 * Rule to prevent importing next/document outside of pages/_document.js
 */
export const noDocumentImportInPage = createRule<Options, MessageId>({
  create: (context) => ({
    ImportDeclaration: (node: TSESTree.ImportDeclaration) => {
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
  defaultOptions: [],
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
    },
    schema: [],
    type: "problem",
  },
  name,
});
