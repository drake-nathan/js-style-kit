// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    react: {
      framework: "vite",
      reactRefresh: true,
    },
  },
  {
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
    },
  },
);
