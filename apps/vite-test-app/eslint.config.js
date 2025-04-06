// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    react: {
      framework: "next",
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
