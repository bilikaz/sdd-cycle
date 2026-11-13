# sdd step 0 — New task

Step 0 creates the task's branch and records. Its entry point is
[sdd-new-task](../../../.agents/skills/sdd-new-task/SKILL.md). Grilling is a separate step.

## Identify the task

- **sdd.step0.1.** This entry opens new tasks only. For work on an existing task, read its `progress.md`,
  name the requested step's skill from [the routing table](../../../AGENTS.md#the-task-cycle--the-short-version)
  and stop without creating anything. An explicit re-grill belongs to `sdd-grill`; a bare request to continue
  uses the current step under [sdd.cycle.3](cycle.md#order). If the task is unclear or a task named for
  continuation does not exist, report the gap and ask; never turn that request into new-task creation.
- **sdd.step0.2.** Use the user's brief to name the task. Ask what the task is only when that is missing;
  gather enough to name the branch, leaving the design interview to step 1.
- **sdd.step0.3.** Name the task folder under [cycle.md § The task folder](cycle.md#the-task-folder): a task that
  serves a roadmap milestone is `<YYYY-MM-DD>-<milestone-code>-<slug>`, dated the day it opens; any other is
  `task<n>`, after the highest existing `task<n>`, starting at `task1`. Which milestone the task serves comes from
  the user's brief or the roadmap; when neither settles it, ask. The branch is `task/<folder>` unless the user or
  configured project naming rules specify another pattern. Check folder and branch availability before creating either; never overwrite an existing task.

## Preserve existing work

- **sdd.step0.4.** Identify the actual Git roots and execution environment from
  [workspace.md](../../workspace.md), project configuration or the user. Inspect the current branch and staged,
  unstaged and untracked changes in each root being branched. An empty workspace template does not prevent
  these checks; use verified Git facts and record them in the new task.
- **sdd.step0.5.** When changes exist, show their repository, current branch and file list. Ask whether to
  commit them locally on the current branch or carry them into the new task branch. Wait for the answer
  before moving work or switching branches. Apply an answer already given for this work without reasking.
- **sdd.step0.6.** The commit choice is a local preservation commit on the current branch, before new task
  records are created. Commit the work the user selected, then proceed. It authorizes no push, merge or
  delivery step ([cycle.md](cycle.md), sdd.commit.6).
- **sdd.step0.7.** The carry choice preserves staged, unstaged and untracked work, including its index state.
  If a temporary stash is needed, use `git stash push --include-untracked`, record that stash's object id,
  and restore that exact stash with `git stash apply --index <id>` after branching. After successful
  restoration is verified, find the current stash reference for that object id and drop only that entry.
  Leave other stashes untouched. On a conflict, retain the saved
  work, report the state and ask how to resolve it; never discard work to force a switch.

## Update the base and branch

- **sdd.step0.8.** The base is `main` unless the user explicitly instructs another branch. A base recorded in
  `workspace.md` supplies that instruction only when it is confirmed project setup; an unconfirmed value
  does not override the default. Once existing work
  is preserved, fetch `origin`, switch to the selected base and pull it from `origin` with `--ff-only` before
  creating the task branch. A missing remote/base or failed update needs the user's instruction; never invent
  a remote or silently branch from stale data. An explicitly instructed local-only start is recorded as such.
- **sdd.step0.9.** If the local base and its `origin` counterpart have diverged, stop and ask how to reconcile
  them. Never choose a merge, rebase or reset automatically.
- **sdd.step0.10.** Create and check out the task branch from the updated base in each participating root.
  Record each root's task branch, base branch and starting commit in `progress.md` using its template.
  Restore carried work there. If any root
  fails, report which roots were branched and where the work is preserved; do not start grilling or claim
  initialization complete.

## Create the records and stop

- **sdd.step0.11.** Create `project/docs/tasks/<folder>/progress.md` with verified Git context and a step-0 entry,
  and `grill.md` with the user's original brief and initial answers using the
  [grill](templates/grill.md) and [progress](templates/progress.md) templates. Preserve the user's wording.
  Follow step 1's [answer-ledger rules](step-1-grilling.md#grillmd--the-answer-ledger); record the user's
  work-preservation and base choices without treating initialization as a design interview.
- **sdd.step0.12.** Close step 0 after branch creation, work restoration and record creation succeed. Report
  the task folder and every root's task branch, say that `sdd-grill` / `sdd step 1` is next, and stop. Never start grilling,
  planning or the planner loop automatically. Task records remain uncommitted until settlement.

Git behavior is documented in [pull](https://git-scm.com/docs/git-pull),
[switch](https://git-scm.com/docs/git-switch) and [stash](https://git-scm.com/docs/git-stash).
