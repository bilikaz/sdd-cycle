---
name: sdd-plan-review
description: Reviews an existing task's proposed design through a lead and six specialist reviewers, using one-time convention assignments and reusable source guides. Use when the user asks to review a plan, invokes sdd-plan-review or assigns plan-review-lead. The lead verifies the reviewer reports and writes the final plan-review document.
---

# sdd-plan-review

Follow [the plan-review protocol](../../../docs/instructions/implementation/step-plan-review.md). You are the
**plan-review-lead**. The six reviewer definitions are `.agents/agents/sdd-plan-review-<reviewer>.md`: backend, devops, frontend,
persistence, simplicity and tester.

Work in a fresh review context separate from the plan author. Coordinate the reviewers and their detailed
reports here, then return the final-review path and summary.

## Inputs

Prepare from `grill.md`, `task.md`, `implementation.md` and the convention documents. These establish the
requirements, proposed design and rules used for assignment. Reviewers explore the source and provide the
relevant evidence. Select the next round and output paths from the protocol's Outputs section, using the task's
existing report names.

## Work

1. When `plan-review/assigments.md` is absent, use those plan documents and conventions to assign
   conventions to the six reviewers and write that file as convention/reviewer pairs. Shared conventions can
   be assigned to several reviewers; each determines their application within its own responsibilities. When the file
   exists, read and reuse it.
2. Dispatch fresh applicable reviewers with their reviewer definition, task paths, convention assignments,
   persistent `plan-review/<reviewer>.md` path and exact round-report path from Outputs. On first dispatch each explores relevant
   source and records its guide, then writes its report. Later reviewers reuse the saved sources.
3. Read every report and verify its findings against the current plan documents, grill, conventions and
   source evidence supplied by the reviewers. The responsible reviewer handles further source investigation.
   Confirm reviewers completed their assigned checks; resolve reported limits, skipped reviewers and shared concerns.
4. Write the final report yourself: combine verified findings, credit shared discoveries, explain excluded
   claims and summarize completeness briefly. Use the newest previous final review to trace which earlier findings closed,
   still stand or recurred against the current plan.
5. Report the resulting document and its coverage status for step-2 disposition.
