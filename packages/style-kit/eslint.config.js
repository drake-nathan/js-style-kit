// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  jsdoc: {
    requireJsdoc: true,
  },
  storybook: true,
  testing: {
    framework: "bun",
  },
  typescript: "tsconfig.eslint.json",
});
