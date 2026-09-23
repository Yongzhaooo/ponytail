---
name: ponytail-review
description: >
  Review a diff for unnecessary complexity and missed reuse. Recommend simplifications
  supported by evidence and preserving required behavior. Use for over-engineering
  or patch-simplification requests; this is not overall merge approval.
---

Review diffs for unnecessary complexity. Reduce total caller and maintainer burden
while preserving requirements, safety, compatibility, and meaningful tests. Read-only.

## Inspect

Read affected implementations and callers. Compare an existing helper, standard-library
or platform replacement against relevant semantics, errors, ownership, execution context,
and performance. Use focused history when a seemingly redundant mechanism has unclear intent.

One implementation, caller, or wrapper is a lead, not proof of waste. Keep useful lifetime
rules, invariants, test seams, and supported public-interface evolution. Removing a layer
helps when complexity disappears, not when it spreads among callers. Speculative future
features alone do not justify flexibility; line count alone does not justify removal.

## Findings

Give location, unnecessary mechanism, supporting caller/contract evidence, maintenance
cost, and smallest credible replacement. Rank by consequence and confidence. Mark any
unverified assumption on which removal depends; explain retained complexity when contested.

Optional tags: `delete` (unneeded behavior), `stdlib` (equivalent library facility),
`native` (platform reuse), `yagni` (unjustified variation), `shrink` (lower cognitive burden).

If none are supported, say "No actionable complexity findings." Do not require deletion
totals or imply merge approval. Note incidental concrete defects separately; a full
correctness/security/performance audit is outside this focused review.
"stop ponytail-review" or "normal mode" ends this focused review mode.
