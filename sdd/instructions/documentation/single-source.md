# Single source — one thing, one home

The duplication law for everything written down. It exists because a rule stated twice **rots twice**:
the second statement drifts from the first, and a reader can no longer tell which binds. Folders hold
an `INDEX.md` because a folder's file indexes it — the same idea at folder size: name things for what
they do, once.

## The rule

1. **One home per fact.** A word's meaning lives in its project's glossary; what exists lives in its
   architecture map. A work rule of this cycle lives in one topic folder here; a code rule lives in the
   owning project's conventions. [workspace.md](../../workspace.md#standing-documents) names the available
   standing-document homes. A new project adds these homes as approved facts need them; absent documents
   are not invented prerequisites for grilling.
2. **Link, never restate.** Where another document needs the fact, it links and moves on — a pointer
   costs nothing to keep true; a paraphrase costs the whole document when the original changes. A
   summary is allowed **only** as the one-line entry in the index above the fact's file.
   A skill may repeat a critical boundary that an agent must see before reading its instructions, with a
   link to the owning rule. Keep the detail in that one home; instruction files point rather than repeat.
3. **Name a thing once.** A concept gets one canonical word; other teams' words die in the glossary's
   *Also seen as*. Two docs calling one concept two things is the same defect as two modules
   implementing one logic.
4. **Indexes route to folders.** A document's links point at the next folder's `INDEX.md` — never past
   it into that folder's files. The folder owns its interior: a file may rename, split, or merge there,
   and nothing above rots.
5. **An accepted ruling lands in its available home immediately.** Write an approved term, convention,
   decision record or architecture fact into the project's designated document, whatever step is open.
   During an initial grill with no designated home, keep the answer and intended destination in `grill.md`;
   planning establishes the needed home in `workspace.md` and lands the approved content there. Do not invent
   standing documents merely to run the interview. The ledger records the destination and links to it once
   it exists; an available home is never deferred to a later build or close.

Use the owning project's configured document checks from [workspace.md](../../workspace.md#verification-gates).
Check changed relative links, rule citations and canonical terms; do not claim an unconfigured checker ran.

## Applying it

- Writing a new doc: find the one home the fact already has — if it exists, link.
- Reviewing a diff: a sentence that restates an architecture/glossary fact is a defect to fix in the
  same change (remove, link).
- Moving a doc: fix only the pointers that crossed a folder wall **into** your folder's files —
  because of rule 4, almost none will exist.
