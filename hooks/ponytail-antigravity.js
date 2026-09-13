#!/usr/bin/env node
// Personal Antigravity PreInvocation adapter. Preserve the installed
// injectSteps/ephemeralMessage protocol; reuse Ponytail's mode tracker and body.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { getDefaultMode, normalizePersistedMode } = require('./ponytail-config');
const { getPonytailInstructions } = require('./ponytail-instructions');

const configDir = process.env.ANTIGRAVITY_CONFIG_DIR || path.join(os.homedir(), '.gemini', 'config');
const statePath = path.join(configDir, '.ponytail-active');

function run(input) {
  fs.mkdirSync(configDir, { recursive: true });
  if (!fs.existsSync(statePath)) fs.writeFileSync(statePath, getDefaultMode(), 'utf8');
  // This is the existing explicit mode-command parser, not a task classifier.
  const result = spawnSync(process.execPath, [path.join(__dirname, 'ponytail-mode-tracker.js')], {
    input: input || '{}', encoding: 'utf8', timeout: 2000,
    env: { ...process.env, CLAUDE_CONFIG_DIR: configDir,
      PLUGIN_DATA: '', COPILOT_PLUGIN_DATA: '', CLAUDE_PLUGIN_ROOT: '', QODER_SESSION_ID: '' },
  });
  // The shared tracker removes its session flag when switched off. Persist off
  // here because this host has PreInvocation only, with no SessionStart reset.
  if (result.stdout && result.stdout.includes('PONYTAIL MODE OFF')) {
    fs.writeFileSync(statePath, 'off', 'utf8');
  }
  let mode = getDefaultMode();
  try { mode = normalizePersistedMode(fs.readFileSync(statePath, 'utf8').trim()) || mode; } catch (_) {}
  const message = getPonytailInstructions(mode);
  process.stdout.write(JSON.stringify({ injectSteps: message ? [{ ephemeralMessage: message }] : [] }));
}

let input = '';
let done = false;
function finish() {
  if (done) return;
  done = true;
  try { run(input); } catch (_) { process.stdout.write(JSON.stringify({ injectSteps: [] })); }
}
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', finish);
process.stdin.on('error', () => { finish(); process.exit(0); });
setTimeout(() => { finish(); process.exit(0); }, 1000).unref();
