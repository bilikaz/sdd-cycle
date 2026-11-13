---
name: sdd-plan
description: "Runs sdd step 2 for an existing task: drafts the required plan documents and commits their settlement on user confirmation. Use for planning, resuming step 2 or explicit human re-settlement. Delegated planning uses sdd-planner; task creation uses sdd-new-task."
---

# sdd-plan — `sdd step 2`

Read and follow [the step-2 procedure](../../../sdd/instructions/implementation/step-2-settle.md).
Draft from the resolved ledger or an explicit human instruction to re-settle, following
[the escalation rules](../../../sdd/instructions/implementation/escalation.md).
The related coordinating role is [sdd-planner](../sdd-planner/SKILL.md); a single-step request delegates no loop.

## Entry and reads

- Satisfy every [sdd.step2.11 entry check](../../../sdd/instructions/implementation/step-2-settle.md#entry),
  including prerequisites, task branch, progress entry and the active planner's ownership.
  After implementation begins, only explicit human re-settlement reopens step 2.
- Read [cycle.md](../../../sdd/instructions/implementation/cycle.md) and the task's records required by
  that entry, then [workspace.md](../../../sdd/workspace.md) and relevant available project rules.
- Produce documents from the [task](../../../sdd/instructions/implementation/templates/task.md) and
  [implementation](../../../sdd/instructions/implementation/templates/implementation.md) templates,
  following their COMMENTS guidance.

## Draft and review

- New decisions surfacing during planning follow
  [sdd.step2.11](../../../sdd/instructions/implementation/step-2-settle.md#entry);
  their answers join the living ledger under
  [sdd.step1.15](../../../sdd/instructions/implementation/step-1-grilling.md#grillmd--the-answer-ledger).
  If the initial grill is unfinished, name `sdd-grill` and stop before any write.
- Draft or revise the existing documents under [step 2](../../../sdd/instructions/implementation/step-2-settle.md),
  honoring only user-approved
  [sdd.step2.9 waivers](../../../sdd/instructions/implementation/step-2-settle.md#the-confirmation-and-the-commit).
- Populate [workspace setup under sdd.step2.12](../../../sdd/instructions/implementation/step-2-settle.md#entry).
  Read the relevant review rounds and dispose findings under
  [sdd.step2.10](../../../sdd/instructions/implementation/step-2-settle.md#disposing-of-a-plan-review).
  With no report, skip disposal. Standalone planning starts no review of its own.
  A requested review needs a fresh `sdd-plan-review` lead; never become the reviewer of your own plan.
  A delegated loop needs the user's request for `sdd-planner`.

## Confirm and close

Follow [sdd.step2.5–6](../../../sdd/instructions/implementation/step-2-settle.md#the-confirmation-and-the-commit):
resolve open choices, then present the updated task documents with the exact
[settlement paths](../../../sdd/instructions/implementation/cycle.md#commits).
Only the user's word that the presented documents cover the ledger confirms them; a nod at a summary does not.
On that confirmation, close the step-2 entry, commit those paths,
report settlement and stop.
Without confirmation, leave step 2 current and commit nothing. Apply new rulings, present updated documents
again, then wait for confirmation. If the settlement commit fails, report it and keep step 2 current.

This skill neither builds nor pushes. Reviewer suggestions do not replace user rulings.
