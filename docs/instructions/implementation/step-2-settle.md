# sdd step 2 — Settling

Step 2 writes the task's two settled documents from the ledger: `task.md` is *what and why*,
`implementation.md` is *how*. It is re-entered whenever the task's settled shape changes, and it edits the two
documents in place.

The step entry point is [sdd-plan](../../../.agents/skills/sdd-plan/SKILL.md); its related coordinating role
is [sdd-planner](../../../.agents/skills/sdd-planner/SKILL.md) for an explicitly delegated drafting/review loop.

## `task.md` — the intent

Short: it is read to approve intent. Its anatomy, in order:

```md
# <Title>

**Goal.** <one sentence: the change and who it serves>
**Scope.** <what is touched, in canonical vocabulary>
**Decisions.** <G-n — the ruling in words, one per line>
**Done-whens.** <the ledger row's answer, verbatim, one per line, each with its G-n>
**Out of scope.** <what is deliberately not done, and where it went>
**Milestone.** <code or —> · **Delivers.** <ids or —>
**Proposals.** · **Alternatives.** <only when non-empty — see the implementation guide, parts 8 and 9>
```

- **sdd.step2.1.** A done-when quotes its ledger row verbatim — numbers, orderings and negatives as answered,
  never softened into prose. On a bug it quotes the cited source.
- **sdd.step2.2.** Every ledger row has a destination this document names, or one the ledger already named.

## `implementation.md` — the guide

Written against the confirmed `task.md`: what will be made, concretely enough to review before it is built. Its
anatomy is fixed by [the implementation-guide instruction](../documentation/implementation-guide.md), and its
diagrams and tables follow [format.md](../documentation/format.md). One home per fact: a rule, a table or a name
that already lives in one of [the standing documents](../workspace.md#standing-documents) is linked, never restated
([single-source.md](../documentation/single-source.md)).

- **sdd.step2.3.** `implementation.md` names every item `task.md` carries: each decision, done-when and
  out-of-scope line has its place — the file it lands in, the shape it takes, the check that proves it. An item
  not named is a gap, closed before the document is presented.
- **sdd.step2.4.** The settlement commit freezes both documents. While the task is built neither is edited: a
  change the user rules an evolution is an `evolution.md` row ([escalation.md](escalation.md)), and a change that
  moves the settled shape re-enters this step, which edits the two documents in place and commits them again
  (sdd.step2.7, `sdd.commit.1`).

## Disposing of a plan review

- **sdd.step2.10.** Every finding of the newest `plan-review<x>.md` ([step-plan-review.md](step-plan-review.md)) takes exactly one
  disposition before the documents are presented: **fixed** — `task.md` or `implementation.md` edited in place, one
  right answer inside the ledger · **grilled** — the remedy carries a decision: a question to the user, its answer
  a ledger row, then fixed · **rejected** — only when the finding is not a defect · **registered** — a row in
  `open-questions.md` · **noted** — an info observation retained in the report without a document edit ·
  **named** — under a planner loop, the choice moved to the documents' Proposals or
  Alternatives for the user's ruling at the cycle's end. A real defect is never rejected. The dispositions are appended to the plan review under
  `## Dispositions` — the finding's id, its disposition, and for a rejection the reason; a plan review requiring
  changes to documents already committed re-enters this step and commits them again (sdd.step2.7).
  Info observations do not require another plan-review round or block presentation and confirmation
  ([sdd.cycle.5](cycle.md#review-cleanliness)).

## The confirmation and the commit

- **sdd.step2.5.** Present the documents themselves, never a summary. Only the user's word that a document
  covers the ledger confirms it; a nod at a summary is not that word.
- **sdd.step2.6.** On the confirmation, close the step-2 entry and make the settlement commit — `grill.md`,
  `task.md`, `implementation.md`, `progress.md` ([cycle.md](cycle.md), `sdd.commit.1`).
- **sdd.step2.7.** A re-entry edits the existing `task.md` and `implementation.md` in place: append what is
  newly settled and align what it supersedes. Never a parallel document, and never a separate fix document.
- **sdd.step2.8.** Settling and building are two separate consents: this step builds nothing. `sdd step 3` is
  the build, and the user invokes it separately.
- **sdd.step2.9.** A **refactor**, an **R&D** task or a **debug session** — one whose shape the build itself
  discovers, because it evolves as it is built or as the investigation finds the cause — may settle `task.md` alone, without `implementation.md`, when the user says so. The
  waiver is a ledger row in the user's words; `task.md` is then the freeze, `sdd step 3` builds to it and the
  ledger, and every shape the build settles is an `evolution.md` row, each round's parts in `progress.md`. The
  agent never waives it on its own. A **refactor walk** — the user inspecting the code and pointing at issues, fixed
  on the fly — settles neither document: its record is `evolution.md` alone, one row per issue in the user's
  words, its waiver the ledger's first row; `sdd step 3` opens on that row and each round closes with the gate.
