import { styleKit } from "js-style-kit";

const { oxfmt, oxlint } = styleKit({
  react: { framework: "vite" },
  tailwind: true,
});

/**
 * Exercises the Vite+ inline-config consumer path. Note: this app
 * mocks the shape Vite+'s `defineConfig` expects (its actual API may
 * evolve) — the value of this fixture is in proving that one
 * styleKit() call produces both an oxlint and oxfmt config without
 * the user touching standalone config files.
 */
export default {
  format: oxfmt,
  lint: oxlint,
};
