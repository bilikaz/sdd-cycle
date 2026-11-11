# sdd step 4 — QA

Step 4 is an independent read of built work against the settled documents. A fresh QA lead prepares the
shared change map, assigns work to three fresh specialist agents, verifies their reports and composes the
round's final document.

## Lead and inputs

- **sdd.step4.1.** The **qa-lead** is the agent executing this round, in a fresh context separate from the
  builder. One round per lead session. It coordinates three fresh agents: code-review, conventions and drift.
- **sdd.step4.2.** The lead and its agents report; they never fix, dispose, commit, push or route. Every
  verified defect is a finding. Writes are limited to assigned QA preparation/reports, the shared map,
  the task register and the lead's step-4 entry when progress is not delegated to sdd-implementer.
- **sdd.step4.5.** The lead reads `progress.md`, `grill.md`, `task.md`, `implementation.md`, `evolution.md`
  when present, and the applicable standing documents. The settled context and the user's rulings establish
  the comparison. A builder's log or earlier review is not an input to discovery.

## Outputs

Paths are relative to the task folder.

| File | Author | Contents |
|---|---|---|
| `changes.md` | Script, invoked by lead | Shared inventory under the [changes protocol](changes.md). |
| `qa/assignments.md` | Lead | Agents, assigned rules, current material and coverage responsibilities. |
| `qa/<type>.md` | Agent | Source paths with 2–3 sentences explaining relevance, reused and refreshed across rounds. |
| `qa<y>-<type>.md` | Agent | Current findings, summary, reads and shared concerns. |
| `qa<y>.md` | Lead | Verified combined findings, coverage, exclusions and follow-up. |

`<type>` is code-review, conventions or drift. `<y>` is empty for the first round, then `2`, `3` and so on.
The lead selects the next round from existing report names and supplies each agent its exact output path.
Previous reports are preserved; persistent preparation has no round number.

## Preparation

- **sdd.step4.14.** The lead refreshes `changes.md` before the round, retaining each root's original starting
  commit. It creates or reuses `qa/assignments.md`, assigning applicable rule paths and changed files to the
  three agents. Refresh material assignments each round and extend rule assignments when the task's scope or
  rules change. All three agents run; every changed file is covered by every applicable lane. A lane with no
  applicable material reports that fact with its reason.
- **sdd.step4.15.** Each agent receives its definition, relevant settled context, grill rulings, assigned
  rules, assigned paths and map ranges, other agents, guide path and report path. On first dispatch it explores
  relevant source and writes `qa/<type>.md`; later agents reuse and refresh that guide against current source.
  It reads its assigned source and targeted diffs and follows relevant dependencies. The shared map locates
  material; its line ranges do not restrict investigation or prove behavior.

The preparation follows the [plan-review assignment/source-guide model](step-plan-review.md#preparation).
QA's assignment file records Agents, Convention assignments and File assignments, the latter per Git root.
Each source guide records Sources per Git root. Guides contain paths and relevance, with findings kept in
round reports.

## The three agents

| Type | Its goal | Definition |
|---|---|---|
| code-review | Does the changed code work: logic, boundaries, failures and effective tests? | [sdd-qa-code-review.md](../../../.agents/agents/sdd-qa-code-review.md) |
| conventions | Does the change obey every applicable standing rule and canonical term? | [sdd-qa-conventions.md](../../../.agents/agents/sdd-qa-conventions.md) |
| drift | Does the built work match task, implementation and approved evolution? | [sdd-qa-drift.md](../../../.agents/agents/sdd-qa-drift.md) |

- **sdd.step4.3.** The lead dispatches all three agents together in fresh contexts and waits for all reports
  and guides before composing. Dispatch in batches when concurrency limits require it. Each agent writes only
  its own guide and round report. A reported discovery is not a final finding until the lead verifies it.
- **sdd.step4.4.** All three round reports are mandatory discovery records, including a report with no findings.
  Each records the rule and source paths actually read, incomplete checks and shared concerns.
- **sdd.step4.6.** Across its assignments, drift accounts for the whole changed material against every applicable
  settled requirement, including missing implementation. Code-review reads changed code and relevant dependencies;
  conventions checks each exercised rule and term. Each starts from the map and opens the relevant source and
  targeted diffs; unrelated patch content need not be loaded into its context.

## Review round

- **sdd.step4.7.** In order: prepare; dispatch the three agents and wait; verify and compose current Findings;
  read only the newest previous QA document; trace previous findings against current evidence and write the
  follow-up. Look for an answer in the record before registering a question. An unanswered question receives
  a row in `open-questions.md` and an info finding; the lead asks the user nothing.
- **sdd.step4.8.** Current Findings freeze before the previous document is read. Every finding quotes its
  source or settled passage verbatim; a span that does not exist voids the claim. Missing implementation is
  grounded in the exact requirement and evidence of its absence.
- **sdd.step4.9.** A question already answered by the settled documents, grill, evolution or instructions is
  a defect of the review. The lead checks that answer and its citation before retaining a finding.
- **sdd.step4.16.** The lead verifies every finding's quote, factual basis, rule, remedy and severity against
  the current source and settled context. It checks each assignment, the agents' reads, coverage gaps,
  shared concerns and handoffs. The responsible agent supplies further evidence when needed. The lead records
  verification, excludes unsupported claims with reasons, merges duplicates with shared credit and preserves
  explained disagreements. It records the map's fingerprints; changed source requires a refresh and affected
  reads under the changes protocol. Cleanliness follows [sdd.cycle.5](cycle.md#review-cleanliness);
  info observations allow the implementer's loop to advance to built-code review without a fix wave.

## The QA document

```md
# QA — <task folder> — <qa file> — <date>

## Coverage
| Agent | Assigned material | Completion or limit |

### Change map
<Root and fingerprint from changes.md for this round>

## Findings
| # | severity | agent(s) | the issue (file · quoted span) | why it is an issue (a cited rule or a named hole) | proposed fix | lead verification |

### Summary
<N blocker · N major · N warning · N info; complete or incomplete coverage>

## Excluded claims
| Agent finding | Reason and evidence |

## Follow-up from past QA rounds
<what closed · what stands · what recurred>
```

- **sdd.step4.10.** Severity is one of **blocker** (broken behaviour, or a violated settled rule with real
  consequence) · **major** (a genuine defect) · **warning** (a rule broken with limited consequence, or a hazard
  no rule names) · **info** (a stated observation, not an error; its proposed fix may be `—`).
- **sdd.step4.11.** A finding's why cites a settled or standing document, or names a security or logical hole.
  Bare opinion is not a finding.
- **sdd.step4.12.** Agent reports contain Findings, Summary, Read and Shared concerns. Their findings table
  uses `# | severity | the issue (file · quoted span) | why it is an issue | proposed fix`. The Summary states
  counts and missing evidence or incomplete checks; Read names actual rule and source paths opened. An empty
  findings table and a documented read are a valid result.

## Closing

- **sdd.step4.13.** The lead writes the final report and returns its path, summary and coverage status. It
  closes the step-4 entry naming the QA file unless sdd-implementer owns progress under delegated routing.
  Detailed agent work stays in the lead's context. Finding dispositions belong to
  [sdd step 3](step-3-implement.md).
