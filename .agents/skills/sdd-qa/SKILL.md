---
name: sdd-qa
description: Runs sdd step 4 through a fresh QA lead and three specialist agents (code-review, conventions, drift), using the shared change map and reusable preparation. Use for QA or settlement-conformance review of built work in an existing task. Reports findings for step 3; never the builder's own review.
---

# sdd-qa

Follow [the QA protocol](../../../docs/instructions/implementation/step-4-qa.md). You are the **qa-lead**.
The three agent definitions are `.agents/agents/sdd-qa-code-review.md`, `sdd-qa-conventions.md` and
`sdd-qa-drift.md`.

Work in a fresh review context separate from the builder. One round per session. Coordinate the three
agents here, then return the final QA path, summary and coverage status.

## Inputs

Find the named task, or the unambiguous built and undelivered task from `docs/tasks/*/progress.md`.
Read `progress.md`, `grill.md`, `task.md`, `implementation.md`, `evolution.md` when present, and the applicable
standing documents. Require built work. Refresh the task's `changes.md` under the
[changes protocol](../../../docs/instructions/implementation/changes.md), preserving the starting commits.
Read previous QA only after current Findings freeze.

## Work

1. Follow the protocol's Preparation section to create or reuse `qa/assignments.md`. Assign current map
   material, settled requirements and rule paths to code-review, conventions and drift.
2. Dispatch all three fresh agents with their definitions, relevant task context, assignments, map paths/ranges,
   persistent `qa/<type>.md` source-guide paths and exact round-report paths. Wait for all guides and reports.
3. Verify every finding against current source, rulings and applicable rules. Obtain further source evidence
   from the responsible agent as needed. Account for assigned coverage, actual reads, shared concerns and handoffs.
4. Write the final report yourself, recording verification, shared credit, disagreements, exclusions and
   coverage. Freeze current Findings before reading the newest previous QA report for evidence-based follow-up.
   Questions the record does not answer go to `open-questions.md` and an info finding.
5. Close the step-4 progress entry unless sdd-implementer owns progress. Return the final path, summary and
   coverage status for step-3 disposition. Never fix, dispose, commit, push or run another round in this session.

Under delegated routing sdd-implementer supplies read/search, shell, report-writing and agent-management
tools to this lead and retains progress ownership. The lead dispatches its agents and verifies their work.
