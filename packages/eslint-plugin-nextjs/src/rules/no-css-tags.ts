import type { RuleDefinition } from "@eslint/core";

const name = "no-css-tags";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noCssTags";

/**
 * Rule to prevent manual stylesheet tags
 */
export const noCssTags: RuleDefinition = {
  create: (context) => ({
    JSXOpeningElement: (node) => {
      if (node.name.type !== "JSXIdentifier" || node.name.name !== "link") {
        return;
      }
      if (node.attributes.length === 0) {
        return;
      }

      const attributes = node.attributes.filter(
        (attr: any) => attr.type === "JSXAttribute",
      );
      if (
        attributes.find(
          (attr: any) =>
            attr.name.type === "JSXIdentifier" &&
            attr.name.name === "rel" &&
            attr.value &&
            attr.value.type === "Literal" &&
            attr.value.value === "stylesheet",
        ) &&
        attributes.find(
          (attr: any) =>
            attr.name.type === "JSXIdentifier" &&
            attr.name.name === "href" &&
            attr.value &&
            attr.value.type === "Literal" &&
            typeof attr.value.value === "string" &&
            !/^https?/.test(attr.value.value),
        )
      ) {
        context.report({
          data: { url },
          messageId: "noCssTags",
          node,
        });
      }
    },
  }),
  meta: {
    docs: {
      description: "Prevent manual stylesheet tags.",
      recommended: true,
      url,
    },
    messages: {
      noCssTags: "Do not include stylesheets manually. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
