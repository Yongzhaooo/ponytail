# Personal Ponytail fork

Source: https://github.com/Yongzhaooo/ponytail

Upstream: https://github.com/DietrichGebert/ponytail

Baseline: `356918eba965ee1eac64bd3a7f0dd02108350de5` (upstream main,
plugin version 4.9.0, verified 2026-09-13). Personal version:
`4.9.0+personal.1`. The MIT license and upstream author attribution are retained.

The fork owns behavior. MyAgents owns the immutable revision, installation
relationships and local deployment record. Former MyAgents skill copies are
archived reference material and must not be installed alongside the full plugin.

The short body in `skills/ponytail/SKILL.md` is shared with `AGENTS.md` and the
existing host rule copies. `scripts/check-rule-copies.js` checks full equality.
The shared hook builder reads that skill, falls back to `AGENTS.md`, then uses
scoped emergency instructions if both are unavailable. Commands and the help
card follow the same conditions. Existing lifecycle events, protocol envelopes,
explicit levels and off controls remain; no task classifier or model call is
added. A mode switch now supplies its selected body as well as the status message.

The personal Antigravity adapter is `hooks/ponytail-antigravity.js`. It preserves
the previously configured PreInvocation `injectSteps[].ephemeralMessage` output
and delegates explicit mode commands to the existing tracker. It stores mode in
`~/.gemini/config/.ponytail-active` (or `ANTIGRAVITY_CONFIG_DIR`). Off persists
between invocations; an explicit level resumes. This host's mode is global, as
there is no observed session lifecycle protocol to provide per-session state.
The adapter accepts the existing tracker's `prompt` input field. Actual host
delivery of that field and subtask delivery require host verification.

To merge upstream, update the feature branch in this fork, propagate any shared
body edits across its existing copies, regenerate OpenClaw skills, run existing
tests and package checks, then update the immutable MyAgents pin. Do not enable
floating updates or replace an installed fork with the upstream npm package.

Verification: `node scripts/check-rule-copies.js`,
`node scripts/check-versions.js`, `npm test`, and `npm pack --dry-run`.
Node 24 (already bundled by the local host) expands the upstream test globs on
Windows; Node 20 through npm/cmd does not. Use an existing Python with pandas
for the upstream correctness benchmark test. No npm package is published.
