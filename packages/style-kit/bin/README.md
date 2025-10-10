# CLI Tool

Quick setup tool to initialize JavaScript/TypeScript projects with ESLint and Prettier configurations.

[← Back to main README](../README.md)

## Overview

The CLI tool automates the setup process for js-style-kit in your project. It handles:

- Package manager detection
- Dependency installation
- Configuration file creation
- npm/yarn/pnpm/bun script setup
- VS Code settings configuration

**Status:** Production ready (used to be beta, but it's stable now)

## Quick Start

```bash
npx js-style-kit init
```

That's it! The CLI will:

1. ✅ Detect your package manager (bun, pnpm, yarn, or npm)
2. ✅ Install js-style-kit as a dev dependency
3. ✅ Create configuration files
4. ✅ Add scripts to package.json
5. ✅ Configure VS Code settings

## What Gets Created

### Configuration Files

The CLI creates these files based on your project's module type:

**For ESM projects** (`"type": "module"` in package.json):

- `style-kit.config.js` - Central configuration
- `eslint.config.js` - ESLint setup (imports from style-kit.config.js)
- `prettier.config.js` - Prettier setup (imports from style-kit.config.js)

**For CommonJS projects**:

- `style-kit.config.mjs` - Central configuration
- `eslint.config.mjs` - ESLint setup
- `prettier.config.mjs` - Prettier setup

### File Structure

After running the CLI, you'll have:

```
your-project/
├── .vscode/
│   └── settings.json          # VS Code configuration
├── eslint.config.js           # ESLint config (imports from style-kit)
├── package.json               # Updated with new scripts
├── prettier.config.js         # Prettier config (imports from style-kit)
└── style-kit.config.js        # Central configuration file
```

### Central Configuration Pattern

The CLI uses a centralized config pattern:

**style-kit.config.js:**

```js
import { eslintConfig, prettierConfig } from "js-style-kit";

export const eslint = eslintConfig({
  // Your ESLint options here
});

export const prettier = prettierConfig({
  // Your Prettier options here
});
```

**eslint.config.js:**

```js
import { eslint } from "./style-kit.config.js";

export default eslint;
```

**prettier.config.js:**

```js
import { prettier } from "./style-kit.config.js";

export default prettier;
```

**Benefits:**

- Single source of truth for all styling configuration
- Easy to see all settings in one place
- Cleaner project root with organized configs

## Package Manager Detection

The CLI automatically detects your package manager:

| Lock File         | Package Manager |
| ----------------- | --------------- |
| `bun.lock`        | Bun             |
| `pnpm-lock.yaml`  | pnpm            |
| `yarn.lock`       | Yarn            |
| None of the above | npm             |

It uses the detected package manager for:

- Installing dependencies
- Displaying run commands in success message

## npm Scripts

The CLI adds these scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier format",
    "format:check": "prettier format --check",
    "lint": "eslint lint",
    "lint:fix": "eslint lint --fix"
  }
}
```

> **Note:** Uses the new Prettier CLI commands (`prettier format`) available in Prettier v3+

## VS Code Integration

The CLI creates/updates `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.runtime": "node",
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "style-kit.config.js": "eslint.config.js, prettier.config.js"
  }
}
```

**Features:**

- Auto-fix ESLint issues on save
- Format with Prettier on save
- Nest config files under style-kit.config.js in explorer

## CLI Options

### Dry Run Mode

Test what changes would be made without installing dependencies:

```bash
npx js-style-kit init --dry-run
```

**Dry run will:**

- ✅ Create all configuration files
- ✅ Update package.json scripts
- ✅ Configure VS Code settings
- ❌ Skip dependency installation

Useful for:

- Preview changes before committing
- CI/CD pipelines
- Testing the CLI

## Usage Examples

### New Project

```bash
# Initialize project
npm init -y

# Run CLI
npx js-style-kit init

# Start coding!
npm run lint
npm run format
```

### Existing Project

```bash
# In existing project
npx js-style-kit init

# Review created files
git diff

# Customize configurations in style-kit.config.js
# Then commit
git add .
git commit -m "Add js-style-kit configuration"
```

### With Specific Package Manager

```bash
# Force specific package manager by creating lock file first
pnpm install  # Creates pnpm-lock.yaml

# Then run CLI (will detect pnpm)
npx js-style-kit init
```

## Customization After Setup

After the CLI creates files, customize them in `style-kit.config.js`:

```js
import { eslintConfig, prettierConfig } from "js-style-kit";

export const eslint = eslintConfig({
  typescript: "./tsconfig.json",
  react: {
    framework: "next",
  },
  testing: {
    framework: "vitest",
  },
});

export const prettier = prettierConfig({
  tailwindPlugin: true,
  printWidth: 100,
  singleQuote: true,
});
```

[→ See all ESLint options](../README.md#eslint-options)
[→ See all Prettier options](../README.md#prettier-options)

## Troubleshooting

### "package.json not found"

Run the CLI from your project root where `package.json` exists:

```bash
cd your-project
npx js-style-kit init
```

### Wrong package manager detected

Create the appropriate lock file:

```bash
# For pnpm
pnpm install

# For yarn
yarn install

# For bun
bun install
```

Then run the CLI again.

### Config files already exist

The CLI will overwrite existing config files. Back them up first:

```bash
cp eslint.config.js eslint.config.js.backup
npx js-style-kit init
```

### VS Code settings conflict

The CLI merges with existing `.vscode/settings.json`. Review and adjust as needed.

### Module type issues

If you see ESM errors, ensure:

- Your `package.json` has `"type": "module"`, OR
- Config files use `.mjs` extension

The CLI handles this automatically, but manual edits might break it.

## Best Practices

1. **Fresh projects** - Run the CLI early in project setup
2. **Review changes** - Always review generated configs before committing
3. **Customize** - Edit `style-kit.config.js` to match your needs
4. **Version control** - Commit all generated files
5. **Team sync** - Ensure team has same VS Code extensions:
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Manual Setup Alternative

If the CLI doesn't fit your needs, you can set up manually:

[→ See manual setup instructions](../README.md#option-2-manual-setup)

## Requirements

- Node.js v20.11.0 or higher
- Existing `package.json` file
- Git (optional, for tracking changes)

## Learn More

- [Main README](../README.md)
- [Configuration Options](../README.md#configuration)
- [ESLint Setup](../README.md#eslint-options)
- [Prettier Setup](../README.md#prettier-options)
