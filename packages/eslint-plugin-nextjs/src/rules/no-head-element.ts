import path from "node:path";

import { defineRule } from "../utils/define-rule.js";

const url = "https://nextjs.org/docs/messages/no-head-element";

export const noHeadElement = defineRule({
  create: (context: any) => ({
      JSXOpeningElement: (node: any) => {
        const paths = context.filename;

        const isInAppDir = () =>
          paths.includes(`app${path.sep}`) ||
          paths.includes(`app${path.posix.sep}`);
        // Only lint the <head> element in pages directory
        if (node.name.name !== "head" || isInAppDir()) {
          return;
        }

        context.report({
          message: `Do not use \`<head>\` element. Use \`<Head />\` from \`next/head\` instead. See: ${url}`,
          node,
        });
      },
    }),
  meta: {
    docs: {
      category: "HTML",
      description: "Prevent usage of `<head>` element.",
      recommended: true,
      url,
    },
    schema: [],
    type: "problem",
  },
});
