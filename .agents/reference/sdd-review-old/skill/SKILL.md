---
name: sdd-review
description: Reviews built work through independent triage, layer reviewers and a verifier, composing numbered review reports. Use when the user requests deep or multi-role code review, invokes sdd-review or sdd step review, and at the end of an implementation/QA loop. Reports only. Proposed-design review belongs to sdd-plan-review; settlement conformance belongs to sdd-qa.
---

# sdd-review — `sdd step review`

The deeper read of built work beside QA. Its roles, protocol, report and disposition rules are
`docs/instructions/implementation/step-review.md`; this skill carries the entry and the boundary. Everything a
role knows lives in `.agents/agents/sdd-review-<role>.md`. Proposed designs use the separate
[sdd-plan-review](../sdd-plan-review/SKILL.md) workflow and agents.

## Dispatch

- Find the active task: scan every `docs/tasks/*/progress.md` for the open step, else the task whose work rests
  built and undelivered. None, or two candidates → say so and stop.
- Read `progress.md` and require built work. A request to judge the proposed design is routed to
  sdd-plan-review, including a revised design on a task with older built work; there is no plan mode here.
- Number the file (sdd.review.4): the first built-code review carries no number, then `2`, `3` …
- The session is not the one that built or settled the work (sdd.review.5).

## Read, in this order

| # | File | Why |
|---|---|---|
| 1 | `docs/instructions/implementation/step-review.md` | the review in full |
| 2 | `docs/instructions/implementation/step-4-qa.md` § *The QA document* | the findings table and the severities every role file uses |
| 3 | the task's `task.md` · `implementation.md` · `grill.md` · `evolution.md` | what the work is — context for the roles, never the thing judged |
| — | not yet: the previous built-code review | read only after *Findings* freezes |

## The material

- The task's changed files — `git diff <settlement commit>` plus the untracked files — and the code
  they call.

## The run

1. **Triage** — spawn `sdd-review-triage` with the task folder and the material; it writes the dispatch
   to `<file>-triage.md`: per role, dispatched with its files, or skipped with the reason.
2. **The roles** — spawn every dispatched role **together**, fresh context each, each briefed with: the
   task folder, its files from triage, the roles running beside it, and its output file
   `<file>-<role>.md`. Wait for all of them.
3. **The verifier** — spawn `sdd-review-verifier` with every role file holding a blocker or a major, and on a
   re-run the previous built-code review; it writes `<file>-verifier.md`.
4. **Compose** `<file>.md` (sdd.review.14 and the document shape): drop the voided, merge duplicates naming every
   role, keep disagreements as one row with both readings, rank blocker first. Findings freeze here.
5. **Follow-up** — read the newest previous built-code review and write what still stands, what
   closed and what recurred.
6. A question the record does not answer → a row in `open-questions.md` and an **info** finding naming it.
7. Stop. Name the file and who disposes of it: `sdd step 3`.

Under delegated implementation routing the orchestrator has spawned triage, the roles and the verifier: start at 4
from the files it names.

## Never

- Never fix, dispose, commit, push or ask the user — the review reports (sdd.review.6).
- Never write a `progress.md` entry (sdd.review.7).
- Never judge the build against `task.md` / `implementation.md` — that is QA's drift lane (sdd.review.10).
- Never hand a role its conventions: it picks them from the index (sdd.review.8).
- Never keep a finding whose quoted span does not exist verbatim.
