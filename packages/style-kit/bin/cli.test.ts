/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/no-conditional-in-test */
import { afterEach, describe, expect, it } from "bun:test";
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory of this test file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the compiled CLI
const CLI_PATH = path.resolve(__dirname, "../dist/bin/index.cjs");

describe("CLI Integration Tests", () => {
  let testDir: string;

  afterEach(() => {
    // Clean up test directory after each test
    if (testDir && fs.existsSync(testDir)) {
      fs.rmSync(testDir, { force: true, recursive: true });
    }
  });

  describe("js-style-kit init", () => {
    it("validates package.json exists before proceeding", () => {
      // Create a temporary test directory without package.json
      testDir = path.join(os.tmpdir(), `js-style-kit-test-${Date.now()}`);
      fs.mkdirSync(testDir, { recursive: true });

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);

        // Should throw an error when no package.json exists
        expect(() => {
          execSync(`node ${CLI_PATH} init`, { encoding: "utf8" });
        }).toThrow();
      } finally {
        process.chdir(originalCwd);
      }
    });

    it("detects different package managers correctly", () => {
      // Test with bun.lock
      testDir = path.join(os.tmpdir(), `js-style-kit-test-${Date.now()}`);
      fs.mkdirSync(testDir, { recursive: true });

      const packageJson = {
        devDependencies: {},
        name: "test-project",
        scripts: {},
        version: "1.0.0",
      };

      fs.writeFileSync(
        path.join(testDir, "package.json"),
        JSON.stringify(packageJson, null, 2),
      );

      // Create bun.lock to simulate bun project
      fs.writeFileSync(path.join(testDir, "bun.lock"), "");

      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);

        try {
          const output = execSync(`node ${CLI_PATH} init`, {
            encoding: "utf8",
          });

          expect(output).toContain("Using package manager: bun");
        } catch (error: unknown) {
          // Even if installation fails, we should see the package manager detection
          const output =
            (error as { stderr?: string; stdout?: string }).stdout ||
            (error as { stderr?: string; stdout?: string }).stderr ||
            "";

          expect(output).toContain("Using package manager: bun");
        }
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("cLI help", () => {
    it("shows help when no arguments are provided", () => {
      try {
        execSync(`node ${CLI_PATH}`, {
          encoding: "utf8",
        });
      } catch (error: unknown) {
        // Help command exits with non-zero code, check the output
        const output =
          (error as { stderr?: string; stdout?: string }).stdout ||
          (error as { stderr?: string; stdout?: string }).stderr ||
          "";

        expect(output).toContain("js-style-kit");
        expect(output).toContain("Initialize JavaScript/TypeScript project");
        expect(output).toContain("init");
      }
    });

    it("shows help when --help flag is used", () => {
      const output = execSync(`node ${CLI_PATH} --help`, {
        encoding: "utf8",
      });

      expect(output).toContain("js-style-kit");
      expect(output).toContain("Initialize JavaScript/TypeScript project");
    });
  });
});
