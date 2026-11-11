# Single source — one thing, one home

The duplication law for everything written down. It exists because a rule stated twice **rots twice**:
the second statement drifts from the first, and a reader can no longer tell which binds. Folders hold
an `INDEX.md` because a folder's file indexes it — the same idea at folder size: name things for what
they do, once.

## The rule

1. **One home per fact.** A word's meaning lives in the glossary of its side — [the platform's](../../architecture/glossary.md)
   or [the harness's](../../../harness/docs/glossary.md). What
   exists lives in [the architecture map](../../../harness/docs/architecture.md). A work rule of this cycle lives
   in one topic folder here; a rule of the code lives in [the conventions](../workspace.md#standing-documents).
   Where each standing fact lives is [workspace.md](../workspace.md)'s, and only its.
2. **Link, never restate.** Where another document needs the fact, it links and moves on — a pointer
   costs nothing to keep true; a paraphrase costs the whole document when the original changes. A
   summary is allowed **only** as the one-line entry in the index above the fact's file.
3. **Name a thing once.** A concept gets one canonical word; other teams' words die in the glossary's
   *Also seen as*. Two docs calling one concept two things is the same defect as two modules
   implementing one logic.
4. **Indexes route to folders.** A document's links point at the next folder's `INDEX.md` — never past
   it into that folder's files. The folder owns its interior: a file may rename, split, or merge there,
   and nothing above rots.
5. **An accepted ruling lands in its home the moment it is accepted.** A convention rule, a glossary row, an Agent Note, an
   architecture fact — the instant the user accepts it, it is written into its home, whatever step is open and
   whatever state the work is in: mid-grill, mid-settle, mid-build, before anything is committed. Never held in a
   conversation, a ledger row or a plan to land later, never batched to a build or a close — a ruling kept anywhere
   but its home can be lost, and that is not acceptable. The ledger row records where it landed; it is never the
   ruling's only copy.

The harness's documents are checked by its own gate (`pnpm run doc-sync`, inside `pnpm run check:all`). This
workspace's documents are checked by `scripts/check-docs.sh`, in the platform gate: every relative link resolves
(a link into `harness/`, another repository, excepted), every rule citation exists, and no platform glossary
*Never say* word is used.

## Applying it

- Writing a new doc: find the one home the fact already has — if it exists, link.
- Reviewing a diff: a sentence that restates an architecture/glossary fact is a defect to fix in the
  same change (remove, link).
- Moving a doc: fix only the pointers that crossed a folder wall **into** your folder's files —
  because of rule 4, almost none will exist.
