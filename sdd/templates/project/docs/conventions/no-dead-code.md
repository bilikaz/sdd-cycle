# No dead code

**Rule.** When a change makes something obsolete — a superseded path, a fallback no longer reachable, a second
way to do one thing, an export with no importer — remove it in the same change, across every place it reaches.
Never keep it "just in case". Two ways to do one thing is a defect. This is the counterpart of
[consolidation](consolidation.md): that rule says do not couple code that merely looks alike; this one says do
delete code that is genuinely superseded.

## Rules

1. **Remove across the whole reach, not just the call site.** Deleting a feature deletes its callers, tests,
   fixtures and seed data, config keys, docs and every helper it orphans — in one change. A half-migration (new
   path in, old path still wired) is worse than either path alone.
2. **Say it loudly.** Something you notice that should go is named and removed — or, when removal has real blast
   radius, raised for an explicit decision. Silently keeping problematic code alive is the anti-pattern.
3. **A dead export is dead code.** An exported symbol with no importer, a config key nothing reads, a column
   nothing writes — all count. Chase the reach: if removing X orphans Y, remove Y too.
4. **No "just in case" and no commented-out code.** Version control is the safety net; the removing commit is the
   record, and the working tree carries only live code.
5. **A genuine judgment call is escalated, not defaulted to keep.** Where removal has real blast radius or a
   concrete future consumer, flag the full extent and the options. Keeping is a choice that must be justified,
   never the fallback.

## Why

Every superseded path a reader meets is a tax: they learn it, then learn it does not matter. A fallback "kept for
safety" masks the real path and rots untested. Two ways to do one thing guarantee the two drift and a caller
picks the wrong one. Deleting in the same change keeps the diff honest — the reviewer sees the migration
complete. The bias is toward removal because dead code is paid for by every future reader, while restoring
something deleted is paid once, cheaply, from history.

## How to apply

- After a change that supersedes a path, search for the old thing across code, tests, fixtures and docs and drive
  it to zero. A leftover reference is a finding.
- When a decision removes a concept, remove all of it — its data, its guards, its endpoint, its config — not just
  the headline use.
- Unused locals and parameters are refused by the compiler (`noUnusedLocals`, `noUnusedParameters`) or by
  `@typescript-eslint/no-unused-vars`; unreachable statements by `no-unreachable`. Unused files, exports, types
  and dependencies (rule 3) are failed by a dead-code scanner such as knip where the project wires one, with the
  entries it loads by path named in its config. A dead class member, or an export re-exported through a
  package entry point, reads as used to such a scanner; that check stays with review.

```ts
// not: the superseded path kept beside the new one
export async function loadSettings(): Promise<Settings> {
  return settingsRepo.load();
  // const raw = await readFile(LEGACY_SETTINGS_PATH, "utf8"); // old way, keep for now
}
```
