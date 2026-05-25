import type { RulesRecord } from "../../types.js";

/**
 * Native `import` plugin rules. The legacy config used `eslint-plugin-import-x`
 * with an `import-x/` prefix; oxlint's native plugin uses the plain `import/`
 * prefix.
 *
 * Rules from the legacy config with no oxlint equivalent (intentionally
 * dropped): `import-x/no-extraneous-dependencies`,
 * `import-x/no-relative-packages`, `import-x/no-useless-path-segments`.
 */
export const buildImportRules = (typescript: boolean): RulesRecord => {
  const rules: RulesRecord = {
    "import/first": "warn",
    "import/newline-after-import": "warn",
    "import/no-absolute-path": "warn",
    "import/no-cycle": "warn",
    "import/no-duplicates": "warn",
    "import/no-mutable-exports": "warn",
    "import/no-named-as-default": "warn",
    "import/no-named-as-default-member": "warn",
    "import/no-self-import": "warn",
  };

  // When TS is on, the TypeScript compiler handles resolution checks; we
  // skip the import equivalents to avoid duplicate / spurious errors.
  if (!typescript) {
    rules["import/default"] = "warn";
    rules["import/export"] = "warn";
    rules["import/named"] = "warn";
    rules["import/namespace"] = "warn";
  }

  return rules;
};
