import type { RuleDefinition } from "@eslint/core";

const name = "no-assign-module-variable";
const url = `https://nextjs.org/docs/messages/${name}`;

type MessageId = "noAssignModule";

/**
 * Rule to prevent assignment to the module variable
 */
export const noAssignModuleVariable: RuleDefinition = {
  create: (context) => ({
    VariableDeclaration: (node) => {
      // Checks node.declarations array for variable with id.name of `module`
      const moduleVariableFound = node.declarations.some((declaration: any) => {
        if (
          declaration.id.type === "Identifier" &&
          declaration.id.name === "module"
        ) {
          return true;
        }
        return false;
      });

      // Return early if no `module` variable is found
      if (!moduleVariableFound) {
        return;
      }

      context.report({
        data: { url },
        messageId: "noAssignModule",
        node,
      });
    },
  }),

  meta: {
    docs: {
      description: "Prevent assignment to the `module` variable.",
      recommended: true,
      url,
    },
    messages: {
      noAssignModule: "Do not assign to the variable `module`. See: {{url}}",
    } satisfies Record<MessageId, string>,
    schema: [],
    type: "problem",
  },
};
