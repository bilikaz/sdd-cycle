---
name: sdd-new-task
description: Initializes a new task as sdd step 0, creating its Git branch, folder, progress.md and initial grill.md. Use when the user asks to open or start a new task. Existing-task interviews use sdd-grill; planning uses sdd-plan.
---

# sdd-new-task — `sdd step 0`

Read and follow [the initialization procedure](../../../docs/instructions/implementation/step-0-new-task.md).
For work on an existing task, follow [sdd.step0.1's routing](../../../docs/instructions/implementation/step-0-new-task.md#identify-the-task)
and stop without creating anything. If a task named for continuation is missing, report the gap and ask;
do not turn it into a new task.

## Read

- [cycle.md](../../../docs/instructions/implementation/cycle.md) — task records and commit boundaries.
  Incomplete initialization follows sdd.cycle.3: report the existing branches and saved-work state and
  ask for direction. This skill does not silently resume, overwrite or abandon that work.
- [workspace.md](../../../docs/instructions/workspace.md) — the setup map; its template may be empty.
  Resolve the required Git facts under sdd.step0.4.

## Work and close

1. Identify the task and allocate its folder and branch names under the procedure's
   [Identify the task](../../../docs/instructions/implementation/step-0-new-task.md#identify-the-task).
2. Resolve existing work under
   [Preserve existing work](../../../docs/instructions/implementation/step-0-new-task.md#preserve-existing-work),
   then [update the base and branch](../../../docs/instructions/implementation/step-0-new-task.md#update-the-base-and-branch).
3. Create the initial records, opening and closing the step-0 progress entry under
   [sdd.step0.11–12](../../../docs/instructions/implementation/step-0-new-task.md#create-the-records-and-stop).
   Report the task folder and each root's task branch and name `sdd-grill` / `sdd step 1` as next, then stop.

Only the user's chosen local preservation commit on the current branch is allowed under
[sdd.commit.6](../../../docs/instructions/implementation/cycle.md#commits). Never merge, push or deliver.
This skill starts no design-grilling, planning step or planner loop; initialization questions still wait for the user.
