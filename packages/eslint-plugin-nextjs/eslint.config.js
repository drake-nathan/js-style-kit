// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    testing: {
      framework: "bun",
    },
    typescript: "tsconfig.eslint.json",
  },
  {
    name: "custom-overrides",
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "no-param-reassign": "off",
    },
  },
  {
    files: ["test/**/*"],
    name: "test-overrides",
    rules: {
      "@typescript-eslint/no-empty-function": "off",
    },
  },
);
