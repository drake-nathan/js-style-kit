/**
 * Check if the installed Bun version matches the required version as defined in `.bun-version`.
 * As of today (September 2025), Corepack doesn't support Bun as a valid package manager.
 */
(async () => {
  const required = await Bun.file(".bun-version").text();
  const actual = Bun.version;

  if (actual.trim() !== required.trim()) {
    console.error(
      `Error: Bun version ${required.trim()} required, but ${actual} is installed.`,
    );
    process.exit(1);
  }
})();
