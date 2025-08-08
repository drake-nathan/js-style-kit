//@ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  ignores: ["bin/temp-test"],
  testing: {
    framework: "bun",
  },
});
