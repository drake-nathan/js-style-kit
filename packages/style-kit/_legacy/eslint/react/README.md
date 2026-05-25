# React Configuration

Comprehensive React support with ESLint rules for React, hooks, compiler, and framework-specific configurations for Next.js, Vite, Remix, and React Router.

[← Back to main README](../../../README.md)

## Overview

React support is **disabled by default** and provides:

- React and JSX best practices
- React Hooks validation
- React Compiler support (enabled by default)
- Framework-specific configurations
- TypeScript integration

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  react: true, // Enable with defaults
});
```

## Configuration Options

### Basic Enable

```js
react: true; // React + hooks + compiler rules
```

### Framework-Specific

```js
react: {
  framework: "next",        // "next" | "vite" | "remix" | "react-router" | "none"
  reactCompiler: true,      // React 19 compiler (default: true)
  reactRefresh: false,      // Fast Refresh validation (framework-dependent)
}
```

## Framework Configurations

### Next.js

```js
export default eslintConfig({
  react: { framework: "next" },
});
```

**Includes:**

- ✅ Next.js-specific ESLint rules
- ✅ Ignores `.next` directory
- ✅ React Refresh disabled (Next.js handles it)

### Vite

```js
export default eslintConfig({
  react: { framework: "vite" },
});
```

**Includes:**

- ✅ React Refresh validation enabled
- ✅ No Next.js-specific rules

### Remix

```js
export default eslintConfig({
  react: { framework: "remix" },
});
```

**Includes:**

- ✅ React Refresh disabled (Remix handles it)
- ✅ No Next.js-specific rules

### React Router

```js
export default eslintConfig({
  react: { framework: "react-router" },
});
```

**Includes:**

- ✅ React Refresh disabled (Router handles it)
- ✅ No Next.js-specific rules

### Override Defaults

```js
react: {
  framework: "next",
  reactRefresh: true,  // Force enable even with Next.js
}
```

## React Compiler

[React Compiler](https://react.dev/learn/react-compiler) optimizes React components automatically. `eslint-plugin-react-hooks` provides several rules to ensure your code is compatible with the compiler. They are new, and they may conflict with some rules from `eslint-plugin-react`. If it does, open an issue to let me know!

**Enabled by default** when React is enabled.

### What It Checks

- Proper Hook usage
- Component purity requirements
- Dependencies tracking

### Disable Compiler Rules

```js
export default eslintConfig({
  react: {
    framework: "none", // could be anything
    reactCompiler: false,
  },
});
```

## React Fast Refresh

[React Fast Refresh](https://www.npmjs.com/package/react-refresh) provides instant component updates without losing state. The validation ensures your components work with Fast Refresh.

### When to Enable

- ✅ **Enable** for Vite SPAs
- ❌ **Disable** for Next.js (handles its own)
- ❌ **Disable** for Remix (handles its own)
- ❌ **Disable** for React Router (handles its own)

### Manual Control

```js
react: {
  framework: "vite",
  reactRefresh: true,  // Explicitly enable
}
```

### What It Validates

- ✅ Components properly exported
- ✅ No anonymous components
- ✅ No nested component definitions
- ✅ Export patterns compatible with Fast Refresh
- ✅ Allows constant exports with components (Vite-compatible)

## Function Styles for Components

Control how React components are written:

```js
export default eslintConfig({
  react: true,
  functionStyle: "arrow", // Default
});
```

### Arrow Functions (default)

```jsx
// ✅ Good
const MyComponent = ({ name }) => {
  return <div>Hello {name}</div>;
};

export default () => <div>App</div>;
```

### Function Declarations

```jsx
// ✅ Good
function MyComponent({ name }) {
  return <div>Hello {name}</div>;
}

export default function App() {
  return <div>App</div>;
}
```

### Function Expressions

```jsx
// ✅ Good
const MyComponent = function ({ name }) {
  return <div>Hello {name}</div>;
};

export default function () {
  return <div>App</div>;
}
```

### Disabled (Any Style)

```jsx
functionStyle: "off"; // Use any style you prefer
```

## Key Rules

### React Hooks

- **`react-hooks/rules-of-hooks`** - Enforces Rules of Hooks
- **`react-hooks/exhaustive-deps`** - Validates dependency arrays

```jsx
// ✅ Good - hooks at top level
const MyComponent = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    /* ... */
  }, [count]); // All deps listed
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};

// ❌ Bad - hooks in conditional
const MyComponent = () => {
  if (condition) {
    const [count, setCount] = useState(0); // ❌ Conditional hook
  }
};
```

### JSX Best Practices

- **`react/jsx-boolean-value`** - Enforce boolean prop syntax
- **`react/jsx-curly-brace-presence`** - Avoid unnecessary JSX braces
- **`react/jsx-fragments`** - Prefer `<>` over `<React.Fragment>`
- **`react/jsx-key`** - Require `key` prop in lists
- **`react/jsx-no-target-blank`** - Prevent unsafe `target="_blank"`
- **`react/self-closing-comp`** - Require self-closing tags when appropriate

```jsx
// ✅ Good
<>
  <MyComponent enabled />
  {items.map(item => <Item key={item.id} {...item} />)}
  <Link href="/docs" target="_blank" rel="noopener noreferrer">Docs</Link>
  <EmptyComponent />
</>

// ❌ Bad
<React.Fragment>
  <MyComponent enabled={true} />
  {items.map(item => <Item {...item} />)} {/* Missing key */}
  <Link href="/docs" target="_blank">Docs</Link> {/* Unsafe */}
  <EmptyComponent></EmptyComponent>
</React.Fragment>
```

### Component Best Practices

- **`react/no-array-index-key`** - Avoid array index as key
- **`react/no-children-prop`** - Use children as JSX, not prop
- **`react/no-danger`** - Warn on `dangerouslySetInnerHTML`
- **`react/no-unstable-nested-components`** - No component definitions in render
- **`react/void-dom-elements-no-children`** - No children on void elements

```jsx
// ✅ Good
const Parent = () => {
  return items.map((item) => <Item key={item.id}>{item.name}</Item>);
};

// ❌ Bad
const Parent = () => {
  // ❌ Component defined inside render
  const Child = () => <div>Bad</div>;

  return (
    <>
      {items.map((item, i) => (
        <Item key={i}>{item.name}</Item>
      ))}{" "}
      {/* ❌ Index as key */}
      <img>child content</img> {/* ❌ Void element with children */}
    </>
  );
};
```

### State Management

- **`react/no-direct-mutation-state`** - No direct state mutation
- **`react/no-unused-state`** - Detect unused state
- **`react/prefer-stateless-function`** - Prefer functions over classes when possible

### TypeScript Integration

When both React and TypeScript are enabled:

```js
export default eslintConfig({
  react: true,
  typescript: true, // Enabled by default
});
```

**Additional rules:**

- `react/prop-types` disabled (TypeScript handles it)
- Type-safe prop definitions
- JSX type checking

[→ See TypeScript Configuration](../typescript/README.md)

## Next.js-Specific Rules

When `framework: "next"` is set, additional Next.js rules are included:

- Google Font optimization
- No `<img>` element (use `next/image`)
- No `<head>` element (use `next/head`)
- No HTML link for pages
- Script optimization
- And more...

[→ Learn more about Next.js plugin](../nextjs/README.md)

## Common Patterns

### Next.js + TypeScript

```js
export default eslintConfig({
  typescript: "./tsconfig.json",
  react: {
    framework: "next",
    reactCompiler: true,
  },
});
```

### Vite + TypeScript

```js
export default eslintConfig({
  typescript: true,
  react: {
    framework: "vite",
    reactRefresh: true,
  },
});
```

### Library Development

```js
export default eslintConfig({
  typescript: true,
  react: true,
  jsdoc: { requireJsdoc: true },
  functionStyle: "arrow",
});
```

## Customization

Override specific React rules:

```js
export default eslintConfig({
  react: true,
  rules: {
    // Allow array index as key in some cases
    "react/no-array-index-key": "off",

    // Disable compiler rules
    "react-hooks/react-compiler": "off",

    // Stricter hook dependencies
    "react-hooks/exhaustive-deps": "error",
  },
});
```

## Troubleshooting

### React version detection fails

Ensure React is installed in your project. The config auto-detects the version.

### Fast Refresh not working

1. Check that `reactRefresh: true` is set for Vite
2. Ensure components follow Fast Refresh patterns
3. Review warnings from `eslint-plugin-react-refresh`

## Related Configurations

- [TypeScript](../typescript/README.md) - TypeScript configuration
- [Next.js Plugin](../nextjs/README.md) - Next.js-specific rules
- [Testing](../testing/README.md) - Test React components

## Learn More

- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [React Hooks ESLint Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [React Refresh Plugin](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Main README](../../../README.md)
