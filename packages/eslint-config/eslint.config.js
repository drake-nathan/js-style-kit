import { eslintConfig } from "eslint-config-everything";

export default eslintConfig({
  functionStyle: "arrow",
  ignores: ["this gets added to the defaults"],
  nextjs: true,
  react: true,
  sorting: true,
  typescript: true,
});
