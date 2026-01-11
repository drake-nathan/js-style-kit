import type { RuleDefinition } from "@eslint/core";

import path from "node:path";

const name = "no-img-element";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noImgElement";

/**
 * Rule to prevent usage of <img> element due to slower LCP and higher bandwidth
 */
export const noImgElement: RuleDefinition = {
  create: (context) => {
    // Get relative path of the file
    const relativePath = context.filename
      .replace(path.sep, "/")
      .replace(context.cwd, "")
      .replace(/^\//, "");

    const isAppDir = /^(?<temp1>src\/)?app\//.test(relativePath);

    return {
      JSXOpeningElement: (node) => {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "img") {
          return;
        }

        if (node.attributes.length === 0) {
          return;
        }

        // Check if this img is inside a picture element
        const parentJSXElement = node.parent;
        const grandParentJSXElement = parentJSXElement?.parent;

        if (
          grandParentJSXElement?.openingElement?.name?.type ===
            "JSXIdentifier" &&
          grandParentJSXElement?.openingElement?.name?.name === "picture"
        ) {
          return;
        }

        // If is metadata route files, ignore
        // e.g. opengraph-image.js, twitter-image.js, icon.js
        if (
          isAppDir &&
          /\/opengraph-image|twitter-image|icon\.\w+$/.test(relativePath)
        ) {
          return;
        }

        context.report({
          data: { url },
          messageId: "noImgElement",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Prevent usage of `<img>` element due to slower LCP and higher bandwidth.",
      recommended: true,
      url,
    },
    messages: {
      noImgElement:
        "Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
