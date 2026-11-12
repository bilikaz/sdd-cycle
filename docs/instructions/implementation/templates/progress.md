<!-- COMMENTS
Replace placeholders and remove COMMENTS blocks from the generated file.
Keep Git context with step 0. Add only the entry for the step or occasion actually run;
the blocks below are examples, not steps to pre-create.
END COMMENTS -->

# <Task title>

## sdd step 0 · New task — opened <YYYY-MM-DD>
Status: current

<!-- COMMENTS
Starting commit is the full initial hash used by changes.md. Keep it fixed through settlement,
checkpoints and later rounds; add a new root before its first edit. Git choices remain rulings in grill.md.
END COMMENTS -->

### Git context
| Task branch | Base branch | Starting commit |
|---|---|---|
| <Task branch> | <Base> | <Initial commit hash> |


## sdd step 1 · Grilling — opened <YYYY-MM-DD>

Status: current

<!-- COMMENTS
It has just Status
END COMMENTS -->


## sdd step 2 · Settling — opened <YYYY-MM-DD>

Status: current

<!-- COMMENTS
It has just Status
END COMMENTS -->


## sdd step 3 · Implementing — opened <YYYY-MM-DD>

Status: current

<!-- COMMENTS
The implementation agent produces the tables below.
Keep Parts, Verification, Promotions, Escalations and Findings at close; use None when an empty section has no rows.
Keep this record current as work lands. Review finding details and dispositions stay in their reports.
END COMMENTS -->

### Parts

| # | Part | Status | Where |
|---|---|---|---|
| <Id> | <Work item> | <Actual status> | <Location> |

<!-- COMMENTS
Name each implemented or changed part, its actual status and location.
END COMMENTS -->

### Verification

| # | Command | Environment | Exit code | Not run / why |
|---|---|---|---|---|
| <Id> | <Actual command> | <Root / execution environment> | <Actual result> | <Missing check and cause, or —> |

<!-- COMMENTS
Record executed gates and required supplemental checks, including failed/unrun checks and their cause.
If nothing is testable, state why here. Never claim an unrun check or unmet done-when as verified.
END COMMENTS -->

### Promotions

| # | What | Lands in | Status |
|---|---|---|---|
| <Id> | <Proposed standing rule / term / decision> | <Owning home> | <Proposed / approved> |

<!-- COMMENTS
Record proposed promotions to standing documents. A new binding rule remains proposed until the user approves it.
END COMMENTS -->

### Escalations

| # | Finding | Decision needed | Options | Recommendation |
|---|---|---|---|---|
| <Id> | <Finding / register reference> | <Required ruling> | <Choices> | <Suggested action> |

<!-- COMMENTS
Identify decisions blocking implementation. Link the durable record rather than repeating the discussion.
Changes follow evolution; reopening step 2 requires an explicit human instruction.
END COMMENTS -->

### Findings

| # | Finding / register reference | Ruling needed |
|---|---|---|
| <Id> | <Unresolved issue> | <Decision> |

<!-- COMMENTS
Record issues noticed during implementation that need a ruling, linking their open-questions.md rows.
Review findings and their dispositions stay in their original reports.
END COMMENTS -->

## sdd step 4 · QA — <qa file> — opened <YYYY-MM-DD>

Status: current
Review: <QA report path>
Findings: <N> blocker · <N> major · <N> warning

<!-- COMMENTS
Only the report filename and numeric finding counts belong here. All other review data stays in its report.
Example: qa2.md — 0 blocker · 0 major · 1 warning.
The standalone QA lead writes this entry; under delegation the coordinator does.
END COMMENTS -->

## sdd step 5 · Commit — opened <YYYY-MM-DD>

Status: current
Delivery:
- <Repository> — <Commit / target> — <Delivered, local-only or incomplete>

<!-- COMMENTS
The delivery agent records each repository's actual delivery reference and outcome.
Do not repeat implementation, review findings or command logs.
END COMMENTS -->

## <Occasion> — opened <YYYY-MM-DD>

Status: current
Records: <Relevant report / register paths>
Reviews:
- <Review report> — <N> blocker · <N> major · <N> warning

<!-- COMMENTS
Use for a non-step occasion under the cycle's progress rules; omit Reviews when irrelevant.
For every review kind, use only the filename and numeric finding counts in the owning coordinator's
record. This does not change reviewer write ownership or open a second entry beside an active step.
On hand-back, link pending decisions and reports rather than summarizing their contents.
END COMMENTS -->

## sdd step plan review — <review file> — opened <YYYY-MM-DD>

Status: current
Review: <review report path>


## sdd step review — <review file> — opened <YYYY-MM-DD>

Status: current
Review: <review report path>
