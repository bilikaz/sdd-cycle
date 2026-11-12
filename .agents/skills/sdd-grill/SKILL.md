---
name: sdd-grill
description: Runs sdd step 1 for an initialized task, recording interview answers or documented-bug citations in grill.md. Use for the initial grill, resuming step 1 or an explicitly requested re-grill. New questions arising inside step 2 remain with sdd-plan or its delegated planner. Task creation belongs to sdd-new-task.
---

# sdd-grill — `sdd step 1`

Read and follow [the grilling procedure](../../../docs/instructions/implementation/step-1-grilling.md),
[cycle.md](../../../docs/instructions/implementation/cycle.md) and
[workspace.md](../../../docs/instructions/workspace.md).

## Entry

Identify the task and verify initialization under the procedure's
[Entry](../../../docs/instructions/implementation/step-1-grilling.md#entry).
Open step 1 if it has not run; resume a current entry. A request to grill again opens a new occurrence;
bare continuation after a done grill reports it done and stops. Never reopen completed progress.
A missing task names `sdd-new-task` and stops; incomplete records or mismatched branch information
are reported for direction. Create no folder, branch or replacement records here.
Questions within active planning remain with that planner without closing its progress entry.

## Work and close

- Follow the [two doors](../../../docs/instructions/implementation/step-1-grilling.md#two-doors),
  [interview](../../../docs/instructions/implementation/step-1-grilling.md#the-interview) and
  [answer-ledger rules](../../../docs/instructions/implementation/step-1-grilling.md#grillmd--the-answer-ledger).
- Record setup answers in `grill.md` as the procedure's Entry requires; step 2 populates `workspace.md`.
- Handle unanswerable questions under
  [sdd.register.1–3](../../../docs/instructions/implementation/cycle.md#registers).
  A deferrable register row need not block close. A required unanswered choice keeps step 1 current;
  name it and wait under sdd.step1.16.
- Close only under [sdd.step1.16–17](../../../docs/instructions/implementation/step-1-grilling.md#closing):
  close the step-1 entry using the progress template and give the completion report defined there, then wait.
  Name `sdd-plan` / `sdd step 2` as available; do not start it.

Under the linked closing rules and [commit boundary](../../../docs/instructions/implementation/cycle.md#commits),
this skill writes no `task.md` or `implementation.md`, commits nothing and invokes no planning loop.
