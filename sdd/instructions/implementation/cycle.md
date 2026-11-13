# The implementation cycle

Six numbered steps, 0–5, take a task from initialization through grilling, planning, implementation, QA and
delivery. Task records live in the application checkout; the project's Git roots are mapped in
[workspace.md](../../workspace.md). The **user drives the cycle**: they name the step, the agent runs that step,
and it stops when it reports the step done. The task folder is the record — an
agent reads the folder before it acts, never the conversation.

## The task folder

Paths here are relative to the outer workspace unless marked project-relative. Repository ownership
and participation follow [the workspace boundaries](../../workspace.md#repository-and-document-boundaries).

One folder per task under `project/docs/tasks/`, registered in the
[tasks index](../../../project/docs/tasks/INDEX.md) by its delivery (sdd.step5.8). Its name:

| The task | Folder | Example |
|---|---|---|
| serves a milestone of the project's roadmap | `<YYYY-MM-DD>-<milestone-code>-<slug>/` — the date it opened, the milestone's code, a short slug | `2026-01-15-M2-login-flow/` |
| serves no milestone | `task<n>/` — numbered after the highest existing `task<n>`, starting at `task1` | `task7/` |

The roadmap's home is the project's [workspace map](../../workspace.md#standing-documents); the milestone is the one
the task takes from it, recorded in `task.md` as **Milestone.** A folder carries no developer name.

| File | Holds |
|---|---|
| `progress.md` | task Git context and the step log — one entry per step occurrence |
| `grill.md` | the answer ledger — one row per resolved question |
| `task.md` | the settled intent |
| `implementation.md` | the settled plan |
| `evolution.md` | post-settlement adjustments and their agent/person origin under [evolution](escalation.md) |
| `open-questions.md` | the register — questions nobody could answer, and defects noticed but not fixed |
| `changes.md` | the shared file/count/line inventory for QA and built-code review ([changes.md](changes.md)) |
| `plan-review/assignments.md` | the plan reviewers' roster and convention assignments, created once and reused |
| `plan-review/guides/<reviewer>.md` | a plan reviewer's reusable source guide |
| `plan-review/round<x>/review.md` | one proposed-design review round, verified and composed by its lead ([step-plan-review.md](step-plan-review.md)) |
| `plan-review/round<x>/<reviewer>.md` | one plan reviewer's findings in that round |
| `qa/assignments.md` | the QA agents' roster and convention assignments |
| `qa/guides/<type>.md` | a QA agent's reusable source guide |
| `qa/round<x>/review.md` | one QA round, verified and composed by its lead ([step-4-qa.md](step-4-qa.md)) |
| `qa/round<x>/<type>.md` | one QA agent's findings in that round |
| `review/assignments.md` | the built-code reviewers' roster and convention assignments |
| `review/guides/<reviewer>.md` | a built-code reviewer's reusable source guide |
| `review/round<x>/review.md` | one built-code review round, verified and composed by its lead ([step-review.md](step-review.md)) |
| `review/round<x>/<reviewer>.md` | one built-code reviewer's findings in that round |

## The numbered steps

| Step | Does | Produces | File |
|---|---|---|---|
| `sdd step 0` New task | preserves existing work as instructed, updates the base from origin and creates the task branch and folder | branch, `progress.md`, initial `grill.md` | [step-0-new-task.md](step-0-new-task.md) |
| `sdd step 1` Grilling | interviews the user until every branch of the task is resolved | `grill.md` | [step-1-grilling.md](step-1-grilling.md) |
| `sdd step 2` Settling | settles the plan from the ledger; later re-entry follows explicit human re-settlement | `task.md`, `implementation.md` | [step-2-settle.md](step-2-settle.md) |
| `sdd step 3` Implementing | builds to the settled documents, verifies, brings the standing documents current; re-entered to dispose of a QA round's findings | the built thing, its tests, current documents | [step-3-implement.md](step-3-implement.md) |
| `sdd step 4` QA | an independent read of the built work against the settled documents | `qa/round<x>/` | [step-4-qa.md](step-4-qa.md) |
| `sdd step 5` Commit | commits task work, records delivery and follows each root's configured merge/push policy | delivery result and any incomplete action | [step-5-commit.md](step-5-commit.md) |

Escalation and evolution are [escalation.md](escalation.md); verification is [testing.md](testing.md).

Beside the numbered steps, `sdd step review` judges built work ([step-review.md](step-review.md)); `sdd step plan review`
judges proposed designs ([step-plan-review.md](step-plan-review.md)). Both require a request.

Task creation uses [sdd-new-task](../../../.agents/skills/sdd-new-task/SKILL.md); grilling uses
[sdd-grill](../../../.agents/skills/sdd-grill/SKILL.md). Neither starts planning automatically.

## Ids

Every rule is `sdd.<file>.<n>` — `sdd.progress.2`, `sdd.step3.4`, `sdd.testing.37`. A step is named
`sdd step <n>` wherever it is spoken of: in prose, in `progress.md` and in a rule. Ids are never renumbered — a
retired rule keeps its number and reads *retired, see `<id>`*; a new rule takes the next free number in its file.

## Order

- **sdd.cycle.1.** The user names the step and the agent runs that step only. No step is refused for order and
  none is taken unprompted, with one exception: step 0 runs straight into step 1 (sdd.step0.12).
- **sdd.cycle.2.** A missing prerequisite is the only refusal. Step 0 needs a brief and the Git choices
  required by its initialization procedure. Step 1 needs an initialized task; step 2 needs that task's
  completed grill or documented-bug citations. Name the missing prerequisite instead of creating it through
  an unrequested step. Step 3 requires the landed settlement commit for required documents under
  sdd.step2.9; a refactor walk uses its recorded waiver/evolution instead. Missing settlement names
  `sdd-plan` and stops without opening planning. Step 4 or built-code review without built work names
  `sdd step 3` and stops. Step 5 acts on whatever the working tree holds.
- **sdd.cycle.3.** A task may rest with a step open. An invocation to continue it re-reads `progress.md`,
  resumes that step, or states plainly that it cannot. `sdd-new-task` is always a new-task entry, never a
  resume operation. An incomplete initialization is reported with its existing branch and saved-work state;
  another new-task invocation never silently overwrites or resumes it.
- **sdd.cycle.4.** *Retired.* There is no special kind of task: every task runs these same steps.

## Review cleanliness

- **sdd.cycle.5.** A plan review, QA round or built-code review is **clean** when its applicable reads and
  coverage are complete, its handoffs are accounted for, and it has no blocker, major or warning findings.
  Missing reads and coverage gaps are incomplete reviews and belong in Findings under the
  [report template](templates/report.md#findings).
  User confirmation of documents and authorization of further steps or delivery still apply.

## Finding verification

- **sdd.cycle.6.** The review lead verifies specialist findings before returning the final report; whoever
  receives it acts on its findings, result and coverage status without repeating the source investigation.
  Missing reports or coverage gaps go back to the lead. The agent making the fix checks the relevant current
  code or documents before changing them and owns the disposition.

## Independent reviews

- **sdd.cycle.7.** Each review invocation uses a fresh lead and fresh specialists separate from the builder;
  plan-review and built-code leads are also separate from the plan author. If the invoking session authored
  that work, delegate the whole lead role to a fresh context using the task paths and required current inputs.
  Do not inherit the builder/author conversation or feed previous verdicts into current discovery.
  If that separation is unavailable, report the limitation and do not conduct or claim an independent review.
  A further round needs another authorized invocation and fresh review context.

## `progress.md`

Use the [progress template](templates/progress.md) and its COMMENTS guidance for task Git context and entries.

- **sdd.progress.1.** One entry is open at a time. The next step does not open until the previous entry is
  closed.
- **sdd.progress.2.** Use the role-specific entries in the progress template. Review records contain only
  report filenames and numeric finding counts; review details stay in their reports. Step 3 carries its implementation tables.
  Do not add generic summaries or repeat content already in the task records.
- **sdd.progress.3.** A done entry is never rewritten. A further round opens a new entry at the same step id.
- **sdd.progress.4.** Only the agent running a step writes its entry; nothing else edits `progress.md`. One
  carve-out: an entry an agent left open is either resumed (sdd.cycle.3) or, where the user names another step, closed
  by the next agent as its first act, recording its actual state and relevant record references.
- **sdd.progress.5.** A non-step occasion — an implementation hand-back, a recovery, or infrastructure work the user asked for —
  gets its own entry using the progress template.
  A step waiting for the user's guidance or confirmation stays within its current entry; that pause is not
  an occasion.
- **sdd.progress.6.** A review is a step of its own in progress, and its lead writes that entry. A plan review (`sdd step plan review — <round folder>`), a QA round (`sdd step 4 · QA — <round folder>`) or a built-code review (`sdd step review — <round folder>`) starts by closing the open step entry and opening its own, and closes it, under the [progress template](templates/progress.md). The agent that resumes after opens a new entry for its own step.

## Registers

- **sdd.register.1.** One register per task folder: `open-questions.md`. A question nobody in the task could
  answer, and a defect noticed and deliberately not fixed, each use the
  [register template](templates/open-questions.md). There is no second task register.
- **sdd.register.2.** A register row **records**; it binds nothing and needs no approval. Registers are read
  after the cycle, in one sitting — never mid-loop.
- **sdd.register.3.** Register deferrable questions and continue with the reading the documents best support.
  This does not replace a required user choice: step-0 Git decisions, unresolved scope, a changed ruling and
  document confirmation still wait for the user.
- **sdd.register.4.** Where the project uses them, two standing lists outlive the tasks, both in project-relative `docs/roadmap/`
  beside its `plan.md`: `todo.md` — what the product must still do that no task owns yet;
  `revisit.md` — a settled
  choice to be looked at again. A register row moves to one of them when the user rules it so, naming its
  origin (task and row id); the task that takes an entry deletes it in the same change. Neither is a task
  record: both are live documents, kept current.
- **sdd.register.5.** `sdd step 1` consults available roadmap entries relevant to the task's brief; an entry
  the task touches is a question of its grill. Missing roadmap documents do not block an initial grill.

## Commits

- **sdd.commit.1.** Closing `sdd step 2` commits the settlement paths: `grill.md`, `task.md`,
  `implementation.md`, `progress.md` (omit a document only under the user's waiver: sdd.step2.9), plus the
  task's `plan-review/` folder — the rounds of that settlement's review cycle and the persistent preparation
  (sdd.step2.10), plus task-level `report.md` when used by that planning run.
  Standing documents follow normal step-5 delivery in their owning repositories; the local `sdd/workspace.md` is
  never committed.
  Show the exact paths with the task documents before confirmation. These are committed in the task-record
  repo, under the message `docs(tasks): settle <folder>`, committed by path (`git commit -- <the settlement paths>`) so nothing
  else staged in the index — a build's `git mv` included — rides along. This commit is the
  task's freeze: the settled documents it holds are what later steps build to and the QA review diffs
  against.
- **sdd.commit.2.** Step 5 commits participating working trees and performs their configured delivery actions
  under [step 5](step-5-commit.md). The invocation authorizes that delivery; explicit exclusions or a narrower
  request limit it. Merge/push policies and targets come from [workspace.md](../../workspace.md#git-targets),
  never a universal branch or remote assumption.
- **sdd.commit.3.** No other step pushes. Settlement and delivery are the cycle's two normal commit moments,
  beside the checkpoints of sdd.commit.4, undone at the hand-back (sdd.commit.5), and step 0's explicitly
  chosen preservation commit (sdd.commit.6).
- **sdd.commit.4.** Before a new edit wave starts — a `sdd step 3` re-entry, a QA round's fix wave, or the build
  after a re-settle — the agent commits the whole working tree of each of the task's branches locally as a checkpoint
  (`wip(<folder>): checkpoint before <the wave>`),
  so each wave's changes stay apart and none is lost. A checkpoint is never pushed; the step-5 delivery pushes it
  with the rest. A settlement commit still holds only the settlement paths (sdd.commit.1).
- **sdd.commit.5.** When step 3 hands its work back to the user, undo only
  that task's own local, unpushed checkpoints, preserving the working files and every settlement or other
  non-checkpoint commit. If the checkpoints form the tip of the branch, use `git reset --mixed` to the last
  non-checkpoint commit, never automatically to the branch point. If they are interleaved with other commits
  or have been pushed, report the state instead of rewriting history. Planning hand-backs do not undo commits.
- **sdd.commit.6.** Step 0 may commit existing work locally on its current branch only when the user chooses
  that preservation option under [sdd.step0.5–6](step-0-new-task.md#preserve-existing-work). It is not
  settlement, a checkpoint or delivery, and authorizes neither a merge nor a push.

## Naming

- **sdd.naming.1.** Each review workflow keeps its own folder — `plan-review/`, `qa/`, `review/` — and its rounds in
  numbered folders inside it: `round1/`, `round2/`, …, each holding the lead's `review.md` and one `<role>.md` per
  reviewer. A new round takes one more than the highest round folder present, a partial one included; the
  workflows count independently. The persistent `assignments.md` and `guides/` sit beside the rounds, carry no
  number and never replace a report. Supply exact output paths and preserve existing reports.
- **sdd.naming.2.** A repeated step keeps its id. Two `sdd step 3` entries in one `progress.md` are told apart
  by their place in it, never by a number.
