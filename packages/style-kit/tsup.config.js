import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entryPoints: ["src/**/*", "bin/**/*"],
  format: ["esm"],
  outDir: "dist",
  sourcemap: true,
});
