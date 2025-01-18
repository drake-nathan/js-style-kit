import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entryPoints: ["src/**/*"],
  format: ["esm"],
  outDir: "dist",
  sourcemap: true,
});
