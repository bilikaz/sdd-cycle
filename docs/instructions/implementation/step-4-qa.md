# sdd step 4 — QA

A fresh QA lead checks built work against settled scope through three independent specialists.
The lead verifies their reports and writes one final report for step 3.

## Lead and inputs

- **sdd.step4.1.** The qa-lead and its code-review, conventions and drift specialists follow
  [the independence rule](cycle.md#independent-reviews). One round per invocation.
- **sdd.step4.2.** Reviewers report rather than fix, dispose, commit, push or route.
  The lead writes preparation/final reports, the shared map and register. Specialists write only their
  assigned guide and report. Standalone, the lead opens/resumes and closes step-4 progress under
  [the progress rules](cycle.md#progressmd); under sdd-implementer, progress owner is the coordinator and
  the lead writes no progress entry.
- **sdd.step4.5.** Identify the named task, otherwise the unambiguous built task from progress and branch
  context; ask if ambiguous. Require built work and settled inputs, honoring recorded document waivers.
  Establish built work from the task's implementation record and current source, including committed work;
  a closed step-3 entry or nonempty map alone is not a universal prerequisite or proof. Without task
  implementation, name step 3 and stop before writing a round under sdd.cycle.2.
  Read progress, grill, required task/implementation documents, approved evolution and applicable standing
  documents. Report other missing evidence and its effect on coverage.

## Outputs

Paths are relative to the task folder.

| File | Author | Contents |
|---|---|---|
| `changes.md` | Script, invoked by lead | Shared inventory under the [changes protocol](changes.md). |
| `qa/assignments.md` | Lead | Agent roster and convention assignments. |
| `qa/<type>.md` | Specialist | Reusable source guide: paths and relevance, refreshed against current source. |
| `qa<y>-<type>.md` | Specialist | Current findings and numeric severity counts. |
| `qa<y>.md` | Lead | Verified findings and numeric severity counts. |

Types are code-review, conventions and drift. Select round `<y>` under [sdd.naming.1](cycle.md#naming).
Guides remain under `qa/`; round reports are in the task root.

## Preparation

- **sdd.step4.14.** Refresh the map with every changed root and its original starting commit.
  Reuse `qa/assignments.md`, updating newly applicable rules. Run all three lanes;
  each covers all material applicable to its responsibilities. A lane with no applicable material explains
  why in its reply to the lead.
- **sdd.step4.15.** Give each specialist its definition, task/settled/grill/evolution paths,
  assigned rules, shared change-map path, other agents, source-guide path and exact report path.
  It explores relevant source on first dispatch and reuses and refreshes navigation thereafter.
  The map locates material; ranges neither prove behavior nor limit investigation.

Use the plan-review preparation mechanics, with QA's paths above. Produce files from the
[assignments](templates/assignments.md) and [source-guide](templates/source-guide.md) templates.

## The three agents

| Type | Definition |
|---|---|
| code-review | [sdd-qa-code-review](../../../.agents/agents/sdd-qa-code-review.md) |
| conventions | [sdd-qa-conventions](../../../.agents/agents/sdd-qa-conventions.md) |
| drift | [sdd-qa-drift](../../../.agents/agents/sdd-qa-drift.md) |

- **sdd.step4.3.** Dispatch all three in fresh contexts, in batches if necessary. Wait for their guides
  and reports. Handle unavailable agents and follow-up evidence under
  [sdd.plan-review.11 and .13](step-plan-review.md#review-round) for dispatch recovery and follow-up only;
  missing independent coverage is never clean. An unavailable specialist still leaves a final report naming the gap.
- **sdd.step4.4.** Each agent writes its assigned guide and report, including a report with no findings.
  Follow the report template and return shared concerns with evidence to the lead.
- **sdd.step4.6.** Drift traces requirements as modified by approved evolution through the built work, including missing
  implementation. Code-review examines behavior and dependencies; conventions checks exercised rules and terms.
  Each chooses relevant material from the map and task records under [sdd.changes.6](changes.md#the-report).
  Read relevant source and targeted diffs rather than loading unrelated patches.

## Review round

- **sdd.step4.7.** Prepare, dispatch, verify and compose current findings before consulting the newest previous
  final QA. Check earlier findings against current evidence; report current defects once and omit resolved
  histories. Look for answers in the record before registering unanswered questions. Task-identification questions are allowed at entry;
  questions about the reviewed work go to the register, not a user interview.
- **sdd.step4.8.** Ground findings in current source or exact settled requirements. Quote only what helps
  locate or explain the defect. Missing work needs the requirement and evidence of its absence.
- **sdd.step4.9.** Do not retain a question already answered by the settled documents, grill, evolution or instructions.
- **sdd.step4.16.** The lead verifies each finding's location, factual basis, applicable rule and severity;
  checks overall role/rule coverage and shared concerns; and obtains missing evidence from the responsible agent.
  Merge duplicates and omit unsupported claims. Material unresolved disagreements belong in the finding's reason.
  Follow map freshness under [sdd.changes.6](changes.md#the-report).
  Verification needs no separate audit narrative. Cleanliness follows [sdd.cycle.5](cycle.md#review-cleanliness).

## The QA document

- **sdd.step4.10.** Severity is **blocker** (broken behavior, or a violated settled rule with real
  consequence), **major** (a genuine defect), or **warning** (a rule broken with limited consequence, or a
  hazard no rule names).
- **sdd.step4.11.** Explain why a finding is wrong using the applicable rule, ruling or specific security/logical
  hole. Bare preference is not a finding.
- **sdd.step4.12.** Produce specialist and final reports from the
  [shared report template](templates/report.md), following its COMMENTS guidance.
  Record unanswered review questions in the register; origin and approved changes follow
  [evolution](escalation.md).

## Closing

- **sdd.step4.13.** Return the final path, summary, coverage status and cleanliness. Close the step-4 entry
  unless the coordinator owns progress. Run only this round; findings go to
  [step 3](step-3-implement.md#disposing-of-a-qa-round-or-a-review).
