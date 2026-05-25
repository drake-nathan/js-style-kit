# vite-plus-test-app

Exercises the Vite+ inline-config consumer path for `js-style-kit`. The whole
of the lint + format wiring lives in [vite.config.ts](./vite.config.ts), driven
by a single `styleKit()` call — no standalone `oxlint.config.ts` /
`oxfmt.config.ts` files.

This is a fixture, not a runnable demo: it doesn't actually depend on Vite+
in `node_modules` (Vite+ may not be installable in this repo yet). Its job is
to prove that `styleKit().{oxlint,oxfmt}` round-trips through a vite.config
shape without TypeScript or runtime errors.
