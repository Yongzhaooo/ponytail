#!/usr/bin/env node
// Shared Ponytail instruction builder for Claude hooks and Pi extension.

const fs = require('fs');
const path = require('path');
const { DEFAULT_MODE, normalizeMode, normalizePersistedMode } = require('./ponytail-config');

const INDEPENDENT_MODES = new Set(['review']);
const SKILL_PATH = path.join(__dirname, '..', 'skills', 'ponytail', 'SKILL.md');

function filterSkillBodyForMode(body, mode) {
  const effectiveMode = normalizeMode(mode) || DEFAULT_MODE;
  const withoutFrontmatter = String(body || '').replace(/^---[\s\S]*?---\s*/, '');

  // Only the intensity table rows and worked examples are mode-specific, and
  // both are keyed by a mode name (lite/full/ultra). A bullet whose label is
  // not a mode — e.g. "No unrequested abstractions: ..." — is a normal rule
  // and must be kept verbatim.
  return withoutFrontmatter
    .split(/\r?\n/)
    .filter((line) => {
      const tableLabel = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|/);
      if (tableLabel) {
        const labelMode = normalizeMode(tableLabel[1].trim());
        if (labelMode) return labelMode === effectiveMode;
      }

      // Require a quoted value: every worked example is `- lite: "..."`. Without
      // this, an ordinary rule bullet that happens to start with a mode word
      // (e.g. "- Full: ...") is silently dropped in every other mode — it looks
      // like a worked example but is really prose meant to survive verbatim.
      const exampleLabel = line.match(/^-\s*([^:]+):\s*"/);
      if (exampleLabel) {
        const labelMode = normalizeMode(exampleLabel[1].trim());
        if (labelMode) return labelMode === effectiveMode;
      }

      return true;
    })
    .join('\n');
}

function getFallbackInstructions(mode) {
  if (mode === 'off') return '';
  // AGENTS.md ships in every full plugin/package and mirrors the skill body.
  let body;
  try {
    body = fs.readFileSync(path.join(__dirname, '..', 'AGENTS.md'), 'utf8');
  } catch (e) {
    // Last resort for an incomplete install: keep the same conditional scope.
    body = 'Apply simplification only to implementation choices in the current coding task, ' +
      'before adding dependencies, abstractions, configuration, compatibility layers or extra process, ' +
      'or when the user asks to simplify code. Ordinary Q&A, translation, prose and discussion of this skill ' +
      'do not start a coding workflow. Reassess applicability when the task changes. ' +
      'Reuse existing code, stdlib and platform features. Meet the complete requirements; ' +
      'line count alone does not decide. Execute a clear approach directly; no automatic alternatives report, ' +
      'whole-repo scan or audit. Read the affected code; trace related callers only for shared behavior or interface changes. ' +
      'Preserve explicit features, trust-boundary validation, data-loss handling, security and accessibility. ' +
      'Respect lite (suggest material alternatives), full (simplest complete solution), ultra (question speculative work). ' +
      'Respect /ponytail off, stop ponytail and normal mode; resume with an explicit level.';
  }
  return 'PONYTAIL MODE ACTIVE — level: ' + mode + '\n\n' + filterSkillBodyForMode(body, mode);
}

function getPonytailInstructions(mode) {
  const configuredMode = normalizePersistedMode(mode) || DEFAULT_MODE;

  if (configuredMode === 'off') return '';

  if (INDEPENDENT_MODES.has(configuredMode)) {
    return 'PONYTAIL MODE ACTIVE — level: ' + configuredMode + '. Behavior defined by /ponytail-' + configuredMode + ' skill.';
  }

  const effectiveMode = normalizeMode(configuredMode) || DEFAULT_MODE;

  try {
    return 'PONYTAIL MODE ACTIVE — level: ' + effectiveMode + '\n\n' +
      filterSkillBodyForMode(fs.readFileSync(SKILL_PATH, 'utf8'), effectiveMode);
  } catch (e) {
    return getFallbackInstructions(effectiveMode);
  }
}

module.exports = {
  filterSkillBodyForMode,
  getFallbackInstructions,
  getPonytailInstructions,
};
