<!-- COMMENTS
Replace placeholders and remove COMMENTS blocks from the generated file.
Shared by plan-review, QA and built-code review, for specialist and final reports.
The workflow supplies the title, round and exact output path.
END COMMENTS -->

# <Review kind> — <task> — <role or final report> — <round/date>

## Findings

| # | Severity | Where | What is wrong | Why |
|---|---|---|---|---|

<!-- COMMENTS
Each finding names the file:line or section, defect and reason, grounded in a rule, user ruling or
specific behavioral evidence. Quote only what explains or locates it. Use severity under sdd.step4.10.
Report only actionable issues. Missing or skipped required work, implementation or review coverage belongs here.
An empty table is valid. Omit info observations, praise, process notes and extra report sections.
Example: 1 | major | src/export.ts:42 | Anonymous users can export | Missing membership check, G-1.
END COMMENTS -->

## Summary

<N> blocker · <N> major · <N> warning · <N> info

<!-- COMMENTS
Numeric finding counts only, for the user to check the error count.
END COMMENTS -->

## Dispositions

| Finding | Disposition | Reason / reference |
|---|---|---|
| <Id> | <Disposition> | <Reason or relevant reference> |

<!-- COMMENTS
Reviewers omit this section. The agent disposing the findings appends it later to the same final report.
Preserve the reviewer's findings. Use sdd.step2.10's disposition set for plan review and sdd.step3.9 for QA/code review.
One row per finding. Keep reasons/references brief; include them for rejection, escalation, pending decisions
and relevant ledger/register entries. Omit discovery/edit history.
Example: 1 | rejected | Membership guard already covers this path; src/guard.ts:18.
END COMMENTS -->