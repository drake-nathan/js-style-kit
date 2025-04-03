import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import path from "node:path";

const name = "no-head-element";
const url = `https://nextjs.org/docs/messages/${name}`;

interface Docs {
  /**
   * Category of the rule
   */
  category: string;
  /**
   * Whether the rule is included in the recommended config.
   */
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<Docs>(() => url);

type Options = [];
type MessageId = "noHeadElement";

/**
 * Rule to prevent usage of <head> element
 */
export const noHeadElement = createRule<Options, MessageId>({
  create: (context) => ({
    JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
      const paths = context.filename;

      const isInAppDir = () =>
        // Check if we're in the app directory using either platform separator
        paths.includes(`app${path.sep}`) ||
        paths.includes(`app${path.posix.sep}`);
      // Only lint the <head> element in pages directory
      if (
        node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
        node.name.name !== "head" ||
        isInAppDir()
      ) {
        return;
      }

      context.report({
        data: { url },
        messageId: "noHeadElement",
        node,
      });
    },
  }),
  defaultOptions: [],
  meta: {
    docs: {
      category: "HTML",
      description: "Prevent usage of `<head>` element.",
      recommended: true,
      url,
    },
    messages: {
      noHeadElement:
        "Do not use `<head>` element. Use `<Head />` from `next/head` instead. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});
