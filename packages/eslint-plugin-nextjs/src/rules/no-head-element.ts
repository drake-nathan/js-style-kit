import type { RuleDefinition } from "@eslint/core";

import path from "node:path";

const name = "no-head-element";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noHeadElement";

/**
 * Rule to prevent usage of <head> element
 */
export const noHeadElement: RuleDefinition = {
  create: (context) => ({
    JSXOpeningElement: (node) => {
      const paths = context.filename;

      const isInAppDir = () =>
        // Check if we're in the app directory using either platform separator
        paths.includes(`app${path.sep}`) ||
        paths.includes(`app${path.posix.sep}`);
      // Only lint the <head> element in pages directory
      if (
        node.name.type !== "JSXIdentifier" ||
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
  meta: {
    docs: {
      description: "Prevent usage of `<head>` element.",
      recommended: true,
      url,
    },
    messages: {
      noHeadElement:
        "Do not use `<head>` element. Use `<Head />` from `next/head` instead. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
