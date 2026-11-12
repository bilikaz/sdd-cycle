# Built-code review

A fresh lead coordinates applicable specialists, verifies their findings and writes one
final report for step 3. Proposed-design review belongs to [plan review](step-plan-review.md).

## Lead and inputs

- **sdd.review.1.** Run on the user's request when built work exists. Identify the named task, otherwise the
  unambiguous built task from progress and branch context; ask if ambiguous. Establish actual task
  implementation from its record and current source, including committed work; map rows alone are not proof.
  Without built work, name step 3 and stop before writing a round.
- **sdd.review.2.** Under [delegated implementation](../../../.agents/skills/sdd-implementer/SKILL.md),
  code review follows clean QA. The delegation supplies the QA report path, its lead's returned
  cleanliness/coverage status and progress ownership. Use that status without repeating its investigation.
  Failed QA returns to the fixer.
  A standalone user-requested code review does not require a preceding QA round.
- **sdd.review.3.** Read progress, grill, required settled task/implementation documents, approved evolution
  and applicable standing documents. Honor recorded waivers; report missing evidence and its coverage effect.
  Refresh the shared [change map](changes.md).
- **sdd.review.5.** The review-lead and specialists follow [the independence rule](cycle.md#independent-reviews).
  It dispatches applicable roles, verifies their reports and composes the final document.
- **sdd.review.17.** Grill establishes user rulings; settled plans/evolution establish scope; conventions
  establish applicable rules. Existing code is evidence of a pattern, not authority to override those inputs.
- **sdd.review.10.** Judge built behavior and engineering quality. Settlement conformance is also covered
  by [QA's drift lane](step-4-qa.md#the-three-agents).

## Outputs

Paths are relative to the task folder.

| File | Author | Contents |
|---|---|---|
| `changes.md` | Script, invoked by lead | Shared file/line inventory. |
| `review/assignments.md` | Lead | Reviewer roster, convention assignments and skipped roles. |
| `review/<reviewer>.md` | Specialist | Reusable source paths and relevance. |
| `review<x>-<reviewer>.md` | Specialist | Current findings and numeric severity counts. |
| `review<x>.md` | Lead | Verified findings and numeric severity counts. |

- **sdd.review.4.** Select round `<x>` and exact paths under [sdd.naming.1](cycle.md#naming).

## Preparation

- **sdd.review.8.** Use the [plan-review preparation model](step-plan-review.md#preparation).
  Assign exact convention paths within the six roles, including documentation, naming and testing rules.
  Reuse assignments, adding newly applicable rules as scope changes.
- **sdd.review.9.** Determine applicable roles from their definitions and the task context.
  Each reviewer chooses its own relevant material under [sdd.changes.6](changes.md#the-report).
  Simplicity applies to every change, including documentation-only work; tester applies wherever tests or
  acceptance checks are affected. Domain roles cover standing documents relevant to their responsibilities;
  simplicity covers material with no other applicable role. A justified skipped role is not missing coverage.
  Record current applicability using the assignment template.
- **sdd.review.18.** Give each reviewer its definition, task/grill/settled/evolution paths,
  convention assignments, shared change-map path, other reviewers, source-guide path and exact
  report path. It explores relevant source on first dispatch, then reuses and refreshes the guide.
  A guide routes to current evidence; the map avoids loading unrelated source or full patches.

Produce preparation from the [assignments](templates/assignments.md) and
[source-guide](templates/source-guide.md) templates, using this workflow's output paths.

## Reviewers

Responsibilities live in the agent definitions.

| Reviewer | Definition |
|---|---|
| backend | [sdd-review-backend](../../../.agents/agents/sdd-review-backend.md) |
| devops | [sdd-review-devops](../../../.agents/agents/sdd-review-devops.md) |
| frontend | [sdd-review-frontend](../../../.agents/agents/sdd-review-frontend.md) |
| persistence | [sdd-review-persistence](../../../.agents/agents/sdd-review-persistence.md) |
| simplicity | [sdd-review-simplicity](../../../.agents/agents/sdd-review-simplicity.md) |
| tester | [sdd-review-tester](../../../.agents/agents/sdd-review-tester.md) |

## Review round

- **sdd.review.11.** Prepare and dispatch fresh applicable reviewers, in batches if needed.
  Wait for their guides/reports. Follow [sdd.plan-review.11 and .13](step-plan-review.md#review-round)
  for dispatch recovery and follow-up only. Missing independent coverage is never clean; the final report
  still names unavailable roles or evidence.
- **sdd.review.12.** Form findings from current source, rulings and applicable rules. Produce specialist
  reports from the [shared report template](templates/report.md). Return shared concerns with evidence to the lead.
- **sdd.review.13.** The lead verifies findings against current source, rulings and assigned rules.
  Check location, factual basis, severity, applicable file/rule coverage and shared concerns. Ask the responsible
  reviewer for missing evidence. Follow snapshot freshness under [sdd.changes.6](changes.md#the-report).
  Verification and excluded claims need no separate audit narrative.
- **sdd.review.14.** Merge duplicates, omit unsupported claims and rank defects by severity.
  Preserve material disagreements in the finding's reason. Freeze current findings before reading the newest
  previous final review, then check whether earlier defects remain. Report current defects once; omit resolved
  histories. Cleanliness follows [sdd.cycle.5](cycle.md#review-cleanliness).
- **sdd.review.16.** Retired, see sdd.review.13.

## Final document

Produce specialist and final reports from the [shared report template](templates/report.md), following
its COMMENTS guidance.

## Boundary and disposition

- **sdd.review.6.** The lead and specialists report; they never fix, dispose, commit or push.
  Specialists write only their assigned guide and report; the lead alone maintains assignments, the map,
  final report and register. Task-identification questions are allowed at entry; questions about reviewed
  work are registered. Look for answers before registering questions
  in `open-questions.md`. Severity follows the defect's consequence.
- **sdd.review.7.** Write no progress entry. The reports are this round's record; a standalone review can run
  with any step open.
- **sdd.review.15.** Return the final path, summary, coverage status and cleanliness.
  Findings go to [step 3](step-3-implement.md#disposing-of-a-qa-round-or-a-review), which appends dispositions
  without editing original findings. Each invocation runs one round.
