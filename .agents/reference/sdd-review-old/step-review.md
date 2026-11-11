# sdd step review — the built-code review

The deeper read of built work beside the cycle's own QA ([step-4-qa.md](step-4-qa.md)). A triage agent sends
the task's material to the roles that own it. They read it against their layer's conventions, a verifier checks
the heaviest findings, and the reviewer composes one document whose findings step 3 disposes of. The user may
name `sdd step review` when built work exists; a delegated implementation/QA loop always ends with one.

## When it runs

- **sdd.review.1.** On the user's word, when built work exists (sdd.review.3).
- **sdd.review.2.** Under a delegated routing it closes the loop: once a QA round is clean — no blocker, major or
  warning, info allowed — the orchestrator runs a review. A review with a blocker, major or warning sends the loop
  back to `sdd step 3`; the loop ends only when a QA round and the review after it are both clean, their info
  findings carried to the hand-back ([the orchestrator skill](../../../.agents/skills/sdd-orchestrator/SKILL.md)).
  The orchestrator spawns the roles itself, as it spawns QA's lanes: a sub-agent cannot spawn its own.
- **sdd.review.16.** Retired.
- **sdd.review.17.** Every role reads the task's `grill.md` before judging: its rows are the user's rulings.
  A role invents nothing against them and never reopens a ruled point or rejected option. Existing code is
  evidence of a pattern, not authority to disregard a convention.

## The material

- **sdd.review.3.** Read the task's `progress.md` and review its built changed files, including untracked
  files and the code they call.
- **sdd.review.4.** A review writes `review<x>.md`; each role writes its
  own `review<x>-<role>.md`. Numbered as QA files are — the first round carries no
  number, the second `2` ([cycle.md](cycle.md), sdd.naming.1).

## Who reviews

- **sdd.review.5.** The reviewer is a session other than the one that built or settled the work, with fresh
  context; every role and the verifier is a fresh sub-agent. All of them are read-only on the tree: each writes
  its own file and nothing else.
- **sdd.review.6.** The reviewer reports; it never fixes, disposes, commits, routes or asks the user. What the
  record does not answer is a row in `open-questions.md` and an **info** finding naming it
  ([cycle.md](cycle.md), sdd.register.3).
- **sdd.review.7.** The review writes no `progress.md` entry: its files are its record, and the step that disposes
  of them names them. It opens and closes no step, so it runs with any step open.

## The roles

| Role | Reviews | Against |
|---|---|---|
| **triage** | sorts every changed file to its owning roles; skips a role with nothing to read, saying why | — |
| **backend** | server-side logic: conditions, edges, failure paths, retries, idempotency, configuration, logging | the applicable conventions and backend patterns |
| **frontend** | console flows, states, components and client/server boundaries | the applicable conventions and console patterns |
| **persistence** | schema, migrations, queries, object stores, indexes and stored compatibility | the applicable conventions and store patterns |
| **tests** | whether each test detects broken behavior, sits at its level and keeps the suite healthy | testing conventions, instructions and the gate |
| **docs** | changed standing docs, canonical vocabulary and truthful comments | documentation instructions and the correct glossary |
| **simplicity** | disproportion, unnecessary abstractions and dead code, traced to the rule or ruling requiring them | abstraction/dead-code conventions and the ledger |
| **verifier** | current blockers/majors and follow-up on previous findings | current source and the cited rule |

- **sdd.review.8.** A role picks the conventions that apply to its material from
  [the conventions index](../../conventions/INDEX.md) and the [instructions](../INDEX.md); it is handed none.
- **sdd.review.9.** A file both computes and stores → triage sends it to backend and persistence alike. A role
  reads only what triage sent it, and the code it must open to judge that.
- **sdd.review.10.** Whether the build matches `task.md` and `implementation.md` is QA's drift lane, never a role
  here.

## The protocol

- **sdd.review.11.** Five parts, in order: triage; the dispatched roles together, waited for as a set; the
  verifier over their blockers and majors; the composition; the follow-up from the newest previous built-code
  review, read after the findings freeze.
- **sdd.review.12.** A role's file is a findings table in the shape and severities of a QA sub-file
  ([step-4-qa.md](step-4-qa.md), sdd.step4.10 – sdd.step4.12). Every finding quotes the span it rests on and cites
  the rule or names the hole that makes it one.
- **sdd.review.13.** The verifier writes `…<x>-verifier.md`: per blocker and major, **verified** · **disputed** —
  kept, its dispute attached · **voided** — the span is not there, or the claim does not hold; and the severity
  that stands. On a re-run it adds, per finding of the previous document, **closed** · **stands** · **recurred**.
- **sdd.review.14.** The composition drops what was voided, merges duplicates across roles under one row naming
  every role that raised it, keeps a disagreement between roles visible as one row with both readings, and ranks
  blocker first.

## The review document

```md
# Review — <task folder> — <file> — <date>

## Roles
| Role | Dispatched · skipped | Why |

## Findings
| # | severity | role(s) | the issue (file · quoted span) | why it is an issue (a cited rule or a named hole) | proposed fix | verifier |

### Summary
<N blocker · N major · N warning · N info>

## Follow-up from past reviews
<what still stands · what closed · what recurred>
```

## Disposing

- **sdd.review.15.** A review's findings are disposed of by `sdd step 3` as a QA round's are (sdd.step3.9 –
  sdd.step3.12). Each takes one disposition, appended to the
  review document under `## Dispositions`; the review's findings are never edited.
