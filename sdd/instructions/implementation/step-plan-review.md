# Plan review

The lead and applicable specialist reviewers check `task.md` and `implementation.md` against `grill.md`, the
conventions and relevant existing implementations. They produce a review of the proposed design, its
completeness and the planned way to verify it.

## Lead and inputs

- **sdd.plan-review.17.** Identify the named task, otherwise the task matching the current branch,
  otherwise the sole task with step 2 open; ask if absent or ambiguous before proceeding. Once the task is
  known, require `grill.md` and the draft plan documents except recorded waivers under sdd.step2.9.
  A missing ledger is incomplete initialization: report it and stop without recreating it.
  If both plan documents are waived, there is no proposed design to review; report that and stop.
  An unfinished initial grill needs
  `sdd-grill`; a missing unwaived plan needs `sdd-plan`. Name that prerequisite and stop, without writing it.
  Read applicable conventions from the project's workspace map; report
  unavailable evidence and its effect on coverage rather than inventing project rules.
- **sdd.plan-review.1.** The lead prepares from `grill.md`, the required plan documents under sdd.plan-review.17, and the convention
  documents. Reviewers explore the relevant existing implementations and provide source evidence in their
  reviewer guides and reports.
- **sdd.plan-review.2.** The **plan-review-lead** is the agent executing this review. The lead assigns
  conventions, dispatches the reviewers, verifies their reports and writes the final
  document under [the independence rule](cycle.md#independent-reviews). Its reviewers are backend,
  devops, frontend, persistence, simplicity and tester. The lead returns the final document and summary;
  detailed reviewer work stays in its review context.
  The lead needs read/search, shell, report-writing and agent-management tools to perform this coordination.
- **sdd.plan-review.3.** Grill rows establish the user's decisions. Conventions establish the applicable
  design rules. Existing source establishes how related features work. Each reviewer reads these inputs
  in that order and selects the plan material relevant to its responsibilities.

## Outputs

Paths in this section are relative to the task folder. The assignment filename is `assignments.md`.

| File | Author | Contents |
|---|---|---|
| `plan-review/assignments.md` | Lead | Reviewer names and convention-to-reviewer assignments, created once and reused. |
| `plan-review/<reviewer>.md` | Reviewer | Reusable source guide under the shared template. |
| `plan-review<x>-<reviewer>.md` | Reviewer | Current findings and numeric severity counts, using the shared report template. |
| `plan-review<x>.md` | Lead | Verified current findings and numeric severity counts. |

`<reviewer>` names a role from the roster below. Select round `<x>` under [sdd.naming.1](cycle.md#naming).

## Preparation

- **sdd.plan-review.4.** When `plan-review/assignments.md` is absent, the lead reads the required inputs
  under sdd.plan-review.17 and the convention indexes and topics. It assigns conventions and writes the
  assignment file. When the file exists, it reads and reuses it. If an existing task has the legacy spelling
  `assigments.md`, move that preparation to the canonical filename and reuse it rather than creating a second
  set of assignments. Source exploration belongs to the reviewers.
- **sdd.plan-review.5.** The lead assigns each convention topic to one or more reviewers, recording the
  exact rule-file path and reviewer. A convention can appear in several rows with different reviewers.
  Each reviewer determines how the convention applies within its own responsibilities, as defined in its
  reviewer file.
  Naming, documentation and other cross-cutting conventions are assigned within the same six reviewers.
- **sdd.plan-review.6.** On its first dispatch, each reviewer scans existing implementations relevant to
  its responsibilities and creates `plan-review/<reviewer>.md`. Follow the
  [source-guide template](templates/source-guide.md), then produce the round report. The guide helps future
  reviewers find the relevant files; findings are recorded in the round reports.
- **sdd.plan-review.7.** Later fresh reviewers start from their saved source guides. They read the current
  assigned rules, plan passages and relevant source at those locations. Targeted reads follow changed calls
  or new references in the plan. This reuses the initial exploration while keeping the review grounded in
  current evidence.

The saved files are navigation aids, not cached evidence or verdicts. Repair stale source paths and add
newly relevant sources as the plan changes. Preserve applicable convention assignments; assign newly
introduced convention topics without repeating the original preparation.

Produce preparation from the [assignments](templates/assignments.md) and
[source-guide](templates/source-guide.md) templates. Their COMMENTS blocks own the output guidance.

## Reviewers

The detailed responsibilities live in each agent definition:

| Reviewer | Definition |
|---|---|
| backend | [sdd-plan-review-backend](../../../.agents/agents/sdd-plan-review-backend.md) |
| devops | [sdd-plan-review-devops](../../../.agents/agents/sdd-plan-review-devops.md) |
| frontend | [sdd-plan-review-frontend](../../../.agents/agents/sdd-plan-review-frontend.md) |
| persistence | [sdd-plan-review-persistence](../../../.agents/agents/sdd-plan-review-persistence.md) |
| simplicity | [sdd-plan-review-simplicity](../../../.agents/agents/sdd-plan-review-simplicity.md) |
| tester | [sdd-plan-review-tester](../../../.agents/agents/sdd-plan-review-tester.md) |

- **sdd.plan-review.8.** Each reviewer selects relevant plan material and applies its assigned conventions, including TypeScript
  examples, names and proposed file locations. The lead dispatches applicable reviewers using their reviewer definitions
  and the current plan: a role applies when the plan touches any responsibility in its definition.
  Apply the [assignment template](templates/assignments.md) to record current applicability.
  An inapplicable role is not missing coverage.
  Simplicity and tester apply to every
  plan. Devops applies when operational behavior is involved, including configuration delivery.
  Reassess applicability each round; persistent assignments do not freeze which reviewers are needed.
- **sdd.plan-review.9.** Each reviewer selects the parts of every assigned convention relevant to its own
  responsibilities and checks those against the plan. Other reviewers apply shared conventions to their own responsibilities.
  Return shared concerns and their evidence to the lead using the report template's guidance.

## Review round

- **sdd.plan-review.10.** The lead selects the next round and its output paths using the Outputs section.
  Existing report numbers and contents are preserved.
- **sdd.plan-review.11.** The lead dispatches fresh reviewers with their full definition, task-folder and
  `grill.md` paths, required plan-document paths, round label, saved assignment, source-guide path,
  assigned convention paths, other dispatched reviewers and exact report output. It waits
  for every dispatched report and source guide. Dispatch in batches when concurrency limits require it.
  If a reviewer fails, returns no report or cannot be reached, replace that role once when the work is still
  possible; otherwise finish with explicit incomplete coverage. Never wait indefinitely for an unavailable
  reviewer or treat its absence as a clean result. A replacement may use an assigned report path only when
  that file does not exist. Preserve partial reports using the follow-up rule in
  sdd.plan-review.13. Each reviewer's work consists of reading, source exploration
  on first dispatch, and writing its guide/report.
  Review current inputs before consulting previous verdicts; earlier findings do not replace evidence.
  If independent agents cannot be dispatched, report that limitation and incomplete coverage; the lead never
  fabricates specialist reports or calls its own read an independent review. Once a round starts, unavailable
  review capability still produces the final report with explicit incomplete coverage.
- **sdd.plan-review.12.** Reviewers form findings from current inputs and source evidence and produce the
  [shared report template](templates/report.md), following its COMMENTS guidance.
- **sdd.plan-review.13.** The same lead reads every report and verifies every finding against the required
  plan documents, `grill.md`, the conventions and the reviewers' source evidence. It checks the location,
  factual basis and severity, plus complete ledger coverage, documentation integrity, every convention assignment,
  reviewers' source evidence and reported limits, reasons for skipped reviewers and shared concerns.
  Request missing evidence from the original reviewer, or dispatch a fresh agent in that same role with its
  guide and current inputs if unavailable. For follow-up, request the evidence in its reply; do not assign
  an existing report as a fresh output file. The lead adds needed clarification to the relevant finding
  before finalizing the round. Unresolved gaps remain incomplete coverage. Verification and excluded claims need
  no separate audit narrative in the final report.
- **sdd.plan-review.14.** The lead writes the final document, merging duplicate findings.
  It preserves material disagreements in the finding's reason when they
  cannot be resolved by evidence. Freeze current findings before consulting the newest previous final review,
  then check whether earlier defects still exist. Report current problems once; omit resolved-finding histories.
- **sdd.plan-review.15.** Cleanliness follows [sdd.cycle.5](cycle.md#review-cleanliness). Coverage gaps and unresolved plan questions are stated
  explicitly. Questions also receive a row in `open-questions.md`. The lead reports the final document and
  its coverage status and cleanliness under the linked rule and report template.
  An open Proposal or Alternative is not automatically a defect. If an unanswered question exposes a defect,
  give it the severity of that consequence.
- **sdd.plan-review.16.** Findings go to step 2 under
  [sdd.step2.10](step-2-settle.md#disposing-of-a-plan-review). A new authorized round reuses the assignment
  and source guides against the updated plan. The lead provides the final report and coverage status for
  the step-2 disposition work. Each invocation runs one round; a further round needs its own request.
- **sdd.plan-review.18.** The lead and specialists write only the current round's reports and persistent
  plan-review preparation; the lead also records relevant `open-questions.md` rows. They do not edit the plan, ledger
  or implementation, dispose their own findings, request settlement confirmation, commit or push. The lead writes the
  review's progress entry under [sdd.progress.6](cycle.md#progressmd): it closes the open step-2 entry, opens its
  own and closes it under the [progress template](templates/progress.md).

## Final document

Produce specialist and final reports from the [shared report template](templates/report.md).
Its Summary contains numeric severity counts only. Return coverage status separately under sdd.plan-review.15.
