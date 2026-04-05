#!/usr/bin/env node
'use strict';

const { execSync, spawnSync } = require('child_process');

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return null;
  return process.argv[idx + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

const nameContains = getArgValue('--name-contains');
const terminalApp = getArgValue('--terminal') || process.env.RN_TERMINAL || 'Terminal';
const noPackager = hasFlag('--no-packager');

function loadDevices() {
  const raw = execSync('xcrun simctl list devices -j', { encoding: 'utf8' });
  const json = JSON.parse(raw);
  const all = Object.values(json.devices || {}).flat();
  return all.filter((d) => d.isAvailable !== false);
}

function pickDevice(devices) {
  if (nameContains) {
    const filtered = devices.filter((d) => d.name && d.name.includes(nameContains));
    if (filtered.length === 0) return null;
    const booted = filtered.find((d) => d.state === 'Booted');
    return booted || filtered[0];
  }

  const booted = devices.find((d) => d.state === 'Booted');
  return booted || devices[0] || null;
}

function main() {
  const devices = loadDevices();
  const device = pickDevice(devices);

  if (!device) {
    const hint = nameContains
      ? `No simulator device found matching "${nameContains}".`
      : 'No simulator devices found.';
    console.error(hint);
    process.exit(1);
  }

  if (device.state !== 'Booted') {
    console.error(
      `Using simulator "${device.name}" (${device.udid}) in state "${device.state}".`
    );
  } else {
    console.error(`Using booted simulator "${device.name}" (${device.udid}).`);
  }

  const result = spawnSync(
    './node_modules/.bin/react-native',
    [
      'run-ios',
      '--udid',
      device.udid,
      '--terminal',
      terminalApp,
      ...(noPackager ? ['--no-packager'] : []),
    ],
    { stdio: 'inherit' }
  );

  process.exit(result.status ?? 1);
}

main();
