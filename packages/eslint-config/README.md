# `eslint-config-everything`

## How to Use

All dependencies, including ESLint/Prettier are included. TypeScript is not.

The project is ESM only, and requires at least Node v20.11.0.

### ESLint

TypeScript is enabled by default, React is not.

Create a `eslint.config.js` if using `"type": "module"`, or `eslint.config.mjs` if not.

It accepts a config object, hover the function for the JSDoc options.

```js
import { eslintConfig } from "eslint-config-everything";

export default eslintConfig({});
```

### Prettier

Create a `prettier.config.js` if using `"type": "module"`, or `prettier.config.mjs` if not.

Add `tailwind: true` for to enable Tailwind.

```js
import { prettierConfig } from "eslint-config-everything";

export default prettierConfig({});
```
