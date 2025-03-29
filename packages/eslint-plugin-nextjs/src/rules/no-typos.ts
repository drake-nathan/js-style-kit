import * as path from "node:path";

import { defineRule } from "../utils/define-rule.js";

const NEXT_EXPORT_FUNCTIONS = [
  "getStaticProps",
  "getStaticPaths",
  "getServerSideProps",
];

// 0 is the exact match
const THRESHOLD = 1;

// the minimum number of operations required to convert string a to string b.
const minDistance = (a: string, b: string): number | undefined => {
  const m = a.length;
  const n = b.length;

  if (m < n) {
    return minDistance(b, a);
  }

  if (n === 0) {
    return m;
  }

  let previousRow = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 0; i < m; i++) {
    const s1 = a[i];
    const currentRow = [i + 1];
    for (let j = 0; j < n; j++) {
      const s2 = b[j];
      const insertions = (previousRow[j + 1] as any) + 1;
      const deletions = (currentRow[j] as any) + 1;
      const substitutions = (previousRow[j] as any) + Number(s1 !== s2);
      currentRow.push(Math.min(insertions, deletions, substitutions));
    }
    previousRow = currentRow;
  }
  return previousRow[previousRow.length - 1];
};

/* eslint-disable eslint-plugin/require-meta-docs-url */
export const noTypos = defineRule({
  create: (context: any) => {
    const checkTypos = (node: any, name: string) => {
      if (NEXT_EXPORT_FUNCTIONS.includes(name)) {
        return;
      }

      const potentialTypos = NEXT_EXPORT_FUNCTIONS.map((o) => ({
        distance: minDistance(o, name) ?? Infinity,
        option: o,
      }))
        .filter(({ distance }) => distance <= THRESHOLD && distance > 0)
        .sort((a, b) => a.distance - b.distance);

      if (potentialTypos.length) {
        context.report({
          message: `${name} may be a typo. Did you mean ${potentialTypos[0]?.option}?`,
          node,
        });
      }
    };
    return {
      ExportNamedDeclaration: (node: any) => {
        const page = context.filename.split("pages", 2)[1];
        if (!page || path.parse(page).dir.startsWith("/api")) {
          return;
        }

        const decl = node.declaration;

        if (!decl) {
          return;
        }

        switch (decl.type) {
          case "FunctionDeclaration": {
            checkTypos(node, decl.id.name);
            break;
          }
          case "VariableDeclaration": {
            decl.declarations.forEach((d: any) => {
              if (d.id.type !== "Identifier") {
                return;
              }
              checkTypos(node, d.id.name);
            });
            break;
          }
          default: {
            break;
          }
        }
        
      },
    };
  },

  meta: {
    docs: {
      description: "Prevent common typos in Next.js data fetching functions.",
      recommended: true,
    },
    schema: [],
    type: "problem",
  },
});
