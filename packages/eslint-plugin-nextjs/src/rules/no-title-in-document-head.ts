import type { RuleDefinition } from "@eslint/core";

const name = "no-title-in-document-head";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noTitleInDocumentHead";

/**
 * Rule to prevent usage of <title> with Head component from next/document
 */
export const noTitleInDocumentHead: RuleDefinition = {
  create: (context) => {
    let headFromNextDocument = false;
    return {
      ImportDeclaration: (node: any) => {
        if (node.source.value === "next/document") {
          if (
            node.specifiers.some(
              (specifier: any) =>
                specifier.type === "ImportSpecifier" &&
                specifier.local.name === "Head",
            )
          ) {
            headFromNextDocument = true;
          }
        }
      },
      JSXElement: (node: any) => {
        if (!headFromNextDocument) {
          return;
        }

        if (
          node.openingElement.name.type !== "JSXIdentifier" ||
          node.openingElement.name.name !== "Head"
        ) {
          return;
        }

        const titleTag = node.children.find(
          (child: any) =>
            child.type === "JSXElement" &&
            child.openingElement.name.type === "JSXIdentifier" &&
            child.openingElement.name.name === "title",
        );

        if (titleTag) {
          context.report({
            data: { url },
            messageId: "noTitleInDocumentHead",
            node: titleTag,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Prevent usage of `<title>` with `Head` component from `next/document`.",
      recommended: true,
      url,
    },
    messages: {
      noTitleInDocumentHead:
        "Do not use `<title>` element with `<Head />` component from `next/document`. Titles should defined at the page-level using `<Head />` from `next/head` instead. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
