---
name: sdd-new-task
description: Opens a task and settles it — `sdd step 1`, the grill or a bug's citation, then `sdd step 2`, `task.md` and `implementation.md`, ending at the settlement commit with nothing built. Use when the user says new task, start a task, open an iteration, there is a bug, fix this bug, or invokes sdd-new-task; or when a task rests with `sdd step 1` or `sdd step 2` open and the user says continue. Not for the build (`sdd-implement`), the review (`sdd-qa`) or the delivery (`sdd-commit`).
---

# sdd-new-task — `sdd step 1` and `sdd step 2`

The cycle and the steps' rules are the instruction files'; this skill carries the entry, the read and the
boundary only.

## Dispatch

- Scan every `docs/tasks/*/progress.md` before anything else. An open step is the case; the conversation is not.
- One folder per task branch: a `harness/` branch that already has a folder gets no second one — feedback on that folder's work
  is its own next round.
- No folder, or none open: ask the opening question — *what is the task?* — and create `docs/tasks/task<n>/`
  with its `progress.md` on the answer (`docs/instructions/implementation/cycle.md`).
- Run only the step the user named; end at the settlement commit and stop. Nothing is built here.

## Read, in this order

| # | File | Why |
|---|---|---|
| 1 | `docs/instructions/implementation/cycle.md` | the folder, the ids, `progress.md`, the commit boundary |
| 2 | the task folder's `progress.md`, last entry | where the task is |
| 3 | `docs/instructions/implementation/step-1-grilling.md` | `sdd step 1` — the two doors, the interview, `grill.md` |
| 4 | `docs/instructions/implementation/step-2-settle.md` | `sdd step 2` — the two documents, the confirmation, the commit |
| 5 | `docs/instructions/documentation/implementation-guide.md` · `format.md` | the anatomy of `implementation.md`, its tables and diagrams |
| 6 | the standing documents the task touches, after the opening answer | the glossary · the architecture map · the Agent Notes · the conventions — `docs/instructions/workspace.md` names each home — what is already ruled |

## The step

- `sdd step 1` — a bug cites where the right behaviour is written; anything else is grilled, one question at a
  time, the answer row landed in `grill.md` as it resolves. It closes when no branch is unresolved.
- `sdd step 2` — `task.md`, then `implementation.md`; the documents themselves are presented and the user's word
  confirms them. On the confirmation, commit `grill.md`, `task.md`, `implementation.md`, `progress.md`.
- Present the documents, never a summary; a nod at a summary is not the confirmation.

## Never

- Never write code — *"just the obvious part"*: the build is `sdd-implement`.
- Never skip the grill because the work looks small; only a citation skips it.
- Never ask several questions in one turn, and never recommend what nothing grounds.
- Never ask what the record or the user's own words already answer.
- Never commit before the confirmation, never beyond the four files, and never push.
