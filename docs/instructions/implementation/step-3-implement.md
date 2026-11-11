# sdd step 3 — Implementing

Step 3 builds to the settled documents. Its three sub-steps — **build**, **test**, **documents** — interleave
freely, and the step closes when all three hold. The gate is one thing per side: `scripts/ci.sh` for the platform, `pnpm run check:all` for the harness
([testing.md](testing.md)). It is also the step a QA round's findings — and a review's ([step-review.md](step-review.md)) — are disposed of
in: the user returns to step 3 to fix them.

The step entry point is [sdd-implement](../../../.agents/skills/sdd-implement/SKILL.md); its related
coordinating role is [sdd-implementer](../../../.agents/skills/sdd-implementer/SKILL.md) for an explicitly
delegated implementation/QA/review loop.

## Entry

- **sdd.step3.1.** The step runs against the whole settled context: `task.md`, `implementation.md`, `grill.md`,
  `evolution.md`, and the standing rules the change exercises — [the standing documents](../workspace.md#standing-documents): the conventions bind on
  every change, and the architecture map, the glossary and the decision log are the rest of what it reads.
- **sdd.step3.2.** No settled `task.md` and `implementation.md`, or no step-2 commit landing them, is a
  refusal: name `sdd step 2` and build nothing.
- **sdd.step3.3.** Re-entered after a QA round or a review, the read adds the newest `qa<y>.md` or `review<x>.md` —
  the one that sent it back — before the first act.
- **sdd.step3.22.** The first `sdd step 3` of a task cuts its branch in each repo it will change
  before the first edit ([workspace.md](../workspace.md), sdd.workspace.2); a re-entry checks it is on them.
  Record each root's starting commit in the shared [change map](changes.md) before that root's first edit.
  Subsequent QA and built-code review rounds retain these starting commits.
- **sdd.step3.4.** On a bug, write the failing test first — failing for the stated reason — then make it pass.

## Build

- **sdd.step3.5.** Build to the settled documents as written, and to the standing rules as they stand —
  where a documented pattern fits, use it.
- **sdd.step3.6.** Never build past the settled shape. A deviation is a defect of the implementation: fix the
  code.
- **sdd.step3.7.** A change to the settled plan is settled before it is built, and the user rules which door it
  takes: a change that moves the settled shape re-enters `sdd step 2`; one that leaves it standing is an
  evolution. The agent may suggest the door; it never chooses it ([escalation.md](escalation.md)).
- **sdd.step3.8.** An asset that is read is read, never copied — a mockup, a spike or a reference
  implementation is a source of behaviour, not of files.

## Disposing of a QA round or a review

- **sdd.step3.9.** Every finding of the newest round — a `qa<y>.md`, or a `review<x>.md` — takes exactly one disposition: **fixed** — one right
  answer, inside the settled shape · **escalated** — the remedy carries a decision, or is too large or tangled
  to settle here ([escalation.md](escalation.md)) · **rejected** — only when the finding is not a defect ·
  **registered** — a question the round reported that nobody in the task can answer, already a row in
  `open-questions.md` ([cycle.md](cycle.md), sdd.register.1) · **noted** — an info observation retained in the
  report without a code change. No finding is left undisposed. Info observations do not require a fix wave
  or re-review and do not block advancement ([sdd.cycle.5](cycle.md#review-cleanliness)).
- **sdd.step3.10.** A real defect is never rejected. The worst case is escalated, never rejected.
- **sdd.step3.11.** Verify each finding against the tree before acting on it: a finding is a proposal, and a fix
  aimed at a misattributed cause is worse than none.
- **sdd.step3.12.** The disposition of every finding is appended to the round's `qa<y>.md` or `review<x>.md` under
  `## Dispositions` — the finding's id, its disposition, and for a rejection or an escalation the reason. The
  reviewer's findings are never edited, only appended to.

## Test

- **sdd.step3.13.** Verification runs one way: the gate of every side changed, executed, with the
  rows of sdd.testing.35 beside a harness gate, its invocation and exit code
  and selected execution host/checkout recorded in the close report's **Verification** table. Host selection
  follows sdd.workspace.6; a gate requirement never authorizes moving work to another machine.
  The step does not close without it, except for a task
  with nothing testable, whose Verification table says so and why ([testing.md](testing.md)).
- **sdd.step3.14.** A done-when that cannot be verified is recorded unverified, never claimed.

## Documents

- **sdd.step3.15.** Bring [the standing documents](../workspace.md#standing-documents) the change touches to current truth in
  the same pass, each to the harness's own standard (sdd.workspace.4); the generated ones are regenerated, never
  hand-edited.
- **sdd.step3.16.** A rule that binds work nobody in this task will do — an Agent Note, a convention, a glossary row —
  is a proposal until the user approves it — and lands in its home the moment it is approved
  ([single-source](../documentation/single-source.md) rule 5). A row that records goes to the register
  ([cycle.md](cycle.md), sdd.register.1) and needs no approval.
- **sdd.step3.17.** Never restate a fact that lives elsewhere; link. A document still describing what the
  change removed is put current before the step closes.

## The close report

The step-3 closing entry carries the implementation's report as **tables**, in place of a `Summary` — one
titled table per section, its rows below its title. A section with nothing in it keeps its title and says so in
one sentence; a section that does not apply to this close is absent. The closing reply presents the same
tables, because a table is what a reader can answer at a glance.

| # | Table | Holds |
|---|---|---|
| 1 | **Parts** | each part of the work with its status (sdd.progress.2) — what was built or changed, where |
| 2 | **Verification** | the gate as run — the command, its exit code, what was not run and why — or the one sentence saying why nothing was testable (sdd.step3.13) |
| 3 | **Fixed** | what was fixed — a cited defect, or a QA or review finding disposed of as fixed |
| 4 | **Rejected** | QA or review findings rejected, each with the reason it is not a defect |
| 5 | **Promotions** | what is proposed to promote to an Agent Note, a convention or a glossary row — a proposal until the user approves it (sdd.step3.16) |
| 6 | **Escalations** | changes and findings escalated — the remedy carries a decision; the agent may suggest a door, the user rules ([escalation.md](escalation.md)) |
| 7 | **Findings** | what was noticed while implementing that needs a ruling — each a row in `open-questions.md` ([cycle.md](cycle.md), sdd.register.1) |

```md
### Parts
| # | Part | Status | Where |

### Verification
| # | Command | Exit code | Not run · why |

### Fixed
| # | What | Where |

### Rejected
| # | Finding | Why it is not a defect |

### Promotions
| # | What | Lands in | Status |

### Escalations
| # | Finding | The decision it carries | The options | Suggested door |

### Findings
| # | What was noticed | The ruling it needs |
```

- **sdd.step3.18.** **Parts**, **Verification**, **Promotions**, **Escalations** and **Findings** appear in every
  close, empty or not. **Fixed** and **Rejected** appear when the close disposed of findings — a QA round's, or a
  step-1 citation's defects.
- **sdd.step3.19.** The tables are written as the work lands; they are never reconstructed at the end.

## Closing

- **sdd.step3.20.** The step closes when the build is done, the gate has run, and the documents are current.
- **sdd.step3.21.** Close the step-3 entry with the close report's tables in place of a `Summary`
  (`sdd.progress.2`) — the tables are where parts, verification and escalations are recorded — and present the
  same tables in the reply.
