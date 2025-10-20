// @ts-check
import eslintPlugin from "eslint-plugin-eslint-plugin";

// eslint-disable-next-line import-x/no-relative-packages
import { eslintConfig } from "../style-kit/dist/index.js";

export default eslintConfig(
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "no-param-reassign": "off",
    },
    testing: {
      framework: "bun",
    },
    typescript: "tsconfig.eslint.json",
  },
  eslintPlugin.configs.recommended,
  {
    files: ["test/**/*"],
    name: "test-overrides",
    rules: {
      "@typescript-eslint/no-empty-function": "off",
    },
  },
);
