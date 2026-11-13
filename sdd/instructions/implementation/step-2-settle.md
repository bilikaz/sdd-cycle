# sdd step 2 — Settling

Step 2 writes the task's two settled documents from the ledger: `task.md` is *what and why*,
`implementation.md` is *how*. Later re-settlement follows
[the human-only re-entry rule](escalation.md#re-entering-sdd-step-2).

The step entry point is [sdd-plan](../../../.agents/skills/sdd-plan/SKILL.md); its related coordinating role
is [sdd-planner](../../../.agents/skills/sdd-planner/SKILL.md) for an explicitly delegated drafting/review loop.

## Entry

- **sdd.step2.11.** Use the task named by the user, otherwise the task matching the current branch,
  otherwise the sole task with step 2 open. Ask if the result is absent or ambiguous; never pick the first
  open task or create a folder here. Read `progress.md`, `grill.md` and any existing `task.md`,
  `implementation.md` and `evolution.md`. Initial planning requires a completed step 1 with resolved scope
  or bug citations. If that prerequisite is missing, name `sdd-grill` and stop before changing progress or drafting.
  After implementation begins, require explicit human re-settlement under sdd.escalation.8.
  Verify the task branch before edits; report a mismatch and stop without switching or creating a branch.
  Open or resume one step-2 progress entry; a delegated planner owns it while its reviewers work.
  A standalone invocation reads the Planner run state in the task's `report.md`: active means the planner still owns
  the work; handed-back means that run ended. Do not create a second writer alongside an active planner.
  Wait for its return or explicit user reassignment; report active work rather than drafting
  concurrently. Questions arising during planning add ledger answers within this entry, without opening
  step 1 again.
- **sdd.step2.12.** Populate relevant sections of [workspace.md](../../workspace.md) from the setup answers in
  the ledger and verified project configuration. Do not invent hosts, commands, remotes or project-document
  homes. Keep unknown values unconfigured and unused sections explicitly not applicable. Existing standing
  documents are read when relevant; their absence in a new project is not a reason to invent their content.
  Establish the homes needed for approved rulings held during the initial grill and land that content under
  [single-source rule 5](../documentation/single-source.md#the-rule); do not create an unused set of documents.

## `task.md` — the intent

Write from the [task template](templates/task.md), following the COMMENTS beside its fields and sections.

- **sdd.step2.1.** A done-when quotes its ledger row verbatim — numbers, orderings and negatives as answered,
  never softened into prose. On a bug it quotes the cited source.
- **sdd.step2.2.** Every ledger row has a destination this document names, or one the ledger already named.

## `implementation.md` — the guide

Written against the confirmed `task.md`: what will be made, concretely enough to review before it is built. Its
structure and content guidance live in the [implementation template](templates/implementation.md).
Diagrams and tables follow [format.md](../documentation/format.md). One home per fact: a rule, a table or a name
that already lives in one of [the standing documents](../../workspace.md#standing-documents) is linked, never restated
([single-source.md](../documentation/single-source.md)).

- **sdd.step2.3.** `implementation.md` names every item `task.md` carries: each decision, done-when and
  out-of-scope line has its place — the file it lands in, the shape it takes, the check that proves it. An item
  not named is a gap, closed before the document is presented.
- **sdd.step2.4.** The settlement commit freezes both documents. Later changes follow
  [evolution and human-only re-settlement](escalation.md); neither a finding nor changed scope automatically reopens them.

## Disposing of a plan review

- **sdd.step2.10.** Review runs only on the user's request or delegated routing under sdd.cycle.1. With no
  report, skip disposal; standalone planning launches no review on its own. A user-requested review belongs
  to `sdd-plan-review`, and a delegated loop to `sdd-planner`. Otherwise read the highest
  review round of `plan-review<x>.md` ([step-plan-review.md](step-plan-review.md)); round 1 is the unnumbered
  `plan-review.md` under sdd.naming.1. Read that round
  and any earlier round with unfinished dispositions; file modification times do not determine review order.
  Every finding takes exactly one
  disposition before the documents are presented: **fixed** — `task.md` or `implementation.md` edited in place, one
  right answer inside the ledger · **grilled** — the remedy carries a decision: a question to the user, its answer
  a ledger row, then fixed · **rejected** — only when the finding is not a defect · **registered** — a row in
  `open-questions.md` · **named** — under a planner loop, the choice moved to the documents' Proposals or
  Alternatives for the user's ruling at the cycle's end. Standalone planning asks for a needed decision;
  a delegated planner uses **named** for a decision awaiting the user's ruling, rather than marking it
  **grilled** before the question has been answered. It carries the decision to presentation or hand-back,
  never inventing a ruling mid-loop. A real defect is never
  rejected. Append dispositions using the
  [report template's Dispositions section](templates/report.md#dispositions). A review of already committed documents follows
  sdd.step2.4; it does not itself authorize re-settlement.
  If all blocker, major and warning claims are verified non-defects and rejected with reasons, coverage is
  complete and the plan is unchanged, the review is clean after dispositions; proceed to presentation without
  re-reviewing unchanged documents. Registered or named blocking findings and coverage gaps still prevent
  a clean result. Finding verification follows [sdd.cycle.6](cycle.md#finding-verification).

## The confirmation and the commit

- **sdd.step2.5.** Present the documents themselves, never a summary. Only the user's word that a document
  covers the ledger confirms it; a nod at a summary is not that word.
  Resolve remaining Proposals and Alternatives with the user first, recording the rulings and applying
  them under the [implementation template's choice guidance](templates/implementation.md).
  A choice ruling is not final document confirmation; present the updated
  documents for that confirmation after the choices are resolved.
- **sdd.step2.6.** On the confirmation, close the step-2 entry and make the settlement commit using the
  canonical path boundary in [cycle.md](cycle.md), sdd.commit.1. Stop after reporting settlement; the build
  or a further planning cycle needs its own instruction.
- **sdd.step2.7.** A re-entry edits the existing `task.md` and `implementation.md` in place: append what is
  newly settled and align what it supersedes. Never a parallel document, and never a separate fix document.
- **sdd.step2.8.** Settling and building are two separate consents: this step builds nothing. `sdd step 3` is
  the build, and the user invokes it separately.
- **sdd.step2.9.** A **refactor**, an **R&D** task or a **debug session** — one whose shape the build itself
  discovers, because it evolves as it is built or as the investigation finds the cause — may settle `task.md` alone, without `implementation.md`, when the user says so. The
  waiver is a ledger row in the user's words; `task.md` is then the freeze, `sdd step 3` builds to it and the
  ledger, and every shape the build settles is an `evolution.md` row, each round's parts in `progress.md`. The
  agent never waives it on its own. A **refactor walk** — the user inspecting the code and pointing at issues, fixed
  on the fly — settles neither document: its issue record follows the evolution template, with user rulings
  in `grill.md` and its waiver the ledger's first row. Step 3 opens on that row and each round closes with the gate.
