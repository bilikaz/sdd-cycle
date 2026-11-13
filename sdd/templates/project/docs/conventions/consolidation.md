# Consolidation: essential vs. incidental duplication

**Rule.** Extract shared code only when at least one of these holds; otherwise leave
the copies with their owners.

1. **Essential duplication** — the copies must stay in sync *for correctness*;
   divergence is a bug, not an evolution. (A scope-join format every log sink must
   produce identically; a predicate three call sites must agree on or a verdict goes
   wrong; a prompt envelope two pipeline stages must emit identically.)
2. **Universal sharing** — all (or all-but-justified-exceptions) of the sites share
   it, and the shared concept is stable.

Do **not** extract *incidental* duplication — code that looks alike today because
both instances are currently simple, with no requirement to stay alike. Two REST
wrappers that differ only in an auth header owe each other nothing: pagination,
rate limits, and auth refresh will diverge per service.

## The failure mode this prevents

A shared helper extracted from a minority of sites (the "2 of 8" case) has two
futures once one consumer's needs change: it grows option flags for every variant,
or the consumer forks away and orphans a "shared" module with a single user. Both
outcomes are worse than the duplicated lines were.

## How to apply

- Before extracting, ask: *must* these stay identical, or do they merely *happen* to
  be identical? Only the first justifies coupling.
- Tolerated duplication gets a comment at the site marking it deliberate (and
  pointing at this rule), so a future cleanup pass doesn't re-couple it.
- Revisit when a third consumer appears with the same needs (rule of three) — and
  then re-check criterion 1, not just the count.
- The same logic governs types: shared-by-many promotes, used-by-one stays local.

## Copy-paste is not a reuse strategy

**Rule.** When a new consumer needs a sequence an existing implementation already
owns — a *trunk*: the ordered steps that must evolve together (resolve → derive →
adapt → call; validate → transform → persist) — extract the trunk **in the same
change that adds the second consumer**, and build the new consumer on it. Never
copy the body and adjust.

Provenance decides: code that *began as a copy* is essential duplication (criterion 1)
**by construction** — you copied it precisely because the behavior must match.
The "incidental look-alikes stay duplicated" rule above is for independently written
code that merely converged; it is never a license to paste.

Why: a pasted trunk starts drifting at the first unrelated commit — a capability,
a fix, a new parameter lands in one copy and silently not the other. Drift compounds
step to step; nothing forces the copies back together, so nothing stops the spread.
By the time review notices, reunification is a project of its own. The one cheap
moment to extract is when the second consumer is born: both call sites are known and
still identical.

How to apply:

- Adding consumer #2 of a nontrivial sequence: the extraction is *part of* that
  change, not a follow-up. A "TODO: unify later" comment on a pasted body is the
  failure, not a mitigation.
- Consumer-shaped work stays with the consumers — argument validation, input
  assembly, naming, output/result text. Only the must-stay-identical steps move
  into the trunk. (A trunk that absorbs its consumers' schemas has overshot —
  that's the option-flags failure from above.)
- Review tripwire: a diff that pastes a contiguous body from another module is
  treated as a missing extraction, and the burden of proof is on keeping the copy.

## Wire and display render from one function

**Rule.** Anything shown to the user as "what the system does" — a prompt banner, a permissions
view, a status badge — renders from the SAME function the system executes, never from a parallel
reconstruction with its own inputs.

Why: two compositions of one truth drift silently, and the display copy always loses — a system
banner that rebuilt "base prompt" while the engine appended capability blocks under-reported for
weeks and hid a real bug (prose the user couldn't see caused fabricated tool calls). With one
composer, a new block shows up in both places or neither; the drift is structurally impossible.

How to apply:
- Extract the composition (not just its ingredients) into the shared module; wire and display both
  call it. A display that needs a variant passes a flag to the one function rather than forking it.
- When display must show a PAST execution exactly, capture the executed value at the call site and
  render the capture; recompose only as the explicit "what it would be now" fallback.

## Extend the method that exists

**Rule.** Where a method or a function already does a thing, a variant of it is that method **extended** — a
parameter, an option on its params, a richer answer — never a sibling beside it (`createUser` answers the
new-account link's token when it is called without a password; there is no `createInvitedUser`). Before adding a
method, look for the one that already does the core of it.

Why: siblings multiply — `create`, `createInvited`, `createForX`, `createWithoutY` — each a copy of the same steps that
drifts on its own, and a reader no longer knows which one is the real one. A method extended by its params keeps one
trunk (the rule above) and one name.

How to apply: a new caller that needs the existing method to do a little more adds the parameter or the answer field
to it; a genuinely different operation — a different trunk, not a variant — is a method of its own, its name saying
the difference.

## Captured executions

**A past execution is captured, not recomposed.** Where a display must show exactly what ran, the value is
   captured at the call site and the capture is rendered; recomposing is only the explicit "what it would be
   now" view.
