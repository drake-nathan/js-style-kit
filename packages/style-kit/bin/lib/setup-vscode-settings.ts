import fs from "node:fs";
import path from "node:path";

/**
 * Sets up VS Code settings
 */
export const setupVSCodeSettings = (): void => {
  console.info("Setting up VS Code settings...");

  try {
    const vscodeDir = path.join(process.cwd(), ".vscode");
    const settingsPath = path.join(vscodeDir, "settings.json");

    // Create .vscode directory if it doesn't exist
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir);
    }

    // Read existing settings or create new ones
    let settings: Record<string, unknown> = {};
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }

    // Update settings
    settings = {
      ...settings,
      "editor.codeActionsOnSave": {
        ...(settings["editor.codeActionsOnSave"] || {}),
        "source.fixAll.eslint": "explicit",
      },
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "eslint.runtime": "node",
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
