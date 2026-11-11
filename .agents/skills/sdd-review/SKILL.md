---
name: sdd-review
description: Reviews built work through a lead and six specialist reviewers, using the shared change map, convention assignments and reusable source guides. Use for sdd step review, sdd-review or deep code review of an existing task. Reports findings for step 3; proposed-design review belongs to sdd-plan-review.
---

# sdd-review

Follow [the built-code review protocol](../../../docs/instructions/implementation/step-review.md).
You are the **review-lead**. The six reviewer definitions are `.agents/agents/sdd-review-<reviewer>.md`:
backend, devops, frontend, persistence, simplicity and tester.

Work in a fresh review context separate from the builder and plan author. Coordinate reviewers and their
reports here, then return the final-review path, summary and coverage status.

## Inputs

Find the named task, or the unambiguous built and undelivered task from `docs/tasks/*/progress.md`.
Read `progress.md`, `grill.md`, `task.md`, `implementation.md`, `evolution.md` when present, and the convention
documents. Require built work. Refresh the task's `changes.md` using the
[changes protocol](../../../docs/instructions/implementation/changes.md); preserve its original starting
commit per root. The map is the file and line inventory used for assignment.

## Work

1. Follow the protocol's Preparation section to create or reuse `review/assignments.md`. Assign applicable
   conventions and every changed file to the relevant specialists; refresh file assignments each round.
2. Dispatch fresh applicable reviewers with their definition, relevant task context, convention assignments,
   assigned map paths/ranges, persistent `review/<reviewer>.md` path and exact round-report path. Reviewers
   explore relevant source on first dispatch and reuse and refresh their source guides later.
3. Read every report and verify all findings against current source, grill, conventions and settled context.
   The responsible reviewer supplies further source investigation. Confirm assigned coverage, accounted-for
   handoffs, skipped reviewers and shared concerns. Check the map still describes the material reviewed.
4. Write the final report yourself. Merge verified findings with shared credit, preserve disagreements,
   explain exclusions and state completeness. Freeze current Findings before reading the newest previous
   final review; use it to trace closed, standing and recurring findings against current evidence.
5. Return the final path, summary and coverage status for step-3 disposition. Questions the record does not
   answer go to `open-questions.md` and an info finding. Write no progress entry, fix or disposition.

Under delegated routing, sdd-implementer delegates the whole review to this lead with read/search, shell,
report-writing and agent-management tools. Specialist work and verification remain here.
