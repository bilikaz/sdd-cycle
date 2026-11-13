---
name: sdd-grill
description: Runs sdd step 1 for an initialized task, recording interview answers or documented-bug citations in grill.md. Use for the initial grill, resuming step 1 or an explicitly requested re-grill. New questions arising inside step 2 remain with step 2. Task creation belongs to sdd-new-task.
---

# sdd-grill — `sdd step 1`

Read and follow [the grilling procedure](../../../sdd/instructions/implementation/step-1-grilling.md),
[cycle.md](../../../sdd/instructions/implementation/cycle.md) and
[workspace.md](../../../sdd/workspace.md).

## Entry

Identify the task and verify initialization under the procedure's
[Entry](../../../sdd/instructions/implementation/step-1-grilling.md#entry).
Open step 1 if it has not run; resume a current entry. A request to grill again opens a new occurrence;
bare continuation after a done grill reports it done and stops. Never reopen completed progress.
A missing task names `sdd-new-task` and stops; incomplete records or mismatched branch information
are reported for direction. Create no folder, branch or replacement records here.
Questions within a running step 2 stay with step 2 without closing its progress entry.

## Work and close

- Follow the [two doors](../../../sdd/instructions/implementation/step-1-grilling.md#two-doors),
  [interview](../../../sdd/instructions/implementation/step-1-grilling.md#the-interview) and
  [answer-ledger rules](../../../sdd/instructions/implementation/step-1-grilling.md#grillmd--the-answer-ledger).
- Record setup answers in `grill.md` as the procedure's Entry requires; step 2 populates `workspace.md`.
- Handle unanswerable questions under
  [sdd.register.1–3](../../../sdd/instructions/implementation/cycle.md#registers).
  A deferrable register row need not block close. A required unanswered choice keeps step 1 current;
  name it and wait under sdd.step1.16.
- Close only under [sdd.step1.16–17](../../../sdd/instructions/implementation/step-1-grilling.md#closing):
  close the step-1 entry using the progress template and give the completion report defined there, then wait.
  Name `sdd-plan` / `sdd step 2` as available; do not start it.

Under the linked closing rules and [commit boundary](../../../sdd/instructions/implementation/cycle.md#commits),
this skill writes no `task.md` or `implementation.md`, commits nothing and invokes no planning loop.
