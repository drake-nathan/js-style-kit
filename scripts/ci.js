/* eslint-disable no-console */
import { spawn } from "node:child_process";

// Commands organized into parallel phases
// Phase 1: Independent tasks that can run in parallel
// Phase 2: Tasks that depend on build completing
const phases = [
  {
    commands: [
      { color: "\x1b[32m", command: "turbo run sherif", name: "sherif" }, // Green
      { color: "\x1b[34m", command: "turbo run build", name: "build" }, // Blue
    ],
    name: "Phase 1: Build & Independent Checks",
  },
  {
    commands: [
      { color: "\x1b[36m", command: "bun run format", name: "format" }, // Cyan
      { color: "\x1b[37m", command: "turbo run typecheck", name: "typecheck" }, // White
      { color: "\x1b[33m", command: "turbo run lint", name: "lint" }, // Yellow
      { color: "\x1b[35m", command: "turbo run test", name: "test" }, // Magenta
    ],
    name: "Phase 2: Validation (after build)",
  },
];

// Flatten for status tracking
const allCommands = phases.flatMap((phase) => phase.commands);

// Clear the terminal
console.clear();

// Get terminal width for pretty formatting
const getTerminalWidth = () => {
  try {
    const { columns } = process.stdout;
    return columns || 80;
  } catch {
    return 80;
  }
};

const terminalWidth = getTerminalWidth();
const resetColor = "\x1b[0m";
const boldText = "\x1b[1m";
const dimText = "\x1b[2m";

// Print header
const printHeader = () => {
  const header = "====== CI CHECKS ======";
  const padding = Math.floor((terminalWidth - header.length) / 2);
  console.log(`\n${" ".repeat(padding)}${boldText}${header}${resetColor}\n`);
};

// Track command status
const status = allCommands.reduce((acc, cmd) => {
  acc[cmd.name] = {
    endTime: 0,
    startTime: 0,
    status: "pending",
    turboCache: false,
  };
  return acc;
}, {});

// Print status of all commands
const printStatus = () => {
  console.clear();
  printHeader();

  const maxNameLength = Math.max(...allCommands.map((cmd) => cmd.name.length));

  for (const phase of phases) {
    console.log(`${dimText}${phase.name}${resetColor}`);

    for (const cmd of phase.commands) {
      const { endTime, startTime, status: cmdStatus } = status[cmd.name];
      let statusText;
      let statusColor;

      if (cmdStatus === "pending") {
        statusText = "PENDING";
        statusColor = "\x1b[90m"; // Gray
      } else if (cmdStatus === "running") {
        statusText = "RUNNING";
        statusColor = "\x1b[33m"; // Yellow
      } else if (cmdStatus === "success") {
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        const turboText =
          status[cmd.name].turboCache ? " \x1b[34m(FULL TURBO)\x1b[32m" : "";
        statusText = `SUCCESS (${duration}s)${turboText}`;
        statusColor = "\x1b[32m"; // Green
      } else {
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        statusText = `FAILED (${duration}s)`;
        statusColor = "\x1b[31m"; // Red
      }

      console.log(
        `  ${cmd.color}${cmd.name.padEnd(maxNameLength)}${resetColor} : ${statusColor}${statusText}${resetColor}`,
      );
    }

    console.log("");
  }
};

// Collect output for a command to display after completion
const commandOutputs = {};

// Run a single command
const runCommand = async (cmd) => {
  const { command, name } = cmd;

  // Update status to running
  status[name].status = "running";
  status[name].startTime = Date.now();
  commandOutputs[name] = [];
  printStatus();

  return new Promise((resolve) => {
    const proc = spawn(command, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Collect stdout
    proc.stdout.on("data", (data) => {
      const output = data.toString().trim();
      commandOutputs[name].push({ output, type: "stdout" });

      // Check for Turbo cache hits
      if (output.includes("cache hit") || output.includes("FULL TURBO")) {
        status[name].turboCache = true;
      }
    });

    // Collect stderr
    proc.stderr.on("data", (data) => {
      commandOutputs[name].push({
        output: data.toString().trim(),
        type: "stderr",
      });
    });

    proc.on("close", (code) => {
      status[name].endTime = Date.now();
      status[name].status = code === 0 ? "success" : "failed";
      printStatus();

      resolve(code === 0);
    });
  });
};

// Run a phase (all commands in parallel)
const runPhase = async (phase) => {
  console.log(`\n${boldText}${phase.name}${resetColor}\n`);

  const results = await Promise.all(phase.commands.map(runCommand));

  // Print collected output for failed commands
  for (const cmd of phase.commands) {
    if (status[cmd.name].status === "failed") {
      console.log(
        `\n${cmd.color}====== ${cmd.name} output ======${resetColor}`,
      );
      for (const entry of commandOutputs[cmd.name]) {
        const outputColor = entry.type === "stderr" ? "\x1b[31m" : cmd.color;
        console.log(`${outputColor}${entry.output}${resetColor}`);
      }
    }
  }

  return results.every(Boolean);
};

// Run all phases
const runAll = async () => {
  const totalStartTime = Date.now();
  printStatus();

  let allSuccess = true;

  for (const phase of phases) {
    const phaseSuccess = await runPhase(phase);
    if (!phaseSuccess) {
      allSuccess = false;
      // Continue to show status but skip remaining phases
      break;
    }
  }

  // Calculate total run time
  const totalEndTime = Date.now();
  const totalDuration = ((totalEndTime - totalStartTime) / 1000).toFixed(2);

  // Final summary
  printStatus();
  console.log("\n");
  if (allSuccess) {
    console.log(
      `${boldText}\x1b[32m✓ All checks passed successfully!${resetColor}`,
    );
  } else {
    console.log(
      `${boldText}\x1b[31m✗ Some checks failed. Please fix the issues above.${resetColor}`,
    );
  }

  console.log(`${boldText}\nTotal run time: ${totalDuration}s${resetColor}\n`);

  if (!allSuccess) {
    process.exit(1);
  }
};

// Handle interruption
process.on("SIGINT", () => {
  console.log(`\n\x1b[31mProcess interrupted by user${resetColor}`);
  process.exit(1);
});

runAll();
