---
"eslint-plugin-nextjs": patch
---

## Code Improvements

- **Modernized package.json import**: Switched from `fs.readFileSync()` to native JSON import with `import pkg from "../package.json" with { type: "json" }` for better ESM compatibility (packages/eslint-plugin-nextjs/src/index.ts:3)

## Dependencies

- `@types/node`: 22.18.8 → 22.18.10
