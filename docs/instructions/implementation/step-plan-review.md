# Plan review

The lead and six specialist reviewers check `task.md` and `implementation.md` against `grill.md`, the
conventions and relevant existing implementations. They produce a review of the proposed design, its
completeness and the planned way to verify it.

## Lead and inputs

- **sdd.plan-review.1.** The lead prepares from `grill.md`, `task.md`, `implementation.md` and the convention
  documents. Reviewers explore the relevant existing implementations and provide source evidence in their
  reviewer guides and reports.
- **sdd.plan-review.2.** The **plan-review-lead** is the agent executing this review. The lead assigns
  conventions, dispatches the reviewers, verifies their reports and writes the final
  document. It works in a fresh review context separate from the plan author. Its reviewers are backend,
  devops, frontend, persistence, simplicity and tester. The lead returns the final document and summary;
  detailed reviewer work stays in its review context.
- **sdd.plan-review.3.** Grill rows establish the user's decisions. Conventions establish the applicable
  design rules. Existing source establishes how related features work. Each reviewer reads these inputs
  in that order and judges its assigned parts of the plan against them.

## Outputs

Paths in this section are relative to the task folder. The assignment filename is `assigments.md`.

| File | Author | Contents |
|---|---|---|
| `plan-review/assigments.md` | Lead | Reviewer names and convention-to-reviewer assignments, created once and reused. |
| `plan-review/<reviewer>.md` | Reviewer | File paths with 2–3 sentences explaining each file's relevance, created on first dispatch and reused. |
| `plan-review<x>-<reviewer>.md` | Reviewer | That reviewer's findings for the current round, proposed fixes, summary and shared concerns. |
| `plan-review<x>.md` | Lead | Verified and combined findings from all reviewers, coverage, reasons for excluded claims and follow-up on the previous round. |

`<reviewer>` is backend, devops, frontend, persistence, simplicity or tester. `<x>` is empty for the first
round, then `2`, `3` and so on. The lead selects the next round from existing report names and supplies each
reviewer its exact output path.

For example, the first backend report is `plan-review-backend.md` and its final review is `plan-review.md`.
The second round produces `plan-review2-backend.md` and `plan-review2.md`. Each round has its own reports;
the assignment and source guides are reused across rounds.

## Preparation

- **sdd.plan-review.4.** When `plan-review/assigments.md` is absent, the lead reads `grill.md`, `task.md`,
  `implementation.md`, the convention indexes and their topics. It assigns conventions and writes the
  assignment file. When the file exists, it reads and reuses it. Source exploration belongs to the reviewers.
- **sdd.plan-review.5.** The lead assigns each convention topic to one or more reviewers, recording the
  exact rule-file path and reviewer. A convention can appear in several rows with different reviewers.
  Each reviewer determines how the convention applies within its own responsibilities, as defined in its
  reviewer file.
  Naming, documentation and other cross-cutting conventions are assigned within the same six reviewers.
- **sdd.plan-review.6.** On its first dispatch, each reviewer scans existing implementations relevant to
  its responsibilities and creates `plan-review/<reviewer>.md`. Each entry contains a file path and 2–3 sentences
  explaining why that file is relevant to the plan. It then produces its round report. The guide helps future
  reviewers find the relevant files; findings are recorded in the round reports.
- **sdd.plan-review.7.** Later fresh reviewers start from their saved source guides. They read the current
  assigned rules, plan passages and relevant source at those locations. Targeted reads follow changed calls
  or new references in the plan. This reuses the initial exploration while keeping the review grounded in
  current evidence.

The assignment file uses:

```md
# Plan-review assignments

## Reviewers
- backend
- devops
- frontend
- persistence
- simplicity
- tester

## Convention assignments
| Convention file | Reviewer |
```

Each reviewer's source guide uses:

```md
# Plan-review source guide — <reviewer>

## Sources
| File | Why it is relevant |
```

## Reviewers

| Reviewer | Reviews |
|---|---|
| backend | Service/worker design, dependency injection, configuration, API contracts, failure paths and reuse of existing behavior. |
| devops | Configuration delivery, containers, networking, deployment, CI, startup, rollout and recovery where the plan touches them. |
| frontend | User flows, UI states, existing components, navigation, client/server contracts and destructive actions. |
| persistence | Complete stored shapes, identities, indexes, queries, grants, transactions, migrations and object/index lifetimes. |
| simplicity | The need for each mechanism, reuse, abstraction, duplication, removal of superseded paths and cost relative to the ruled scope. |
| tester | Acceptance checks, proposed tests, failure scenarios, fixtures, test boundaries and required gates. |

- **sdd.plan-review.8.** Each reviewer reviews its assigned plan material and conventions, including TypeScript
  examples, names and proposed file locations. The lead dispatches applicable reviewers using their reviewer definitions
  and the current plan, recording the basis for each dispatch or skip. Simplicity and tester apply to every
  plan. Devops applies when operational behavior is involved, including configuration delivery.
- **sdd.plan-review.9.** Each reviewer selects the parts of every assigned convention relevant to its own
  responsibilities and checks those against the plan. Other reviewers apply shared conventions to their own responsibilities.
  Its Summary states any missing evidence or incomplete assigned checks. Shared concerns are sent to the lead
  with their evidence.

## Review round

- **sdd.plan-review.10.** The lead selects the next round and its output paths using the Outputs section.
  Existing report numbers and contents are preserved.
- **sdd.plan-review.11.** The lead dispatches fresh reviewers with their reviewer definition, task paths,
  saved assignment, source-guide path, assigned convention paths and exact report output. It waits
  for every dispatched report and source guide. Each reviewer's work consists of reading, source exploration
  on first dispatch, and writing its guide/report.
- **sdd.plan-review.12.** Reviewers form their findings from the current inputs and their source guides.
  Each finding quotes the plan passage verbatim and cites a convention, grill ruling or specific design
  gap. Reports use the reviewer example below and the [severity definitions](step-4-qa.md#the-qa-document). Each reviewer report
  contains Findings, Summary and any shared concerns for the lead.
- **sdd.plan-review.13.** The same lead reads every report and verifies every finding against `task.md`,
  `implementation.md`, `grill.md`, the conventions and the reviewers' source evidence. It checks the quote,
  factual basis, proposed remedy and
  severity. It also checks complete ledger coverage, documentation integrity, every convention assignment,
  reviewers' source evidence and reported limits, reasons for skipped reviewers and shared concerns. Its verification is recorded in the final
  document; excluded claims carry their reason and evidence. The responsible reviewer supplies any additional
  source investigation needed to support a finding.
- **sdd.plan-review.14.** The lead writes the final document. It merges duplicate findings with credit
  to all contributing reviewers and preserves explained disagreements. It uses the newest previous final
  review to trace earlier findings, checking each against the current plan and recording it as closed,
  stands or recurred. Current evidence supports both the new findings and the follow-up.
- **sdd.plan-review.15.** Cleanliness follows [sdd.cycle.5](cycle.md#review-cleanliness). Coverage gaps and unresolved plan questions are stated
  explicitly. Questions also receive a row in `open-questions.md`. The lead reports the final document and
  its coverage status. Info observations are retained in the report and do not require a plan correction or
  another review round; a clean result proceeds to the planner's document presentation and confirmation.
- **sdd.plan-review.16.** Findings go to step 2 under
  [sdd.step2.10](step-2-settle.md#disposing-of-a-plan-review). A new authorized round reuses the assignment
  and source guides against the updated plan. The lead provides the final report and coverage status for
  the step-2 disposition work.

## Reviewer report example

Example filename: `plan-review2-backend.md`.

```md
# Plan review — backend — round 2

## Findings
| # | severity | plan passage | why | proposed fix |
|---|---|---|---|---|
| 1 | <severity> | <file and quoted passage> | <rule or design gap, with evidence> | <proposed change> |

### Summary
<N blocker · N major · N warning · N info; any missing evidence or incomplete assigned checks>

## Shared concerns
<concerns for the lead, if any>
```

## Final document

```md
# Plan review — <task folder> — <file> — <date>

## Findings
| # | severity | reviewer(s) | plan passage | why | proposed fix | lead verification |

### Summary
<N blocker · N major · N warning · N info; complete or incomplete coverage>

## Excluded claims
| Reviewer finding | Reason and evidence |

## Follow-up from past reviews
<what closed · what stands · what recurred>
```
