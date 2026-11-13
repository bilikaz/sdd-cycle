---
name: sdd-implement
description: Runs sdd step 3 to build settled task work or fix QA/review findings, run configured gates and update standing documents. Independent QA and code review belong to sdd-qa and sdd-review; delivery belongs to sdd-commit.
---

# sdd-implement — step 3

Read [step 3](../../../sdd/instructions/implementation/step-3-implement.md),
[testing](../../../sdd/instructions/implementation/testing.md) and
[evolution](../../../sdd/instructions/implementation/escalation.md).
Follow step-3 entry for task selection, landed settlement or recorded waiver, and progress ownership.
Read progress, grill, required plans, approved evolution and applicable standing documents.
When fixing findings, read the returning report; ask if that selection is ambiguous.

Missing settlement or a missing/mismatched task branch is a prerequisite gap: report it and stop,
without opening planning, creating a branch or switching away. Under sdd-implementer, return results
to the coordinator and do not write progress; otherwise open/resume and close the step-3 entry yourself.

## Work

- Resolve actual roots, execution environment and gates from
  [workspace.md](../../../sdd/workspace.md).
  Before a root's first edit, record its original starting commit under
  [sdd.changes.1](../../../sdd/instructions/implementation/changes.md#generate); retain it on re-entry.
- Take required pre-wave checkpoints under
  [sdd.commit.4](../../../sdd/instructions/implementation/cycle.md#commits) before editing.
- Build to the original plan plus approved evolution. Check current source when fixing and append dispositions
  using [the report's Dispositions section](../../../sdd/instructions/implementation/templates/report.md#dispositions).
  Every returning finding gets a disposition.
- Keep plans frozen. Record adjustments and agent/person origin under the evolution rules.
  Only explicit human re-settlement reopens step 2.
- Test representative behavior under
  [sdd.testing.37](../../../sdd/instructions/implementation/testing.md#the-checks).
  Run each changed root's full gate and configured supplemental checks in its selected environment.
  Unconfigured, failed or unavailable required checks leave implementation incomplete; report the cause.
- Update affected standing documents. New standing rules need approval.
  Produce the implementation tables from the
  [progress template](../../../sdd/instructions/implementation/templates/progress.md#parts);
  its section COMMENTS supply the output guidance.

Never claim unrun checks as passing or reject a real defect.
No delivery or push here. Undo checkpoints under sdd.commit.5 only when handing back to the user;
under delegation the coordinator handles that at the loop's hand-back, not after each fixer return.
Preserve settlement commits and working files.

Running this skill alone does not delegate [sdd-implementer](../sdd-implementer/SKILL.md).
