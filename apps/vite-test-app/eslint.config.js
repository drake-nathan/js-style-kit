import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    react: true,
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
