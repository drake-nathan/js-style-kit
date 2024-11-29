import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.js"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
});
