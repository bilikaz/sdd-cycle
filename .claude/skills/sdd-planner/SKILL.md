---
name: sdd-planner
description: Coordinates an explicitly requested drafting and plan-review loop for an existing task. Defaults to five review dispatches, then prioritizes outstanding choices. Presents actual documents for confirmation before settlement; builds nothing.
---

# sdd-planner

Run [sdd-plan's procedure](../sdd-plan/SKILL.md) yourself and delegate independent reviews to fresh
[sdd-plan-review](../sdd-plan-review/SKILL.md) leads. Drafting, user questions and confirmation stay here.
This file owns the loop and its stops.

## Entry and resume

- Require the user's request for this role or its loop. A single-step request or an agent's own invocation
  supplies no delegation; otherwise name `sdd-plan` and stop.
- Read [the cycle](../../../sdd/instructions/implementation/cycle.md) and
  [step-2 entry](../../../sdd/instructions/implementation/step-2-settle.md#entry).
  Satisfy prerequisites before any write. An unfinished initial grill names `sdd-grill` and stops;
  after implementation begins, require explicit human re-settlement.
- Record delegation as a verbatim G-row in grill.md and maintain Planner run in the task's report.md under the
  [report template](../../../sdd/instructions/implementation/templates/report.md).
  You own the step-2 progress entry; reviewers do not.
- Default to **five review dispatches per delegated run**, unless the user instructs another limit.
  Start a new run at zero; resume an active run's saved count. Increment before dispatch, including
  replacement leads and confirmation rechecks. Record the in-flight lead/report so a resumed session can
  identify it. Read reports/dispositions under sdd.step2.10; do not repeat completed work merely on resume.
  An unreachable in-flight lead follows Review failure below.

## Draft and review

Draft from the ledger under step 2 and the
[implementation template](../../../sdd/instructions/implementation/templates/implementation.md).
Delegate each review to a fresh lead with the task path and current documents.
Read its verified report. As the plan's fixer, check relevant current material while applying corrections
under [sdd.cycle.6](../../../sdd/instructions/implementation/cycle.md#finding-verification).
Append dispositions under sdd.step2.10.

Apply factual corrections as one batch, then review the changed documents once, within the run limit.
Do not review each individual edit or re-review unchanged documents already clean after valid dispositions.
Never reject a real defect, hide a known error as an optional choice, or make implementation checkpoints.

Handle Proposals and Alternatives under their template COMMENTS guidance:
a valid open choice with one consistent option in the body can wait for presentation.
A decision needed to continue drafting or remove a genuine defect goes to Guidance.
Ask no decision questions between review waves.

## Stops

- **Clean:** current documents satisfy
  [sdd.cycle.5](../../../sdd/instructions/implementation/cycle.md#review-cleanliness).
  Proceed to presentation.
- **Limit:** stop dispatching at the configured limit. Prioritize presenting and resolving the Proposals
  and Alternatives gathered so far, then identify remaining findings. Do not automatically start another
  correction wave. If the current documents are reviewed and clean, proceed to confirmation.
  If user rulings change them, record/apply those rulings and hand back the outstanding review.
  Further dispatch needs the user's instruction to continue or extend the limit.
- **Guidance:** a decision prevents a consistent draft or leaves a genuine defect unresolved.
  Record it in the register with what it blocks and hand it back before another dispatch.
  A valid open Proposal or Alternative alone is not this stop.
- **Cycling:** the same defects recur without progress or fixes reverse one another.
  Hand back the issue and needed ruling; valid alternatives belong in the template's choice sections.
- **Review failure:** return a repairable coverage gap to the original lead under sdd.cycle.6;
  this is follow-up, not another dispatch or another source-verification pass.
  A failed, unreachable or nonresponsive lead gets one counted replacement within the limit if review
  remains possible. If no report can be obtained, or the lead reports unavailable evidence/capability,
  hand back the gap. Never call incomplete coverage clean or wait indefinitely for an unavailable lead.

On hand-back, persist unresolved choices/findings in the plan or register and link them in the reply.
Mark the run handed-back and leave step 2 current; no separate occasion entry under
[sdd.progress.5](../../../sdd/instructions/implementation/cycle.md#progressmd).
Waiting for choices or document confirmation keeps the run active.
Hand-back or settlement ends the run. A later user instruction to continue starts a new allowance;
an answer to a pending question alone does not authorize another review loop.

## Present and settle

1. Present outstanding Proposals and Alternatives and ask about each separately. A choice ruling is not
   final document confirmation. Record rulings in `grill.md`, apply them and remove resolved choices.
2. If rulings change the documents, review the batch within the remaining allowance.
   At the limit, hand back the changed, unreviewed documents; never settle them on the old verdict.
   A clean confirmation recheck continues to item 3 without reasking resolved choices.
3. Present the actual documents and settlement paths under sdd.step2.5–6, honoring recorded waivers.
   Only the user's confirmation that the presented documents cover the ledger authorizes settlement.
4. Mark the run settled, close step 2 and commit the canonical settlement paths under sdd.commit.1.
   If the commit fails, restore active run/progress state and report incomplete settlement.
   Otherwise report settlement and stop.

An edit after presentation needs the same review and presentation checks before confirmation.
Never build, deliver, push or reopen a built task's plan without explicit human re-settlement.
