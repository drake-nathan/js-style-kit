# TanStack Query Configuration

ESLint rules for [TanStack Query](https://tanstack.com/query) (formerly React Query) to ensure proper usage patterns and prevent common mistakes.

[← Back to main README](../../README.md)

## Overview

TanStack Query support is **disabled by default** and provides:
- Query dependency validation
- Property ordering consistency
- Stable query client patterns
- Hook usage best practices

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  query: true, // Enable TanStack Query rules
});
```

## When to Use

Enable this configuration when using TanStack Query in your project:

```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
# or
pnpm add @tanstack/react-query
# or
bun add @tanstack/react-query
```

## Rules

### Dependency Validation

**`exhaustive-deps`**
Ensures all dependencies are declared in query keys and function scopes.

```ts
// ✅ Good
const { data } = useQuery({
  queryKey: ['users', userId], // userId in queryKey
  queryFn: () => fetchUser(userId),
});

// ❌ Bad
const { data } = useQuery({
  queryKey: ['users'], // Missing userId
  queryFn: () => fetchUser(userId),
});
```

**`no-unstable-deps`**
Prevents unstable references in query keys that could cause unnecessary refetches.

```ts
// ✅ Good
const queryKey = useMemo(() => ['users', userId], [userId]);
const { data } = useQuery({
  queryKey,
  queryFn: fetchUsers,
});

// ❌ Bad
const { data } = useQuery({
  queryKey: ['users', { id: userId }], // New object each render
  queryFn: fetchUsers,
});
```

### Property Ordering

**`infinite-query-property-order`**
Enforces consistent property order in `useInfiniteQuery`:

```ts
// ✅ Good - correct order
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  initialPageParam: 0,
});
```

**`mutation-property-order`**
Enforces consistent property order in `useMutation`:

```ts
// ✅ Good - correct order
useMutation({
  mutationFn: createUser,
  onSuccess: () => { /* ... */ },
  onError: () => { /* ... */ },
});
```

### Query Function Patterns

**`no-void-query-fn`**
Prevents `void` returning query functions:

```ts
// ✅ Good
useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(), // Returns Promise<User[]>
});

// ❌ Bad
useQuery({
  queryKey: ['users'],
  queryFn: () => { fetchUsers(); }, // Returns void
});
```

**`no-rest-destructuring`**
Prevents rest destructuring which can lead to serialization issues:

```ts
// ✅ Good
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// ❌ Bad
const { data, ...rest } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

### Client Stability

**`stable-query-client`**
Ensures QueryClient is stable across renders:

```ts
// ✅ Good - client created outside component or with useMemo
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}

// ❌ Bad - new client every render
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}
```

## Common Patterns

### With React and TypeScript
```js
export default eslintConfig({
  typescript: true,
  react: { framework: "vite" },
  query: true,
});
```

### With Next.js
```js
export default eslintConfig({
  typescript: true,
  react: { framework: "next" },
  query: true,
});
```

## Customization

Override specific Query rules:

```js
export default eslintConfig({
  query: true,
  rules: {
    // Disable property ordering if you prefer different order
    "@tanstack/query/mutation-property-order": "off",

    // Make exhaustive-deps an error instead of warning
    "@tanstack/query/exhaustive-deps": "error",
  },
});
```

## Best Practices

1. **Always declare dependencies** in query keys
2. **Use stable references** for query keys (memoize objects)
3. **Keep query functions pure** - return data, don't mutate
4. **Hoist QueryClient** creation outside components
5. **Follow property order conventions** for consistency

## Troubleshooting

### False positives on exhaustive-deps
Ensure all variables used in `queryFn` are in `queryKey`:

```ts
const { data } = useQuery({
  queryKey: ['users', filter, sort], // Include all dependencies
  queryFn: () => fetchUsers({ filter, sort }),
});
```

### Object key instability warnings
Memoize object keys:

```ts
const params = useMemo(() => ({ filter, sort }), [filter, sort]);
const { data } = useQuery({
  queryKey: ['users', params],
  queryFn: () => fetchUsers(params),
});
```

## Related Configurations

- [React](../react/README.md) - React configuration
- [TypeScript](../typescript/README.md) - TypeScript support
- [Testing](../testing/README.md) - Test Query hooks

## Learn More

- [TanStack Query ESLint Plugin](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Main README](../../README.md)
