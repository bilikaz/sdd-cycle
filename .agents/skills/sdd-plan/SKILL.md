---
name: sdd-plan
description: "Runs sdd step 2 for an existing task: drafts or revises task.md and implementation.md, presents them for confirmation and makes the settlement commit. Use for sdd-plan, planning an opened task, settling changed scope or resuming step 2. Delegated planning and review loops use sdd-planner; opening a task uses sdd-new-task."
---

# sdd-plan — `sdd step 2`

Plans a task that already exists, from its resolved ledger or an approved change to its settled shape.
The step's rules are `docs/instructions/implementation/step-2-settle.md`; this skill carries the entry and
the boundary. The related coordinating role is [sdd-planner](../sdd-planner/SKILL.md), invoked when the user
delegates the drafting and plan-review loop. Running this step alone does not delegate that loop.

## Dispatch

- Read the existing task folder's `progress.md` and `grill.md`. Draft from its resolved ledger, or revise the
  current documents for the change the user approved. A missing task belongs to `sdd-new-task`.
- The change is settled **before** it is built: this step writes documents and commits, and applies nothing.

## Read, in this order

| # | File | Why |
|---|---|---|
| 1 | `docs/instructions/implementation/cycle.md` | the folder, the ids, `progress.md`, the commit, the register |
| 2 | `docs/instructions/implementation/step-2-settle.md` | `sdd step 2` in full |
| 3 | `docs/instructions/implementation/escalation.md` | what reached this step — an escalation, an evolution, a decision |
| 4 | the settled context: `task.md` · `implementation.md` · `grill.md` · `evolution.md` | what is already settled, so nothing is re-decided |
| 5 | `docs/conventions/INDEX.md` and `harness/AGENTS.md` — per the code touched (sdd.workspace.8); `docs/instructions/workspace.md` — the standing documents | they bind on every change, including a re-settle |
| 6 | `docs/instructions/documentation/implementation-guide.md` · `format.md` | the guide's anatomy |

## The step

- A decision the shape carries is **grilled** first, inside this step — `sdd step 1`'s interview, its answers
  landed in `grill.md` (`step-1-grilling.md`).
- Edit `task.md` and `implementation.md` **in place**: append what is newly settled and align what it
  supersedes. No parallel document, no fix document.
- Present the documents; on the user's confirmation, make the settlement commit — `grill.md`, `task.md`,
  `implementation.md`, `progress.md` (`cycle.md`, sdd.commit.1).

## A plan review

- A `plan-review<x>.md` newer than the documents is disposed of before they are presented under sdd.step2.10.
  Append its `## Dispositions` table; info observations are noted and do not require a document edit or
  another review. Cleanliness follows [sdd.cycle.5](../../../docs/instructions/implementation/cycle.md#review-cleanliness).

## Never

- Never apply the change — settling and building are two consents.
- Never write a parallel or fix document.
- Never edit a settled document before the change is settled.
- Never commit beyond the settlement files, and never push.
