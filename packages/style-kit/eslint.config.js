// @ts-check
import { eslintConfig } from "../style-kit/dist/index.js";

export default eslintConfig({
  jsdoc: {
    requireJsdoc: true,
  },
  testing: {
    framework: "bun",
  },
  typescript: "tsconfig.eslint.json",
});
