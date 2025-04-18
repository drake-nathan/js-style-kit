import eslintPlugin from "eslint-plugin-eslint-plugin";

// @ts-check
// eslint-disable-next-line import-x/no-relative-packages
import { eslintConfig } from "../style-kit/dist/index.js";

export default eslintConfig(
  {
    testing: {
      framework: "bun",
    },
    typescript: "tsconfig.eslint.json",
  },
  eslintPlugin.configs["flat/recommended"],
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
