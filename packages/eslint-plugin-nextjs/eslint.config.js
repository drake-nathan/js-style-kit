// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  testing: {
    framework: "bun",
  },
  typescript: "tsconfig.eslint.json",
});
