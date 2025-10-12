---
"js-style-kit": patch
---

## Infrastructure Changes

- **Removed Mintlify docs infrastructure**: Removed `docs/` workspace from monorepo configuration (package.json:7)
- **Added Bun version check**: Added `preinstall` script to verify Bun version compatibility (package.json:18, scripts/check-bun-version.js)
- **Updated CI workflow**: Removed docs-related steps from CI pipeline (.github/workflows/ci.yaml)
