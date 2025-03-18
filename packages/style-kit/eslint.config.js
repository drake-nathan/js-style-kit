import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  jsdoc: {
    requireJsdoc: true,
  },
  testing: {
    framework: "bun",
  },
  typescript: "tsconfig.eslint.json",
});
