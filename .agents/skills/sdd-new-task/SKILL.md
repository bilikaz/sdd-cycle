---
name: sdd-new-task
description: Initializes a new task as sdd step 0, creating its Git branch, folder, progress.md and initial grill.md, then runs the grill (sdd step 1). Use when the user asks to open or start a new task. Existing-task interviews use sdd-grill; planning uses sdd-plan.
---

# sdd-new-task — `sdd step 0`

Read and follow [the initialization procedure](../../../sdd/instructions/implementation/step-0-new-task.md).
For work on an existing task, follow [sdd.step0.1's routing](../../../sdd/instructions/implementation/step-0-new-task.md#identify-the-task)
and stop without creating anything. If a task named for continuation is missing, report the gap and ask;
do not turn it into a new task.

## Read

- [cycle.md](../../../sdd/instructions/implementation/cycle.md) — task records and commit boundaries.
  Incomplete initialization follows sdd.cycle.3: report the existing branches and saved-work state and
  ask for direction. This skill does not silently resume, overwrite or abandon that work.
- [workspace.md](../../../sdd/workspace.md) — the setup map; its template may be empty.
  Resolve the required Git facts under sdd.step0.4.

## Work and close

1. Identify the task and allocate its folder and branch names under the procedure's
   [Identify the task](../../../sdd/instructions/implementation/step-0-new-task.md#identify-the-task).
2. Resolve existing work under
   [Preserve existing work](../../../sdd/instructions/implementation/step-0-new-task.md#preserve-existing-work),
   then [update the base and branch](../../../sdd/instructions/implementation/step-0-new-task.md#update-the-base-and-branch).
3. Create the initial records, opening and closing the step-0 progress entry under
   [sdd.step0.11–12](../../../sdd/instructions/implementation/step-0-new-task.md#create-the-records-and-start-the-grill).
   Report the task folder and each root's task branch, then continue with step 1 by following
   [sdd-grill](../sdd-grill/SKILL.md); it stops when the grill is done.

Only the user's chosen local preservation commit on the current branch is allowed under
[sdd.commit.6](../../../sdd/instructions/implementation/cycle.md#commits). Never merge, push or deliver.
This skill starts no planning step; initialization questions still wait for the user.
