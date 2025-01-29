import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  functionStyle: "off",
  ignores: [".docusaurus"],
  react: true,
  typescript: "./tsconfig.eslint.json",
});
