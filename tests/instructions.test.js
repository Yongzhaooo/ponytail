const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { getPonytailInstructions, getFallbackInstructions } = require('../hooks/ponytail-instructions');

test('all intensities use the same scoped body in normal and fallback paths', () => {
  for (const mode of ['lite', 'full', 'ultra']) {
    const text = getPonytailInstructions(mode);
    assert.equal(text, getFallbackInstructions(mode));
    assert.match(text, /implementation choice/);
    assert.match(text, /meets the complete requirements/);
    assert.match(text, /reassess applicability/);
    assert.match(text, /Q&A, translation, prose/);
    assert.match(text, new RegExp('\\| \\*\\*' + mode + '\\*\\* \\|'));
    for (const other of ['lite', 'full', 'ultra'].filter(m => m !== mode)) {
      assert.ok(!text.includes('| **' + other + '** |'));
    }
    assert.doesNotMatch(text, /ACTIVE EVERY RESPONSE|grep every caller|Use on ANY coding/i);
  }
  assert.equal(getPonytailInstructions('off'), '');
  assert.equal(getFallbackInstructions('off'), '');
});

test('missing skill and missing compact rules use a safe emergency fallback', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ponytail-fallback-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.mkdirSync(path.join(dir, 'hooks'));
  for (const file of ['ponytail-instructions.js', 'ponytail-config.js']) {
    fs.copyFileSync(path.join(__dirname, '..', 'hooks', file), path.join(dir, 'hooks', file));
  }
  const isolated = require(path.join(dir, 'hooks', 'ponytail-instructions.js'));
  const text = isolated.getPonytailInstructions('ultra');
  assert.match(text, /level: ultra/);
  assert.match(text, /do not start a coding workflow/);
  assert.match(text, /Meet the complete requirements/);
  assert.match(text, /interface changes/);
  assert.equal(isolated.getPonytailInstructions('off'), '');
});

test('Antigravity preserves PreInvocation protocol, switches and persists off across invocations', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ponytail-antigravity-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  function invoke(prompt) {
    const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'hooks', 'ponytail-antigravity.js')], {
      input: JSON.stringify({ prompt }), encoding: 'utf8', timeout: 4000,
      env: { ...process.env, ANTIGRAVITY_CONFIG_DIR: dir, PONYTAIL_DEFAULT_MODE: 'full' },
    });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout).injectSteps;
  }
  assert.match(invoke('Fix the local bug')[0].ephemeralMessage, /level: full/);
  assert.match(invoke('/ponytail ultra')[0].ephemeralMessage, /level: ultra/);
  assert.deepEqual(invoke('/ponytail off'), []);
  assert.deepEqual(invoke('Translate this sentence'), []);
  assert.match(invoke('/ponytail lite')[0].ephemeralMessage, /level: lite/);
  assert.deepEqual(invoke('normal mode'), []);
  assert.deepEqual(invoke('A later task'), []);
});

test('resume and compaction preserve selected mode and off; startup uses the default', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ponytail-resume-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const state = path.join(dir, '.ponytail-active');
  const env = { ...process.env, PLUGIN_DATA: dir, PONYTAIL_DEFAULT_MODE: 'full', COPILOT_PLUGIN_DATA: '', CLAUDE_PLUGIN_ROOT: '' };
  function start(source) {
    const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'hooks', 'ponytail-activate.js')], {
      input: JSON.stringify({ source }), encoding: 'utf8', timeout: 3000, env,
    });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  }
  fs.writeFileSync(state, 'ultra');
  for (const source of ['resume', 'compact']) {
    assert.equal(start(source).systemMessage, 'PONYTAIL:ULTRA');
    assert.equal(fs.readFileSync(state, 'utf8'), 'ultra');
  }
  fs.unlinkSync(state);
  for (const source of ['resume', 'compact']) {
    const output = start(source);
    assert.equal(output.systemMessage, 'PONYTAIL:OFF');
    assert.equal(output.hookSpecificOutput, undefined);
    assert.equal(fs.existsSync(state), false);
  }
  assert.equal(start('startup').systemMessage, 'PONYTAIL:FULL');
});
