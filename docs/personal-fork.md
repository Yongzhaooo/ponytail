# Personal Ponytail fork

Source: https://github.com/Yongzhaooo/ponytail (branch `personal/v5`)

Upstream: https://github.com/DietrichGebert/ponytail

Baseline: upstream `2961b52` (v5.2.0). Personal version: `5.2.0+personal.20261021`.
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
- Diff size is a preference among solutions that preserve correctness, ownership
  and testability. An entry-point class does not own every new feature by default.
- A bounded extraction needed for the current task proceeds within agreed scope.
  Concrete state-lifetime, repeated-decision or verification problems can instead
  warrant a user decision when the refactor materially expands scope, changes a
  public contract, migrates state ownership or adds substantial regression work.
  Explain the smallest useful boundary, recommendation, added work, verification
  and consequence of deferring before dependent edits. Retain that decision unless
  new evidence changes the tradeoff. File length alone does not trigger a question.
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

## Selected upstream fixes

Reviewed upstream through `09c434ab73ca43761c5d8b0c5d341926c2fba710` on 2026-10-21.
Upstream's latest release is v5.3.2, but its core smallest-diff rule is unchanged
from v5.2.0. The fork backports these independent fixes without adopting the
Claude Band/Board feature or claiming a complete v5.3.2 baseline:

| Upstream commit | Included change |
| --- | --- |
| `e634469fda4952bbaa6784934fefbdd99dbda2a5` | Qoder retains the live rules on a default-mode command. |
| `4b7c7b9028a008c987dbd88ac8241b35e482cadc` | Hermes delivers the off transition to the model once. |
| `84740e3d344b69b4a133201fa519eb37a62a2b2a` | Debt/gain commands no longer imply a persistent mode to revert. |
| `1099dd9128da88e8470338679b6f2d266382482b` | Cursor documentation describes per-project mode state. |
| `37ad0f1338b36a24d77fc5125316cecf4c902150` | CI runs the existing benchmark scorer self-test. |
| `f7bfbb9aa5e84e72df17802f5dbec851311070b9` | Large Git file lists retain tracked-file filtering. |
| `629158d41d1f1e2a65c06abe0a3d58bf76ad2745` | Codex uses the small composer icon. |
| `5a5a605fb1292a93095e9b8fcd5a7866f2fcc637` | Claude/Codex hooks allow 15 seconds for slow Windows startup. |
| `5117d0ef09e9fc040093d8d54182d8e28d3201b9` | Optional mapping gets 3 seconds; Cursor/Copilot hooks get 15 seconds. |
| `09c434ab73ca43761c5d8b0c5d341926c2fba710` | Benchmark cleanup waits for the terminated server. |

## Structure decision delivery and checks

The rule lives in the shared skill, its hook fallback and the static rule copies.
Existing activation, resume, compaction, mode-switch and subagent paths deliver it;
there is no new tool-blocking hook, code-size threshold, task classifier or approval
database. The agent examines the affected code and asks at the relevant decision.
Off mode and ordinary prose requests keep their existing behavior.

The rule-copy check covers all three active levels and the fallback. Activation
tests also retain the rule when mapping fails, stalls or is disabled. Regression
cases exercise a map taking more than one second and a tracked-file list exceeding
Node's old default buffer without exposing ignored files in the map.

Two independent decision trials applied the old and new rules to the same five
supplied scenarios. The old rules proceeded without asking on both a material
panel-state refactor and a required public cancellation-interface migration. The
candidate asked about both, described verification and viable alternatives, and
continued directly on the three controls: a one-line bug fix in a large class, an
explicitly requested local extraction and an already deferred refactor. These are
decision trials, not implemented feature tests or evidence of long-term outcomes.

## Updating

Rebase or merge upstream into `personal/v5`, propagate shared body edits across
the rule copies and the fallback in `hooks/ponytail-instructions.js`, regenerate
OpenClaw skills, run the checks below, then update the immutable MyAgents pin.
Do not enable floating updates or replace the fork with the upstream package.

Verification: `node scripts/check-rule-copies.js`, `node scripts/check-versions.js`,
`node --test --test-concurrency=1 tests/*.test.js`,
`node --test pi-extension/test/*.test.js`,
`python benchmarks/agentic/run.py --selftest`, and `git diff HEAD --check`.
On Windows set `PYTHONUTF8=1` and `PYTHONIOENCODING=utf-8`; the CSV correctness
case needs an existing Python installation with pandas.

The 2026-10-21 local run covered all 174 root and Pi tests. Two shell-dependent
root checks initially skipped under the default Windows PATH and passed when
rerun with Git for Windows tools available. All 40 scorer self-checks passed,
as did rule-copy, version and whitespace checks. MyAgents' deployment record
tracks installed hosts and native loading evidence separately from these tests.
