# No dead or superseded code — remove it, don't nurse it

**Rule.** When a change makes something obsolete — a superseded path, a fallback no longer reachable, a
second way to do one thing, an export with no importer — **remove it in the same change**, across every
place it reaches. Never leave it "just in case." Two ways to do one thing is a defect; the codebase must
stay **clean and easily understandable**.

Two failure modes are easily confused: coupling code that merely *looks* alike (premature
consolidation) and nursing code that is genuinely superseded (lingering rot). This rule is about the
second — delete what the change made obsolete.

## Rules

1. **Remove across the whole reach, not just the call site.** Deleting a feature means deleting its
   callers, its tests, its seed/fixtures, its config keys, its docs, and any now-orphaned helper — in one
   change. A half-migration (new path in, old path still wired) is worse than either path alone.
2. **Hard-alert what you spot.** When you notice something worth removing, say so **loudly** and remove it
   (or get an explicit go if it's a judgment call with blast radius). Silently keeping problematic code
   alive is the anti-pattern — surface it, don't bury it.
3. **A dead export is dead code.** An exported symbol with no importer, a config key nothing reads, a table
   column nothing writes — all count. Chase the reach: if removing X orphans Y, remove Y too.
4. **No "just in case" / commented-out code.** Git history is the safety net. The removing commit is the
   record; the working tree carries only live code.
5. **If removal is genuinely a decision (real blast radius, a maybe-future consumer), escalate — don't
   default to keep.** Flag the full extent and the options; keeping is a choice that must be justified, not
   the fallback.

## Why

Every superseded path a reader meets is a tax: they must learn it, then learn it doesn't matter. Fallbacks
"kept for safety" mask the real path and rot silently (nothing tests them). "Two ways to do one thing"
guarantees the two drift and a caller picks the wrong one. Deleting in the same change keeps the diff honest
— the reviewer sees the migration complete, not a maze of old-and-new. The bias is toward removal because
the cost of dead code is paid continuously by every future reader, while the cost of "we deleted something
we later want" is paid once, cheaply, from git history.

## How to apply

- After a change that supersedes a path, grep for the old thing across **code + tests + seed + docs** and
  drive it to zero. A leftover reference is a finding.
- When a decision (e.g. "keep model selection in config vs move it to the registry") removes a concept,
  remove *all* of it — the tree, the guard input, the delete-guard, the endpoint, the dead package file —
  not just the headline use.
- Grep test: an exported symbol with no importer, a config path no code reads, or a `// TODO: old way`
  block is a finding — remove or justify in the same change.
