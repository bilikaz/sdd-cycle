# Built-code review

The lead and six specialist reviewers examine the task's built changes against the user's rulings,
applicable conventions and relevant implementations. The lead prepares the assignments, verifies the
reviewer reports and writes the final document for step 3 to dispose of.

## Lead and inputs

- **sdd.review.1.** The review runs on the user's word when built work exists.
- **sdd.review.2.** Under delegated routing it closes the implementation/QA loop: a clean QA round is followed
  by built-code review. The loop ends when both are clean; info findings are carried to the hand-back
  ([sdd-implementer](../../../.agents/skills/sdd-implementer/SKILL.md)). The implementer delegates
  the whole round to a fresh lead with tools to dispatch its own reviewers.
- **sdd.review.3.** The lead reads `progress.md`, `grill.md`, `task.md`, `implementation.md`, `evolution.md`
  when present, and the applicable conventions. It refreshes the shared [change map](changes.md) and uses
  it to assign material. Reviewers explore relevant source and supply evidence in their guides and reports.
- **sdd.review.5.** The **review-lead** is the agent executing this review, in a fresh context separate from
  the builder and plan author. Its reviewers are backend, devops, frontend, persistence, simplicity and tester,
  each a fresh agent. The lead coordinates the reviewers, verifies every finding and writes the final report.
- **sdd.review.17.** Grill rows establish the user's rulings; the plan and evolution establish context;
  conventions establish the applicable rules. Read them in that order. Existing code is evidence of a pattern,
  never authority to disregard a convention or reopen a ruled point.
- **sdd.review.10.** This review judges built behavior and engineering quality. Settlement conformance is
  [QA's drift lane](step-4-qa.md).

## Outputs

Paths are relative to the task folder.

| File | Author | Contents |
|---|---|---|
| `changes.md` | Script, invoked by lead | Shared file counts and line map, under the [changes protocol](changes.md). |
| `review/assignments.md` | Lead | Reviewers, assigned conventions, current file assignments and reasons for dispatch or skip. |
| `review/<reviewer>.md` | Reviewer | Source paths with 2–3 sentences explaining relevance, reused and refreshed across rounds. |
| `review<x>-<reviewer>.md` | Reviewer | Current findings, proposed fixes, summary, reads and shared concerns. |
| `review<x>.md` | Lead | Verified combined findings, coverage, excluded claims and follow-up. |

- **sdd.review.4.** `<reviewer>` is backend, devops, frontend, persistence, simplicity or tester. `<x>` is
  empty for the first round, then `2`, `3` and so on. Select the next round from existing report names and
  supply each reviewer its exact output path. Preserve previous reports. Persistent preparation has no number.

## Preparation

- **sdd.review.8.** Follow the plan-review assignment model: when `review/assignments.md` is absent, the lead
  assigns exact convention-file paths to reviewers. A shared convention can be assigned to several reviewers,
  each checking its own responsibilities. Include documentation, naming and testing instructions in the
  applicable specialists' assignments. Later rounds reuse the assignment and extend it when scope or rules
  change; a new relevant rule cannot be omitted because the file already exists.
- **sdd.review.9.** Use `changes.md` to assign every changed file to the responsible reviewer or reviewers.
  A file that computes and stores goes to backend and persistence. Record reasons for dispatch or skip.
  Every changed file needs coverage; simplicity and tester apply whenever code changes. Documentation rules
  and changed standing docs go to the responsible specialists even when no code changes.
- **sdd.review.18.** Each reviewer receives its definition, relevant plan/evolution passages, grill rulings,
  assigned conventions, assigned paths and map ranges, other dispatched reviewers, source-guide path and exact
  report path. It can consult the shared map without receiving a full patch or unrelated source. On first
  dispatch it explores relevant source and writes `review/<reviewer>.md`; later agents reuse and refresh the
  guide against current source. A guide is a route to evidence, never cached evidence.

The assignment file uses:

```md
# Review assignments

## Reviewers
| Reviewer | Dispatched or skipped | Why |

## Convention assignments
| Convention file | Reviewer |

## File assignments
<One section per Git root>
| File | Reviewer | Why |
```

Each source guide uses:

```md
# Review source guide — <reviewer>

## Sources
<One section per Git root>
| File | Why it is relevant |
```

## Reviewers

| Reviewer | Reviews |
|---|---|
| backend | Services, workers, dependencies, configuration, API contracts, failures, retries and durable work. |
| devops | Configuration delivery, containers, networking, deployment, CI, startup, rollout and recovery. |
| frontend | User flows, UI states, component reuse, navigation, permissions and client/server contracts. |
| persistence | Stored shapes, identities, queries, transactions, grants, migrations and object/index lifetimes. |
| simplicity | Reuse, abstractions, duplication, dead paths and cost relative to the ruled scope. |
| tester | Test effectiveness, boundaries, fixtures, meaningful coverage and required gates. |

## Review round

- **sdd.review.11.** The lead refreshes the map, prepares assignments, dispatches fresh applicable reviewers
  together and waits for all their guides and reports. The same lead verifies their findings and coverage,
  composes the current Findings, then reads the newest previous final review for follow-up. Findings freeze
  before reading that previous review. Dispatch in batches when concurrency limits require it.
- **sdd.review.12.** Every finding quotes current source verbatim and cites its rule, ruling or specific
  behavioral hole. Use the [QA severities](step-4-qa.md#the-qa-document). Reports contain Findings, Summary,
  Read and Shared concerns. Summary names missing evidence and incomplete checks; handoffs name their target
  and evidence. An empty findings table with a documented read is a valid result.
- **sdd.review.13.** The lead verifies every finding's quoted span, factual basis, remedy and severity against
  current source, assigned rules and the settled context. It records verification in the final document and
  excluded claims with their reasons and evidence. The responsible reviewer performs further source
  investigation when needed. The lead also checks every file and convention assignment, shared concern,
  handoff and skip, and the change-map fingerprints. Missing reads or unexplained coverage gaps are incomplete.
- **sdd.review.14.** The lead writes the final report: merge duplicates with credit to every contributing
  reviewer, preserve explained disagreements, rank blockers first and trace previous findings as closed,
  stands or recurred against current evidence. Cleanliness follows
  [sdd.cycle.5](cycle.md#review-cleanliness); info observations pass to the hand-back without a fix wave.
- **sdd.review.16.** Retired.

## Reviewer report example

```md
# Review — backend — round 2

## Findings
| # | severity | source passage | why | proposed fix |

### Summary
<N blocker · N major · N warning · N info; missing evidence or incomplete checks>

## Read
<Rule and source paths opened>

## Shared concerns
<Handoffs and their evidence, if any>
```

## Final document

```md
# Review — <task folder> — <file> — <date>

## Coverage
| Reviewer | Dispatched or skipped | Material | Completion or reason |

### Change map
<Root and fingerprint from changes.md for this round>

## Findings
| # | severity | reviewer(s) | source passage | why | proposed fix | lead verification |

### Summary
<N blocker · N major · N warning · N info; complete or incomplete coverage>

## Excluded claims
| Reviewer finding | Reason and evidence |

## Follow-up from past reviews
<what closed · what stands · what recurred>
```

## Boundary and disposition

- **sdd.review.6.** The lead and reviewers report; they never fix, dispose, commit, push or ask the user.
  A question the record does not answer receives a row in `open-questions.md` and an info finding. Their
  writes are limited to their assigned preparation/reports, the shared map and that register.
- **sdd.review.7.** This review writes no `progress.md` entry. Its reports are its record; the disposing step
  names them. It can run with any step open.
- **sdd.review.15.** Findings go to `sdd step 3` under sdd.step3.9–12. Dispositions are appended to the final
  review under `## Dispositions`; the original findings remain unchanged. The lead returns the final path,
  summary and coverage status; detailed specialist work stays in the lead's context.
