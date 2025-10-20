import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  convex: true,
  react: {
    framework: "next",
  },
  typescript: "tsconfig.eslint.json",
});
