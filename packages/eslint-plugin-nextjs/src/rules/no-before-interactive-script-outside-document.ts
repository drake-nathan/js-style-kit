import type { RuleDefinition } from "@eslint/core";

import * as path from "node:path";

const name = "no-before-interactive-script-outside-document";
const url = `https://nextjs.org/docs/messages/${name}`;

const convertToCorrectSeparator = (str: string) =>
  str.replaceAll(/[/\\]/g, path.sep);

type MessageId = "noBeforeInteractiveOutsideDocument";

/**
 * Rule to prevent usage of next/script's beforeInteractive strategy outside of pages/_document.js
 */
export const noBeforeInteractiveScriptOutsideDocument: RuleDefinition = {
  create: (context) => {
    let scriptImportName: null | string = null;

    return {
      'ImportDeclaration[source.value="next/script"] > ImportDefaultSpecifier'(
        node,
      ) {
        scriptImportName = node.local.name;
      },
      JSXOpeningElement: (node) => {
        const pathname = convertToCorrectSeparator(context.filename);

        const isInAppDir = pathname.includes(`${path.sep}app${path.sep}`);

        // This rule shouldn't fire in `app/`
        if (isInAppDir) {
          return;
        }

        if (!scriptImportName) {
          return;
        }

        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name !== scriptImportName
        ) {
          return;
        }

        const strategy = node.attributes.find(
          (child: any) =>
            child.type === "JSXAttribute" &&
            child.name.type === "JSXIdentifier" &&
            child.name.name === "strategy",
        );

        if (
          !strategy?.value ||
          strategy.value.type !== "Literal" ||
          strategy.value.value !== "beforeInteractive"
        ) {
          return;
        }

        const document = context.filename.split("pages", 2)[1];
        if (document && path.parse(document).name.startsWith("_document")) {
          return;
        }

        context.report({
          data: { url },
          messageId: "noBeforeInteractiveOutsideDocument",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Prevent usage of `next/script`'s `beforeInteractive` strategy outside of `pages/_document.js`.",
      recommended: true,
      url,
    },
    messages: {
      noBeforeInteractiveOutsideDocument:
        "`next/script`'s `beforeInteractive` strategy should not be used outside of `pages/_document.js`. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
