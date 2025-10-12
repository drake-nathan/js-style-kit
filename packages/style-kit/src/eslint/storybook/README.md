# Storybook Configuration

ESLint rules for Storybook stories and configuration files.

[← Back to main README](../../../README.md)

## Overview

Storybook configuration is **disabled by default** and provides:

- Story file best practices
- CSF (Component Story Format) validation
- Story naming and structure rules
- Testing library integration
- Storybook addon validation

## Quick Start

```js
import { eslintConfig } from "js-style-kit";

export default eslintConfig({
  storybook: true, // Enable Storybook rules
});
```

## File Scope

Storybook rules apply to:

- **Story files**: `**/*.stories.{ts,tsx,js,jsx,mjs,cjs}` and `**/*.story.{ts,tsx,js,jsx,mjs,cjs}`
- **Config files**: `.storybook/main.{js,cjs,mjs,ts}`

## Key Features

### CSF (Component Story Format)

Ensures proper CSF structure:

```tsx
// ✅ Good - proper CSF format
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Click me",
    variant: "primary",
  },
};

// ❌ Bad - missing default export
export const Primary: Story = {
  /* ... */
};

// ❌ Bad - missing component in meta
export default {
  title: "Components/Button",
};
```

**Rules:**

- `storybook/default-exports` - Requires default export with meta
- `storybook/csf-component` - Ensures `component` is defined in meta

### Story Naming

Enforces consistent story naming:

```tsx
// ✅ Good - PascalCase story names
export const Primary: Story = {
  /* ... */
};
export const Secondary: Story = {
  /* ... */
};
export const WithIcon: Story = {
  /* ... */
};

// ❌ Bad - incorrect casing
export const primary: Story = {
  /* ... */
};
export const with_icon: Story = {
  /* ... */
};

// ❌ Bad - redundant story name
export const ButtonPrimary: Story = {
  name: "Primary", // Redundant - matches export name
};
```

**Rules:**

- `storybook/prefer-pascal-case` - PascalCase for story names
- `storybook/no-redundant-story-name` - No redundant `name` property

### Story Structure

Ensures clean story organization:

```tsx
// ✅ Good - meta properties as properties
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

// ✅ Good - hierarchy separator
const meta = {
  title: "Design System/Components/Button", // Uses /
} satisfies Meta<typeof Button>;

// ❌ Bad - hierarchy with pipe
const meta = {
  title: "Design System | Components | Button", // Don't use |
} satisfies Meta<typeof Button>;
```

**Rules:**

- `storybook/meta-inline-properties` - Inline meta properties (no spread)
- `storybook/hierarchy-separator` - Use `/` for hierarchy, not `|`
- `storybook/story-exports` - All exports must be stories (except default)

### Testing Integration

When writing play functions for interaction tests:

```tsx
// ✅ Good - proper test setup
export const Login: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "user@example.com");
    await userEvent.click(canvas.getByRole("button"));

    await expect(canvas.getByText("Welcome")).toBeInTheDocument();
  },
};

// ❌ Bad - missing context parameter
export const Login: Story = {
  play: async () => {
    // Missing context - can't access canvas
    await userEvent.click(/* ??? */);
  },
};

// ❌ Bad - not awaiting interactions
export const Login: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByRole("button")); // Missing await
  },
};

// ❌ Bad - using regular testing-library
import { screen } from "@testing-library/react"; // Don't import from here

export const Login: Story = {
  play: async () => {
    screen.getByRole("button"); // Use canvas from context instead
  },
};
```

**Rules:**

- `storybook/context-in-play-function` - Requires context parameter in play functions
- `storybook/await-interactions` - Ensures interactions are awaited
- `storybook/use-storybook-expect` - Use `@storybook/test` expect
- `storybook/use-storybook-testing-library` - Use `@storybook/test` for queries

### Disabled Rules in Stories

Certain rules are automatically disabled in story files:

```tsx
// ✅ OK in story files - anonymous default export
export default {
  title: "Components/Button",
  component: Button,
};

// ✅ OK in story files - rules of hooks don't apply
export const WithHook: Story = {
  render: () => {
    const [count, setCount] = useState(0); // OK in render function
    return <Button onClick={() => setCount(count + 1)}>{count}</Button>;
  },
};
```

**Auto-disabled:**

- `import/no-anonymous-default-export` - Story meta needs anonymous default
- `react-hooks/rules-of-hooks` - Hooks in render functions are OK

### Storybook Configuration

Additional rules for `.storybook/main.js` configuration:

```js
// .storybook/main.ts
const config = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
};

export default config;
```

**Rules:**

- `storybook/no-uninstalled-addons` - Ensures addons are installed in `package.json`

## Examples

### Basic Component Story

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
  },
};

export const Disabled: Story = {
  args: {
    children: "Button",
    disabled: true,
  },
};
```

### Story with Interactions

```tsx
// LoginForm.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { LoginForm } from "./LoginForm";

const meta = {
  title: "Forms/LoginForm",
  component: LoginForm,
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilledForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), "user@example.com");
    await userEvent.type(canvas.getByLabelText("Password"), "password123");
  },
};

export const SubmitSuccess: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByLabelText("Email"), "user@example.com");
    await userEvent.type(canvas.getByLabelText("Password"), "password123");
    await userEvent.click(canvas.getByRole("button", { name: /submit/i }));

    await expect(canvas.getByText("Success!")).toBeInTheDocument();
  },
};
```

### Multiple Components

```tsx
// Card.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { CardHeader } from "./CardHeader";
import { CardBody } from "./CardBody";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>Title</CardHeader>
      <CardBody>Content goes here</CardBody>
    </Card>
  ),
};
```

## Customization

### Disable Specific Rules

```js
export default eslintConfig({
  storybook: true,
  rules: {
    // Allow non-PascalCase story names
    "storybook/prefer-pascal-case": "off",

    // Allow redundant story names
    "storybook/no-redundant-story-name": "off",
  },
});
```

### Custom Story Patterns

```js
export default eslintConfig({
  storybook: true,
  overrides: [
    {
      // Apply to custom story file pattern
      files: ["**/*.stories.mdx"],
      rules: {
        // Custom rules for MDX stories
      },
    },
  ],
});
```

## Common Patterns

### Storybook + React + TypeScript

```js
export default eslintConfig({
  typescript: true,
  react: true,
  storybook: true,
});
```

### Storybook with Testing

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

// Story with comprehensive testing
export const InteractiveTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test user interactions
    await userEvent.click(canvas.getByRole("button"));

    // Verify results
    await expect(canvas.getByText("Clicked")).toBeInTheDocument();
  },
};
```

## Related Configurations

- [React](../react/README.md) - React configuration
- [TypeScript](../typescript/README.md) - TypeScript configuration
- [Testing](../testing/README.md) - Test configuration

## Learn More

- [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)
- [Storybook](https://storybook.js.org/)
- [Component Story Format (CSF)](https://storybook.js.org/docs/react/api/csf)
- [Storybook Interactions](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
- [Main README](../../../README.md)
