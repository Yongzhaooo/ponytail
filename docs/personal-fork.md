# Personal Ponytail fork

Source: https://github.com/Yongzhaooo/ponytail (branch `personal/v5`)

Upstream: https://github.com/DietrichGebert/ponytail

Baseline: upstream `2961b52` (v5.2.0). Personal version: `5.2.0+personal.<date>`.
The MIT license and upstream author attribution are retained. The previous
4.9.0-based branch `codex/conditional-simplification` is kept for history.

The fork owns behavior. MyAgents owns the immutable revision, installation
relationships and local deployment record.

## Kept from upstream v5

Rebuilt rules, review and audit; numbered findings; per-project live mode;
compaction keeps the level; mode switches deliver the ruleset on Codex and
Cursor; statusline copy that survives plugin updates; the SessionStart
codebase map (`PONYTAIL_MAP=0` disables it); hook, OpenCode and uninstall fixes.

## Personal changes

- Rules govern code changes; ordinary questions, prose and translation do not
  start a coding workflow. The skill description says the same.
- Simplicity limits the diff, not the understanding: cross-module, multi-stage,
  interface, data-model or deployment work knows the intended end state first and
  keeps each change on its path. `scripts/check-rule-copies.js` pins this rule.
- Existing structure stays unless the task or its agreed design changes it; a clear
  approach is built without an unrequested alternatives report or audit.
- Review and audit treat a layer or single-implementation interface as a lead,
  not proof; keep it when it holds lifetime rules, invariants, a test seam or a
  supported public interface.
- Resume keeps the live level or off, like compaction.
- `hooks/ponytail-antigravity.js` adapts Antigravity's PreInvocation
  `injectSteps[].ephemeralMessage` protocol, reuses the mode tracker, stores mode
  in `~/.gemini/config/.ponytail-active` (or `ANTIGRAVITY_CONFIG_DIR`) and injects
  nothing while off.
- `.agents/plugins/marketplace.json` uses the local snapshot, so a pinned Git or
  directory marketplace installs that snapshot instead of upstream `main`.
- Version checks and tests accept `+build` metadata.

## Updating

Rebase or merge upstream into `personal/v5`, propagate shared body edits across
the rule copies and the fallback in `hooks/ponytail-instructions.js`, regenerate
OpenClaw skills, run the checks below, then update the immutable MyAgents pin.
Do not enable floating updates or replace the fork with the upstream package.

Verification: `node scripts/check-rule-copies.js`, `node scripts/check-versions.js`,
`node --test tests/`. The pandas one-liner correctness case needs Python with pandas.
