# sdd step 5 — Commit

Delivery follows each repository's policy in [workspace.md](../../workspace.md#git-targets).
Invocation and narrower requests follow [sdd.commit.2](cycle.md#commits).
Changes to the settled task follow [evolution](escalation.md), including changes discovered during delivery.

## The step

- **sdd.step5.1.** Commit the whole working tree in each participating root, including task records and
  standing documents, except explicit user exclusions and standing exclusions such as local secrets/env files.
  Do not select files merely by guessing what belongs to the task.
- **sdd.step5.2.** Perform only requested, configured pushes to verified project targets.
  Local-only policy or instruction stays local. Missing policy or targets need clarification before mutation.
- **sdd.step5.3.** Follow each root's configured merge target, method and refs to push.
  On a conflict or rejected push, stop and report completed actions and what remains.
  Do not force delivery, reset successful work or automatically undo published history.
- **sdd.step5.4.** Resolve the named task, otherwise the unambiguous task from progress and branch context;
  ask if ambiguous. Before changing Git state, verify every root, task branch, protected ref, execution
  workspace and delivery prerequisite. Never commit task work directly to a protected base branch.
- **sdd.step5.5.** Commit messages name the task and concrete change. Follow configured repository order;
  include task-index and progress changes before committing the root that owns those records.
- **sdd.step5.8.** Update the existing [task-index](../../../project/docs/tasks/INDEX.md) row, adding it only when absent.
  Record confirmed state; pending pushes/checks remain pending until they succeed.
  Include record updates in delivery commits rather than writing them after the last commit and leaving
  them unpublished. Final results after pushes/checks may need a final records commit under the same policy.
  That commit and its configured publication remain part of this delivery.
- **sdd.step5.9.** Run configured post-delivery actions in the selected workspace.
  Deployment is not universal. Follow shared-resource ownership under the
  [Docker convention](../../../project/docs/conventions/docker.md); delivery authorizes no unrelated host or global cleanup.
  A failure reports which Git actions already succeeded.

## Closing

- **sdd.step5.6.** Close progress using the [progress template](templates/progress.md) with confirmed outcomes
  and incomplete actions. Report actual commits, merges, pushes and checks in the reply, stating local-only
  delivery when applicable. Mark delivered only after all requested configured actions succeed; if final
  record publication fails, retain the local partial-delivery record and report the failure.
- **sdd.step5.7.** A delivered task can receive further authorized rounds in the same folder.
