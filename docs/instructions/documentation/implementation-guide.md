# Implementation guide — the fixed anatomy

`implementation.md` is read **before** a line is written, so it reads *target-first*: what will exist, where,
containing what. Its parts come in this order, and the reviewer sees the end state before the build starts. One
home per fact ([single-source.md](./single-source.md)) — a rule, a table or a name that already lives in
[the standing documents](../workspace.md#standing-documents) is linked, never restated.

## The parts

1. **Per-root overview** — one `Piece | What it is` table per app or root; the heading names the root, its rows
   are `./`-relative, and each states what that part *is* when the work is done.
2. **Flows** — a Mermaid diagram for the runtime behaviour involved ([format.md](./format.md)).
3. **Contract tables** — endpoints, events and schemas; a deferred item is marked inline (`×`) so a scope cut is
   visible in the contract itself.
4. **Data shapes** — only new or changed shapes, grouped by kind: **Database tables**, **Worker envelopes**,
   **Communication to Harness**, **DTOs**, **OpenSearch indexes/pipelines**, **Local files**, **Session events**,
   or another relevant kind. Omit unchanged entries and empty groups; link reused definitions at their use.
   Identify each shape in its heading: database/table, index, file/domain or event name; for a worker use
   **Worker `<path to worker>` envelope — `<task>` input/result**. For communication to Harness, name its
   consumer in one short line. DTO names already identify their role. Do not add ownership/producer/consumer
   tables above field tables or repeat route/flow details here.
   Show the **full shape, not a summary**: one field table per new or changed shape (one field per line, its
   TypeScript type, optional or required, its default), plus transitions of any status field. A shape the work
   adds is marked **(new)** after its name, one it alters **(changed)**; under a changed shape's table, list each
   change — one line per field, what it was and what it becomes. A changed Session event names its compatibility posture against the
   harness's session-format rules ([persistence catalog](../../../harness/docs/persistence-catalog.md)).
5. **File touch-lists per root** — `path | files | what`, one table per root —
   [format.md](./format.md)'s path rules.
6. **Key logic code snippets** — show the nontrivial logic as syntactically valid code in the project's language,
   inside language-tagged fences. Include typed inputs/outputs, actual calculations, branches and failure handling.
   Every helper must be defined in the guide or linked to existing code. Pseudocode, prose instructions, TODOs and
   placeholders do not satisfy this requirement. Explanations belong outside the code fence. Omit snippets for
   routine wiring.
7. **Verification plan** — the ordered checks that prove the done-whens.
8. **Proposals** — only a choice that matters and that no ledger row rules: a real trade between valid options in
   behaviour, cost, scope, or a change reaching beyond the task. What was chosen, the options not taken, the trade.
   Not a proposal: a choice a convention, the code's existing pattern or a ruling already settles, and the plain
   mechanics of a ruled design — paths, request and response shapes, names. Those live in the body (parts 1–6) and
   are approved as the plan's surface, never put to the user as a pick. Reviewed like any other part; presented to
   the user at the end of a planning cycle, never mid-loop. The user's ruling lands in `grill.md` and the entry
   leaves the section.
9. **Alternatives** — where a disposition would reverse an earlier one, or two reviews pull opposite ways: the
   options side by side with their trades, and the one the plan's body currently carries. The choice stays open
   until the user makes it at the cycle's end, with the proposals; reviewers may add options or enrich them, but
   no one picks during the loop. The ruling lands in `grill.md`; a rejected option is not raised again.

`task.md` carries the same two sections, last, for choices at the level of intent and scope; `implementation.md`
for design. Both are omitted when empty.

## Why it is fixed

The anatomy keeps two reviews possible: the reviewer reads intent and end state before the build, and the
builder inherits an exact checklist. A part that is missing is a gap in the guide, not a matter of style.
