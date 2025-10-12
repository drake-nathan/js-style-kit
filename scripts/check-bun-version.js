/**
 * Check if the installed Bun version matches the required version as defined in package.json's packageManager field.
 * As of today (September 2025), Corepack doesn't support Bun as a valid package manager.
 */
(async () => {
  const packageJson = await Bun.file("package.json").json();
  const packageManager = packageJson.packageManager;

  if (!packageManager) {
    console.error("Error: No packageManager field found in package.json");
    process.exit(1);
  }

  // Parse "bun@x.x.x" format
  const match = packageManager.match(/^bun@(?<version>.+)$/);

  if (!match) {
    console.error(
      `Error: packageManager field "${packageManager}" is not in the format "bun@x.x.x"`,
    );
    process.exit(1);
  }

  const required = match.groups.version;
  const actual = Bun.version;

  if (actual.trim() !== required.trim()) {
    console.error(
      `Error: Bun version ${required.trim()} required, but ${actual} is installed.`,
    );
    process.exit(1);
  }
})();
