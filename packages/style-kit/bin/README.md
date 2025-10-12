# CLI (Beta)

Quick setup tool to initialize ESLint and Prettier configuration.

[← Back to main README](../README.md)

## Overview

```bash
npx js-style-kit init
```

That's it! The CLI will:

1. ✅ Detect your package manager (bun, pnpm, yarn, or npm)
2. ✅ Install js-style-kit as a dev dependency
3. ✅ Remove duplicate dependencies
4. ✅ Create configuration files
5. ✅ Add scripts to package.json
6. ✅ Configure VS Code settings

### File Structure

After running the CLI, you'll have:

```
your-project/
├── .vscode/
│   └── settings.json          # VS Code configuration
├── eslint.config.js           # ESLint config
├── package.json               # Updated with new scripts
├── prettier.config.js         # Prettier config
```

## Learn More

- [Main README](../README.md)
- [Configuration Options](../README.md#configuration)
- [ESLint Setup](../README.md#eslint-options)
- [Prettier Setup](../README.md#prettier-options)
