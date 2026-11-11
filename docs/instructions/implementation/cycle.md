# The implementation cycle

Five steps take a task from an interview to a commit merged into `main` and pushed. The task records live in the workspace
and the code in `harness/` — two repos, mapped in [workspace.md](../workspace.md). The **user drives the cycle**: they name the
step, the agent runs that step, and it stops when it reports the step done. The task folder is the record — an
agent reads the folder before it acts, never the conversation.

## The task folder

One folder per task under `docs/tasks/` — `task<n>/`, numbered in the order opened, registered in the
[tasks index](../../tasks/INDEX.md) by its delivery (sdd.step5.8).

| File | Holds |
|---|---|
| `progress.md` | the step log — one entry per step occurrence |
| `grill.md` | the answer ledger — one row per resolved question |
| `task.md` | the settled intent |
| `implementation.md` | the settled plan |
| `evolution.md` | every change to the settled plan the user ruled an evolution — one that leaves the settled shape standing |
| `open-questions.md` | the register — questions nobody could answer, and defects noticed but not fixed |
| `changes.md` | the shared file/count/line inventory for QA and built-code review ([changes.md](changes.md)) |
| `qa/assignments.md` | QA agents, assigned conventions and current material |
| `qa/<type>.md` | a QA agent's reusable source guide |
| `review/assignments.md` | built-code reviewers, assigned conventions and current material |
| `review/<reviewer>.md` | a built-code reviewer's reusable source guide |
| `qa<y>.md` | one QA round's findings, verified and composed by its lead (`<y>` is empty on the first round, sdd.naming.1) |
| `qa<y>-<type>.md` | one QA sub-agent's own findings |
| `review<x>.md` | one built-code review's findings ([step-review.md](step-review.md)) |
| `review<x>-<role>.md` | one built-code role's findings |
| `plan-review<x>.md` | one independent proposed-design review ([step-plan-review.md](step-plan-review.md)) |
| `plan-review<x>-<reviewer>.md` | one reviewer's plan-review findings |
| `plan-review/assigments.md` | one-time reviewer-name list and convention-to-reviewer assignments |
| `plan-review/<reviewer>.md` | that reviewer's one-time source guide, reused by future fresh agents |

## The five steps

| Step | Does | Produces | File |
|---|---|---|---|
| `sdd step 1` Grilling | interviews the user until every branch of the task is resolved | `grill.md` | [step-1-grilling.md](step-1-grilling.md) |
| `sdd step 2` Settling | writes the two settled documents from the ledger; re-entered whenever the task's settled shape changes | `task.md`, `implementation.md` | [step-2-settle.md](step-2-settle.md) |
| `sdd step 3` Implementing | builds to the settled documents, verifies, brings the standing documents current; re-entered to dispose of a QA round's findings | the built thing, its tests, current documents | [step-3-implement.md](step-3-implement.md) |
| `sdd step 4` QA | an independent read of the built work against the settled documents | `qa<y>.md` and its sub-files | [step-4-qa.md](step-4-qa.md) |
| `sdd step 5` Commit | commits the whole working tree, records the task in the tasks index, merges the workspace's branch into `main`, and pushes | the commit merged into `main`, pushed | [step-5-commit.md](step-5-commit.md) |

Escalation and evolution are [escalation.md](escalation.md); verification is [testing.md](testing.md).

Beside the five, `sdd step review` judges built work ([step-review.md](step-review.md)); `sdd step plan review`
judges proposed designs ([step-plan-review.md](step-plan-review.md)). Both require the user's request or their
delegated routing. Delegated routing is carried by
[sdd-planner](../../../.agents/skills/sdd-planner/SKILL.md) for drafting and plan review, and
[sdd-implementer](../../../.agents/skills/sdd-implementer/SKILL.md) for implementation and QA.

The step entry points link to their coordinating roles: [sdd-plan](../../../.agents/skills/sdd-plan/SKILL.md)
to sdd-planner, and [sdd-implement](../../../.agents/skills/sdd-implement/SKILL.md) to sdd-implementer.
Invoking a single step does not delegate the corresponding loop.

## Ids

Every rule is `sdd.<file>.<n>` — `sdd.progress.2`, `sdd.step3.4`, `sdd.testing.11`. A step is named
`sdd step <n>` wherever it is spoken of: in prose, in `progress.md` and in a rule. Ids are never renumbered — a
retired rule keeps its number and reads *retired, see `<id>`*; a new rule takes the next free number in its file.

## Order

- **sdd.cycle.1.** The user names the step and the agent runs that step only. No step is refused for order and
  none is taken unprompted.
- **sdd.cycle.2.** A missing prerequisite is the only refusal. `sdd step 3` without a settled `task.md` and
  `implementation.md` (or a user's waiver of the latter, or of both for a refactor walk — sdd.step2.9), whose step-2
  commit has landed, names
  `sdd step 2` and builds nothing; `sdd step 4`
  without built work names `sdd step 3`; `sdd step 5` acts on whatever the working tree holds.
- **sdd.cycle.3.** A task may rest with a step open. The next invocation re-reads `progress.md`, resumes that
  step, or states plainly that it cannot.
- **sdd.cycle.4.** *Retired.* There is no special kind of task: every task runs these same steps.

## Review cleanliness

- **sdd.cycle.5.** A plan review, QA round or built-code review is **clean** when its applicable reads and
  coverage are complete, its handoffs are accounted for, and it has no blocker, major or warning findings.
  Zero findings and info-only findings both count as clean. **Info is an observation, not an error**: retain
  it in the report, note it in the owning step's dispositions when that step runs and carry it to the hand-back. It requires no
  fix wave, extra review round or register resolution, and does not block the next authorized step or loop
  transition for sdd-planner or sdd-implementer. Missing reads and coverage gaps are incomplete reviews.
  User confirmation of documents and authorization of further steps or delivery still apply.

## `progress.md`

One entry per step occurrence, opened when the step starts and closed when it reports done. The entry
templates:

```
## sdd step <n> · <Step> — opened <YYYY-MM-DD>
Status: current
```
```
## sdd step <n> · <Step> — <YYYY-MM-DD>
Status: done
Summary: <what was done or settled — one line per item; never how>
```
```
## sdd step 3 · Implementing — <YYYY-MM-DD>
Status: done
<the close report's tables — step-3-implement.md>
```

`sdd step 4` names the round's QA file in the heading: `## sdd step 4 · QA — qa2.md — opened <date>`.

- **sdd.progress.1.** One entry is open at a time. The next step does not open until the previous entry is
  closed.
- **sdd.progress.2.** An entry holds `Status` and a `Summary`. The `Summary` is a plain list of what was done or
  settled — what was learned about the task (step 1), what was settled (step 2), what the round found (step 4),
  what was delivered (step 5) — one line per item, and never **how**. Detail a later change can turn into a lie —
  files, flags, numbers, command output — belongs to the artifact that owns it (`grill.md`, `task.md`,
  `implementation.md`, the QA files, the step-3 close report), never to the entry. `sdd step 3` is the one
  exception: its done entry carries the close report's tables in place of a `Summary` — each part of the work
  with its status, the gate run, and what the step raises ([step-3-implement.md](step-3-implement.md)).
- **sdd.progress.3.** A done entry is never rewritten. A further round opens a new entry at the same step id.
- **sdd.progress.4.** Only the agent running a step writes its entry; nothing else edits `progress.md`. Two
  carve-outs: under a delegated routing the coordinating role writes the entries of the steps it delegates;
  and an entry an agent left open is either resumed (sdd.cycle.3) or, where the user names another step, closed
  by the next agent as its first act, its `Summary` saying what stood when it stopped.
- **sdd.progress.5.** An occasion that is not a step — a hand-back (sdd.commit.5), a dev bring-up, a recovery —
  opens an entry too, named `## <Occasion> — <date> — <what>` with a `Status:` line. It holds the same two parts
  as a step entry: what stood, what is owed — never **how** (sdd.progress.2).

## Registers

- **sdd.register.1.** One register per task folder: `open-questions.md`. A question nobody in the task could
  answer, and a defect noticed and deliberately not fixed, each take one row — what it is, where it is visible
  in the tree, and what it blocks. There is no second task register.
- **sdd.register.2.** A register row **records**; it binds nothing and needs no approval. Registers are read
  after the cycle, in one sitting — never mid-loop.
- **sdd.register.3.** Never stop a step, or a delegated loop, for a question: take the reading the documents
  best support, write the row, and carry on.
- **sdd.register.4.** Two standing lists outlive the tasks, both in `docs/roadmap/` beside its `plan.md`: [`docs/roadmap/todo.md`](../../roadmap/todo.md)
  — what the product must still do that no task owns yet; [`docs/roadmap/revisit.md`](../../roadmap/revisit.md) — a settled
  choice to be looked at again. A register row moves to one of them when the user rules it so, naming its
  origin (task and row id); the task that takes an entry deletes it in the same change. Neither is a task
  record: both are live documents, kept current.
- **sdd.register.5.** `sdd step 1` reads both lists after the opening answer; an entry the task touches is a
  question of its grill.

## Commits

- **sdd.commit.1.** Closing `sdd step 2` commits exactly four files — `grill.md`, `task.md`,
  `implementation.md`, `progress.md` (three, without `implementation.md`, under a waiver: sdd.step2.9), plus the
  plan reviews from that settlement's review cycle, their reviewer reports and the task's persistent `plan-review/`
  preparation (sdd.step2.10) — in the **workspace**
  repo, under the message `docs(tasks): settle <folder>`, committed by path (`git commit -- <the settlement paths>`) so nothing
  else staged in the index — a build's `git mv` included — rides along. This commit is the
  task's freeze: the settled documents it holds are what later steps build to and the QA review diffs
  against.
- **sdd.commit.2.** Closing `sdd step 5` commits the whole working tree of **both** repos — the task's branch in
  `harness/`, then the workspace — merges the workspace's branch into `main` and pushes each where it has a push
  target; no PR is opened (sdd.step5.3). The push targets are
  [workspace.md](../workspace.md)'s (sdd.workspace.3). The invocation
  of `sdd step 5` is the signal for the whole delivery; the agent decides nothing about what belongs, because
  the whole tree is the change.
- **sdd.commit.3.** No other step pushes. The settlement commit and the step-5 commit are the cycle's two
  commit moments, beside the checkpoints of sdd.commit.4, undone at the hand-back (sdd.commit.5).
- **sdd.commit.4.** Before a new edit wave starts — a `sdd step 3` re-entry, a QA round's fix wave, or the build
  after a re-settle — the agent commits the whole working tree of each of the task's branches locally as a checkpoint
  (`wip(<folder>): checkpoint before <the wave>`),
  so each wave's changes stay apart and none is lost. A checkpoint is never pushed; the step-5 delivery pushes it
  with the rest. A settlement commit still holds only its four files (sdd.commit.1).
- **sdd.commit.5.** Checkpoints are scaffolding, not the delivery. When the work is handed back to the user — at the
  close of a `sdd step 3` the user drives, and at a delegated loop's hand-back — the agent undoes the task branch's
  checkpoints (`git reset --mixed` to the commit the branch was cut from) so the whole change stands uncommitted in the
  working tree, readable as one diff; the `sdd step 5` delivery commits it. Checkpoints are never pushed, so undoing
  them rewrites nothing anyone else holds.

## Naming

- **sdd.naming.1.** Only QA and review files carry a number. The first round writes `qa.md` and its sub-files
  `qa-code-review.md` · `qa-conventions.md` · `qa-drift.md`; the second writes `qa2.md` and `qa2-<type>.md`.
  The separate review workflows count independently: `review.md` · `review2.md`, and `plan-review.md` ·
  `plan-review2.md`. Persistent assignment/source-guide files have no round number and never replace reports.
- **sdd.naming.2.** A repeated step keeps its id. Two `sdd step 3` entries in one `progress.md` are told apart
  by their place in it, never by a number.
