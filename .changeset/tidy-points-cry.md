---
"eslint-plugin-nextjs": major
---

# V1 - ESLint V9 / TypeScript upgrades

## Changes

- Merged old configs to a single `recommended` flat config (no legacy support, use 0.1.2 for legacy support).
- All rules now "warn" by default, which is best practice so that you can distinguish between ESLint issues and TypeScript issues.
- Now exports in ESM only. This is easy to use in with the flat config.
- Refactored all rules with better TypeScript support using utility types from `@typescript-eslint/utils`.

## Migration

Only use this version if you plan to roll your own ESLint config with ESM and ESLint v9 using flat config. If you need CJS or legacy, refer to v0.1.2.

If you're not rolling your own config, just use what you get from Next.js. I still hope they will update their plugin soon.

To use this plugin with the new format, simply add it to your config:

```js
// eslint.config.js/mjs
import nextjs from "eslint-plugin-nextjs";

export default [
  // ... other configs
  nextjs.configs.recommended,
];
```

If you're project has `"type": "module"` in `package.json`, you can use `eslint.config.js`, otherwise use `eslint.config.mjs` which will allow you to use ESM syntax in that file.
