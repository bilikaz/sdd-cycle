---
name: sdd-implementer
description: Coordinates an explicitly delegated implementation, QA and built-code review loop with a retained fixer and fresh leads. No total cycle cap; recurring QA loops stop for guidance. Delivery remains sdd-commit.
---

# sdd-implementer

Coordinate the existing steps under [the cycle](../../../docs/instructions/implementation/cycle.md).
The routing and stopping rules below belong to this role.

## Entry and resume

Require the user's request for this role or its loop. A single-step request or an agent's own invocation
does not delegate the loop; without delegation, name `sdd-implement` and stop.
Select the task under [step-3 entry](../../../docs/instructions/implementation/step-3-implement.md#entry),
including its settlement or recorded waiver.

Record delegation as a verbatim G-row in grill.md and maintain Implementer run in the task's report.md using the
[report template](../../../docs/instructions/implementation/templates/report.md).
Resolve roots, task branches, original starting commits, environment and gates from the task and
[workspace.md](../../../docs/instructions/workspace.md).
On resume, read progress, the saved run and returned reports. Continue pending work rather than repeating
completed rounds. A still-running dispatch needs a reachable agent; an unreachable one follows recovery below.

## Loop

1. Delegate the build or pending findings to a separate fixer using [sdd-implement](../sdd-implement/SKILL.md).
   Give it the task, returning report, original starting commits, execution boundary and
   **progress owner: coordinator**. Retain it across fix rounds; hand off context if it becomes unavailable.
   The fixer takes pre-wave checkpoints; it does not undo them when returning to you.
2. Only a completed implementation with passing required verification proceeds to a fresh
   [sdd-qa](../sdd-qa/SKILL.md) lead. An incomplete result stays with the fixer when it can address the cause;
   missing prerequisites or required decisions go to the user. Do not dispatch QA to disguise failed gates.
   If the fixer cannot complete or returns the same unresolved cause without progress, hand that cause
   back instead of repeatedly dispatching an incomplete build.
3. Failed QA returns to the retained fixer, subject to the QA-loop stop below.
   Clean QA proceeds to a fresh [sdd-review](../sdd-review/SKILL.md) lead.
4. Failed code review returns to the fixer, then QA runs again before code review.
   Return when QA and the code review following it are clean under
   [sdd.cycle.5](../../../docs/instructions/implementation/cycle.md#review-cleanliness).

Give leads the task, execution boundary, original starting commits and **progress owner: coordinator**;
give the code-review lead the QA report path and its lead's returned cleanliness/coverage status.
Leads prepare the map, dispatch specialists and verify.
Route the verified final result without another source investigation under
[sdd.cycle.6](../../../docs/instructions/implementation/cycle.md#finding-verification).
The fixer checks current source and owns dispositions.

## Stops and recovery

There is no total implementation-cycle or QA-failure limit. Track QA rounds involving the same recurring
problem or fixes repeatedly recreating the same issue cycle. Unrelated failures do not share a counter,
even when ten QA rounds fail in a row. Identify the loop from the returned reports and fixer's results;
do not repeat their source investigation.
A defect still present after its claimed fix remains unfinished fixer work and returns to that fixer.

For the same issue cycle:

**QA round 1 → retained fixer → QA round 2 → retained fixer → QA round 3 → stop.**

At the third QA round in that recurring loop, stop before another fix or code review and ask for guidance.
Name the issue, attempted fixes and why the same cycle keeps recurring. Preserve the loop's issue,
count and QA report references across resume; never carry its count over to a different problem.
Code-review reports and the total number of QA failures are not this counter.

An unreachable fixer or lead gets one replacement when its work can still be done; otherwise hand back.
A missing report, a dispatch that stops responding or an unrepairable coverage gap is not a clean result.
Return repairable gaps to the original lead; if evidence or capability remains unavailable, report it to
the user rather than repeatedly dispatching the same unavailable work.

A required decision pauses dependent work. Record it in the register and hand it back.
Plan adjustments follow [evolution](../../../docs/instructions/implementation/escalation.md),
with agent/person origin; only explicit human re-settlement reopens step 2.

## Progress and hand-back

You own progress. Open/resume step entries and close each before moving to the next under
[the progress rules](../../../docs/instructions/implementation/cycle.md#progressmd).
Reread progress immediately before writing; delegated fixers and leads do not write it.
Use the [progress template](../../../docs/instructions/implementation/templates/progress.md).
Return the outcome, final reports, actual limits and decisions needed, linking existing detail.

Mark the run handed-back and handle local checkpoints under
[sdd.commit.5](../../../docs/instructions/implementation/cycle.md#commits) only when returning to the user.
Preserve settlement commits. Never freeze defects out of review or deliver from this role.
