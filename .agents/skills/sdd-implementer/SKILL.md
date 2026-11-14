---
name: sdd-implementer
description: Coordinates an explicitly delegated implementation, QA and built-code review loop with a retained fixer and fresh leads. No total cycle cap; recurring QA loops stop for guidance. Delivery remains sdd-commit.
---

# sdd-implementer

Coordinate the existing steps under [the cycle](../../../sdd/instructions/implementation/cycle.md).
The routing and stopping rules below belong to this role.

## Entry and resume

Require the user's request for this role or its loop. A single-step request or an agent's own invocation
does not delegate the loop; without delegation, name `sdd-implement` and stop.
Select the task under [step-3 entry](../../../sdd/instructions/implementation/step-3-implement.md#entry),
including its settlement or recorded waiver.

Record delegation as a verbatim G-row in grill.md. Keep the run's state in the task's `report.md`: an
`## Implementer run` table — State (`active` · `handed-back`) · Fixer · Rounds · In flight — and under it a
`Reviews:` list, one line per returned QA or code-review report with its Summary counts. No step knows this file.
Resolve roots, task branches, original starting commits, environment and gates from the task and
[workspace.md](../../../sdd/workspace.md).
On resume, read progress, the saved run and returned reports. Continue pending work rather than repeating
completed rounds. A still-running dispatch needs a reachable agent; an unreachable one follows recovery below.

## Loop

1. Delegate the build or pending findings to a separate fixer using [sdd-implement](../sdd-implement/SKILL.md).
   Give it the task, returning report, original starting commits and execution boundary. Retain it across
   fix rounds; hand off context if it becomes unavailable.
   The fixer takes pre-wave checkpoints; tell it to keep them when returning to you, so they are undone only
   at your hand-back.
2. Only a completed implementation with passing required verification proceeds to a fresh
   [sdd-qa](../sdd-qa/SKILL.md) lead. An incomplete result stays with the fixer when it can address the cause;
   missing prerequisites or required decisions go to the user. Do not dispatch QA to disguise failed gates.
   If the fixer cannot complete or returns the same unresolved cause without progress, hand that cause
   back instead of repeatedly dispatching an incomplete build.
3. Failed QA returns to the retained fixer, subject to the QA-loop stop below.
   Clean QA proceeds to a fresh [sdd-review](../sdd-review/SKILL.md) lead.
4. Failed code review returns to the fixer, then QA runs again before code review.
   Return when QA and the code review following it are clean under
   [sdd.cycle.5](../../../sdd/instructions/implementation/cycle.md#review-cleanliness).

Give leads the task, execution boundary and original starting commits. Code review follows clean QA: give the
code-review lead the QA report path, and route only after its QA lead returned clean, complete coverage.
Leads prepare the map, dispatch specialists and verify.
Route the verified final result without another source investigation under
[sdd.cycle.6](../../../sdd/instructions/implementation/cycle.md#finding-verification).
The fixer checks current source and owns dispositions.

## Stops and recovery

There is no total implementation-cycle or QA-failure limit. A recurrence counter belongs to a concrete
defect that persists after an attempted fix or is recreated by a later fix. Before incrementing it,
validate issue identity against the verified reports and fixer's dispositions, and record a comparison
in the task's `report.md`:

| Evidence | Required comparison |
|---|---|
| Findings | Original and current QA report paths and finding numbers. |
| Defect identity | Concrete failing condition, violated behavior or obligation, and affected mechanism. |
| Attempted fix | The intervening correction and what it claimed to resolve. |
| Continuity | Verified evidence that the same defect persisted or that the correction recreated it; distinguish additional independent sites whose earlier fixes remain correct. |
| Verdict | Same recurring defect, independent finding, or identity not established; only the first increments that defect's counter. |

A shared rule, category, severity, component, filename or symptom does not establish defect identity.
For example, newly reported abbreviated variables at different sites are separate findings when the
previously cited names remain fixed; a shared naming rule does not join them into a recurring defect.
Unrelated failures keep separate counters, even when ten QA rounds fail in a row.
Use the returned verified evidence without repeating the source investigation. If identity or causal
continuity is unclear, ask the returning lead or retained fixer to clarify it before counting; missing
proof does not justify a recurrence stop or a request for user permission to continue ordinary routing.
A defect still present after its claimed fix remains unfinished fixer work and returns to that fixer.

For the same issue cycle:

**QA round 1 → retained fixer → QA round 2 → retained fixer → QA round 3 → stop.**

Before a third-round stop, revalidate that all three QA observations and both intervening fixes form
the same evidenced defect chain. Without that comparison, do not stop on recurrence grounds; route
independent findings through the normal loop. Other required decisions and blockers still apply.
When that chain is verified, stop before another fix or code review and ask for guidance, linking the
comparison and explaining why each attempted fix failed or recreated the defect. Preserve the defect's
identity, evidence, count and QA report references across resume; never transfer a count to a different
problem. Correct a misclassified counter and continue authorized routing rather than asking the user
to approve continuation of an unrelated finding.
Code-review reports and the total number of QA failures are not this counter.

An unreachable fixer or lead gets one replacement when its work can still be done; otherwise hand back.
A missing report, a dispatch that stops responding or an unrepairable coverage gap is not a clean result.
Return repairable gaps to the original lead; if evidence or capability remains unavailable, report it to
the user rather than repeatedly dispatching the same unavailable work.

A required decision pauses dependent work. Record it in the register and hand it back.
Plan adjustments follow [evolution](../../../sdd/instructions/implementation/escalation.md),
with agent/person origin; only explicit human re-settlement reopens step 2.

## Progress and hand-back

Every step writes its own progress entries under
[the progress rules](../../../sdd/instructions/implementation/cycle.md#progressmd): the fixer its step-3 entries,
each QA and code-review lead its review entry. You write only the hand-back occasion entry
([sdd.progress.5](../../../sdd/instructions/implementation/cycle.md#progressmd)), using the
[progress template](../../../sdd/instructions/implementation/templates/progress.md).
Return the outcome, final reports, actual limits and decisions needed, linking existing detail.

Mark the run handed-back and handle local checkpoints under
[sdd.commit.5](../../../sdd/instructions/implementation/cycle.md#commits) only when returning to the user.
Preserve settlement commits. Never freeze defects out of review or deliver from this role.
