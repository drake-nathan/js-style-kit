import fs from "node:fs";
import path from "node:path";

/**
 * Sets up VS Code settings to recommend the oxc.oxlint extension and
 * disable the legacy prettier / eslint integrations.
 */
export const setupVSCodeSettings = (): void => {
  console.info("Setting up VS Code settings...");

  try {
    const vscodeDir = path.join(process.cwd(), ".vscode");
    const settingsPath = path.join(vscodeDir, "settings.json");

    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir);
    }

    let settings: Record<string, unknown> = {};
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }

    const existingActions = (settings["editor.codeActionsOnSave"] ?? {}) as Record<
      string,
      unknown
    >;
    // Drop the legacy eslint action if present so we don't leave a
    // half-converted config behind.
    delete existingActions["source.fixAll.eslint"];

    settings = {
      ...settings,
      "editor.codeActionsOnSave": {
        ...existingActions,
        "source.fixAll.oxc": "explicit",
      },
      "editor.formatOnSave": true,
      "oxc.enable": true,
      "tailwindCSS.classFunctions": ["cn", "cva", "clsx"],
    };

    fs.writeFileSync(
      settingsPath,
      JSON.stringify(settings, null, 2).concat("\n"),
    );
    console.info("VS Code settings updated");
  } catch (error) {
    console.error("Failed to set up VS Code settings:", error);
    process.exit(1);
  }
};
