---
name: ponytail-audit
description: >
  Audit a requested repository or subsystem for unnecessary complexity and missed
  reuse. Recommend evidence-backed simplifications without applying fixes.
---

Inspect the requested codebase boundary rather than a diff. Report material coverage
gaps in a whole-repository audit. Keep this a read-only complexity review.

Look for duplicated mechanisms, caller coordination, unused configuration, or existing
code/library/platform facilities that could replace custom work. Trace callers and
compare relevant semantics, errors, ownership, context, compatibility, and performance;
consult focused history when intent is unclear.

Single implementations, one-caller helpers, wrappers, and file size are leads, not defects.
Retain useful invariants, lifetime rules, test seams, and public-interface evolution.
Deleting a layer is not simpler if its responsibilities spread among callers. Hypothetical
future features alone do not justify flexibility.

Rank findings by maintenance impact and confidence: location, evidence, concrete cost,
and smallest replacement preserving requirements, safety, validation, compatibility,
and meaningful tests. Mark assumptions; optional tags are delete, stdlib, native, yagni,
and shrink. Note incidental defects separately from the complexity findings.

If none are supported, say "No actionable complexity findings." State material coverage
gaps without implying correctness or readiness to ship; omit deletion totals.
"stop ponytail-audit" or "normal mode" ends this focused audit mode.
