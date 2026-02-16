#!/usr/bin/env node

import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";

const BUNDLE_ID = process.env.IOS_BUNDLE_ID || "com.lovelybridge_fe";
const WATCH_PATHS = ["App.tsx", "index.js", "Component"];
const DEBOUNCE_MS = 700;
const SCAN_INTERVAL_MS = 900;
const WATCH_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".json"]);

let debounceTimer = null;
let isRelaunching = false;
let relaunchQueued = false;
const fileMtimes = new Map();

function run(command, args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", rejectPromise);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      rejectPromise(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function runCapture(command, args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", rejectPromise);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise({ stdout, stderr });
        return;
      }
      rejectPromise(new Error(`${command} ${args.join(" ")} exited with code ${code}\n${stderr}`));
    });
  });
}

async function getBootedUdid() {
  const { stdout } = await runCapture("xcrun", ["simctl", "list", "devices", "booted", "-j"]);
  const parsed = JSON.parse(stdout);
  const runtimes = Object.values(parsed.devices || {});

  for (const runtimeDevices of runtimes) {
    for (const device of runtimeDevices) {
      if (device?.state === "Booted" && device?.isAvailable) {
        return device.udid;
      }
    }
  }
  return null;
}

async function getFirstAvailableUdid() {
  const { stdout } = await runCapture("xcrun", ["simctl", "list", "devices", "available", "-j"]);
  const parsed = JSON.parse(stdout);
  const runtimes = Object.values(parsed.devices || {});
  const candidates = [];

  for (const runtimeDevices of runtimes) {
    for (const device of runtimeDevices) {
      if (device?.isAvailable && device?.udid) {
        candidates.push(device);
      }
    }
  }

  const iphone = candidates.find((d) => String(d.name || "").includes("iPhone"));
  return iphone?.udid || candidates[0]?.udid || null;
}

async function ensureSimulatorReady() {
  await run("open", ["-a", "Simulator"]);

  let udid = await getBootedUdid();
  if (udid) {
    return udid;
  }

  udid = await getFirstAvailableUdid();
  if (!udid) {
    throw new Error("No available iOS simulator devices found");
  }

  await run("xcrun", ["simctl", "boot", udid]).catch(() => {});
  await run("xcrun", ["simctl", "bootstatus", udid, "-b"]);
  return udid;
}

async function relaunchApp() {
  if (isRelaunching) {
    relaunchQueued = true;
    return;
  }

  isRelaunching = true;
  console.log(`[ios-auto-relaunch] restarting ${BUNDLE_ID}...`);

  try {
    const udid = await ensureSimulatorReady();
    await run("xcrun", ["simctl", "terminate", udid, BUNDLE_ID]).catch(() => {});
    await run("xcrun", ["simctl", "launch", udid, BUNDLE_ID]);
    console.log("[ios-auto-relaunch] app relaunched");
  } catch (error) {
    console.error("[ios-auto-relaunch] relaunch failed:", error.message);
    console.error("[ios-auto-relaunch] run `npm run ios` once and verify an iOS simulator is booted.");
  } finally {
    isRelaunching = false;
    if (relaunchQueued) {
      relaunchQueued = false;
      relaunchApp();
    }
  }
}

function scheduleRelaunch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    relaunchApp();
  }, DEBOUNCE_MS);
}

function hasValidExtension(filePath) {
  return [...WATCH_EXTENSIONS].some((ext) => filePath.endsWith(ext));
}

function collectFiles(pathLike, out) {
  let stats;
  try {
    stats = statSync(pathLike);
  } catch {
    return;
  }

  if (stats.isFile()) {
    if (hasValidExtension(pathLike)) {
      out.push(pathLike);
    }
    return;
  }

  if (!stats.isDirectory()) {
    return;
  }

  const entries = readdirSync(pathLike, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }
    collectFiles(join(pathLike, entry.name), out);
  }
}

function scanAndDetectChanges() {
  const collected = [];
  for (const root of WATCH_PATHS) {
    const absoluteRoot = resolve(process.cwd(), root);
    if (existsSync(absoluteRoot)) {
      collectFiles(absoluteRoot, collected);
    }
  }

  let changed = false;
  const seen = new Set();

  for (const file of collected) {
    seen.add(file);
    let mtimeMs = 0;
    try {
      mtimeMs = statSync(file).mtimeMs;
    } catch {
      return;
    }

    const prev = fileMtimes.get(file);
    if (prev === undefined) {
      fileMtimes.set(file, mtimeMs);
      continue;
    }

    if (mtimeMs !== prev) {
      fileMtimes.set(file, mtimeMs);
      changed = true;
    }
  }

  for (const existing of fileMtimes.keys()) {
    if (!seen.has(existing)) {
      fileMtimes.delete(existing);
      changed = true;
    }
  }

  if (changed) {
    scheduleRelaunch();
  }
}

console.log(`[ios-auto-relaunch] target bundle id: ${BUNDLE_ID}`);
console.log(`[ios-auto-relaunch] scanning: ${WATCH_PATHS.join(", ")}`);
scanAndDetectChanges();
setInterval(scanAndDetectChanges, SCAN_INTERVAL_MS);

console.log("[ios-auto-relaunch] waiting for file changes...");
