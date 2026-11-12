---
name: sdd-commit
description: Runs sdd step 5 to commit participating working trees and perform their configured delivery actions. Use for commit, delivery or resuming an open step 5. Explicit local-only requests and file exclusions limit the action. Step-0 preservation and implementation checkpoints stay with their owning steps.
---

# sdd-commit — step 5

Follow [step 5](../../../docs/instructions/implementation/step-5-commit.md),
[delivery authorization](../../../docs/instructions/implementation/cycle.md#commits) and
[workspace.md](../../../docs/instructions/workspace.md).
In this cycle, a bare commit request invokes the configured delivery; explicit instructions such as
`local commit only`, `do not push` or named file exclusions narrow it.

Resolve the task and execution workspace; ask if ambiguous. Before changing Git state, verify actual roots,
task branches, protected refs, targets and configured delivery actions under sdd.step5.4.
Missing configuration requires clarification, never a guessed `main`, remote or host.

Follow the procedure's delivery order so task-index/progress updates are included in the record-root
commit. Commit the whole participating working trees except explicit user and standing exclusions.
Perform the authorized configured actions and post-delivery actions; report actual results.

On conflict or rejected push, stop and report partial delivery under sdd.step5.3 and .6.
Do not force, reset successful work or claim delivery complete. A local-only request stays local.
Plan adjustments encountered here follow
[evolution](../../../docs/instructions/implementation/escalation.md); do not reopen step 2 yourself.
