---
"js-style-kit": major
---

Remove the bundled `eslint-plugin-nextjs` fork.

The fork existed to give `@next/eslint-plugin-next` TypeScript and ESLint v9
support. With the oxlint migration the package is replaced by oxlint's
built-in `nextjs` plugin, so the fork is no longer maintained or shipped.
