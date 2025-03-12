import { spawn } from "node:child_process";

const commands = [
  { name: "format", command: "pnpm run format:check", color: "\x1b[36m" }, // Cyan
  { name: "lint", command: "pnpm run lint", color: "\x1b[33m" }, // Yellow
  { name: "test", command: "pnpm run test", color: "\x1b[35m" }, // Magenta
  { name: "sherif", command: "pnpm run sherif", color: "\x1b[32m" }, // Green
  { name: "build", command: "pnpm run build", color: "\x1b[34m" }, // Blue
];

// Clear the terminal
console.clear();

// Get terminal width for pretty formatting
const getTerminalWidth = () => {
  try {
    const { columns } = process.stdout;
    return columns || 80;
  } catch (e) {
    return 80;
  }
};

const terminalWidth = getTerminalWidth();
const resetColor = "\x1b[0m";
const boldText = "\x1b[1m";

// Print header
const printHeader = () => {
  const header = "====== CI CHECKS ======";
  const padding = Math.floor((terminalWidth - header.length) / 2);
  console.log(
    "\n" + " ".repeat(padding) + boldText + header + resetColor + "\n",
  );
};

// Track command status
const status = commands.reduce((acc, cmd) => {
  acc[cmd.name] = {
    status: "pending",
    startTime: 0,
    endTime: 0,
    turboCache: false,
  };
  return acc;
}, {});

// Print status of all commands
const printStatus = () => {
  console.clear();
  printHeader();

  const maxNameLength = Math.max(...commands.map((cmd) => cmd.name.length));

  commands.forEach((cmd) => {
    const { status: cmdStatus, startTime, endTime } = status[cmd.name];
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
      `${cmd.color}${cmd.name.padEnd(maxNameLength)}${resetColor} : ${statusColor}${statusText}${resetColor}`,
    );
  });

  console.log("\n");
};

// Run a single command with proper output handling
const runCommand = async (cmd) => {
  const { name, command, color } = cmd;

  // Update status to running
  status[name].status = "running";
  status[name].startTime = Date.now();
  printStatus();

  console.log(`${color}====== Running ${name} ======${resetColor}`);

  return new Promise((resolve) => {
    const process = spawn(command, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Handle stdout
    process.stdout.on("data", (data) => {
      const output = data.toString().trim();
      console.log(`${color}${output}${resetColor}`);

      // Check for Turbo cache hits
      if (output.includes("cache hit") || output.includes("FULL TURBO")) {
        status[name].turboCache = true;
      }
    });

    // Handle stderr
    process.stderr.on("data", (data) => {
      console.log(`\x1b[31m${data.toString().trim()}${resetColor}`);
    });

    process.on("close", (code) => {
      status[name].endTime = Date.now();
      status[name].status = code === 0 ? "success" : "failed";
      printStatus();

      if (code === 0) {
        console.log(`${color}✓ ${name} completed successfully${resetColor}\n`);
      } else {
        console.log(
          `\x1b[31m✗ ${name} failed with code ${code}${resetColor}\n`,
        );
      }

      resolve(code === 0);
    });
  });
};

// Run all commands
const runAll = async () => {
  printStatus();

  let allSuccess = true;

  for (const cmd of commands) {
    const success = await runCommand(cmd);
    if (!success) {
      allSuccess = false;
      // Don't break; continue running all commands to see all failures
    }
  }

  // Final summary
  console.log("\n");
  if (allSuccess) {
    console.log(
      `${boldText}\x1b[32m✓ All checks passed successfully!${resetColor}`,
    );
  } else {
    console.log(
      `${boldText}\x1b[31m✗ Some checks failed. Please fix the issues above.${resetColor}`,
    );
    process.exit(1);
  }
};

// Handle interruption
process.on("SIGINT", () => {
  console.log("\n\x1b[31mProcess interrupted by user${resetColor}");
  process.exit(1);
});

runAll();
