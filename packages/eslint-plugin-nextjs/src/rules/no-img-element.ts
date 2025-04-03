import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import path from "node:path";

const name = "no-img-element";
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
type MessageId = "noImgElement";

/**
 * Rule to prevent usage of <img> element due to slower LCP and higher bandwidth
 */
export const noImgElement = createRule<Options, MessageId>({
  create: (context) => {
    // Get relative path of the file
    const relativePath = context.filename
      .replace(path.sep, "/")
      .replace(context.cwd, "")
      .replace(/^\//, "");

    const isAppDir = /^(?<temp1>src\/)?app\//.test(relativePath);

    return {
      JSXOpeningElement: (node: TSESTree.JSXOpeningElement) => {
        if (
          node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.name.name !== "img"
        ) {
          return;
        }

        if (node.attributes.length === 0) {
          return;
        }

        // Check if this img is inside a picture element
        const parentJSXElement = node.parent as TSESTree.JSXElement | undefined;
        const grandParentJSXElement = parentJSXElement?.parent as
          | TSESTree.JSXElement
          | undefined;

        if (
          // TODO: fix
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          grandParentJSXElement?.openingElement?.name?.type ===
            AST_NODE_TYPES.JSXIdentifier &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  defaultOptions: [],
  meta: {
    docs: {
      category: "HTML",
      description:
        "Prevent usage of `<img>` element due to slower LCP and higher bandwidth.",
      recommended: true,
      url,
    },
    messages: {
      noImgElement:
        "Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: {{url}}",
    },
    schema: [],
    type: "problem",
  },
  name,
});
