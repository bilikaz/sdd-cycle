---
name: sdd-planner
description: Performs an existing task's step-2 drafting and settlement, delegating plan reviews until the plan is clean or the loop stops making progress. Zero findings or info-only findings are clean. Use for sdd-planner or a delegated planning/review cycle. Presents documents for confirmation before settlement; creates no task and builds nothing.
---

# sdd-planner — the delegated planning loop

The coordinating role for [sdd-plan](../sdd-plan/SKILL.md). Runs step 2 under
`docs/instructions/implementation/step-2-settle.md` and delegates review to
[sdd-plan-review](../sdd-plan-review/SKILL.md). This skill owns drafting, dispositions, settlement and the
loop's stopping rules.

## Dispatch

- Require the user's explicit delegation; invoking this skill supplies it. Find the named task, or the task
  folder matching the current branch. An absent or ambiguous task needs identification, not a new folder.
  Opening a task belongs to `sdd-new-task`.
- Read `docs/instructions/implementation/cycle.md`, the step-2 instructions, and the task's
  `progress.md`, `grill.md`, existing `task.md`, `implementation.md` and `evolution.md`. Read the register for
  unresolved decisions. Check the task's branch before writing.
- Start from the resolved ledger. The two documents may be absent, drafts, or a previously settled plan being
  revised; earlier built work is context, never permission to alter source. Unresolved scope is a user decision.
- Record the delegation in `grill.md` in the user's words, with its boundary: drafting and review routing are
  delegated; new decisions, document confirmation, settlement approval and the build remain the user's.

## The loop

`sdd step 2 draft → plan review → sdd step 2 dispositions → fresh plan review → …`

| Act | Who | Boundary |
|---|---|---|
| Draft, dispose and settle | you | follow step 2 yourself; draft the documents from the resolved ledger, edit them in place and record dispositions; hold final confirmation and the settlement commit until the plan is clean |
| Plan review | a fresh agent invoking sdd-plan-review | give it the task-folder path and the tools below; use the returned final document |
| Progress | you alone | keep the step-2 entry current while drafting, reviewing or waiting for guidance or confirmation; review adds no entry |
| Register | you, and the reviewer within its reporting boundary | unresolved decisions and stopped findings name what they block |

- For each review round, spawn a fresh agent with read/search, file-writing, shell and agent-management
  tools (spawn, wait and message, or their equivalents). Invoke it with: `Use sdd-plan-review for <task-folder>.`
- Wait for its final-document path and summary, then read that document for the step-2 dispositions.
- Before editing, verify each finding's quoted span, rule, ledger basis and proposed remedy yourself.
  Use sdd.step2.10's dispositions; every finding takes one, and a real defect cannot be rejected.
- The delegation authorizes corrections with one answer inside the ledger. A design choice or remedy that no
  ledger row rules goes under the documents' Proposals, never silently into their body; ask the user nothing
  mid-loop. Never invent the answer or describe registered defects as resolved.
- An error is fixed wherever it sits. A finding that shows an error — against a rule, a ruling or the code — is
  **fixed**, whether it is in the documents' body, in a Proposal, or in an Alternative's options or trade, and
  including an error an earlier fix introduced. A wrong fact or an incomplete list is checked against the code and
  corrected, never copied from the finding unverified and never moved to Proposals or Alternatives.
- Never flip a choice. Only a choice between valid options is held: a disposition that would reverse an earlier
  choice, or a pick between two reviews' opposite remedies where both are valid, is not applied — name both options
  under Alternatives, keep the documents' current text, and dispose the finding as **named**.
- Apply each disposition by reading the affected section and editing it in place; never bulk-replace text. After
  each edit wave, search both documents for the old term or mechanism, so no section still describes the old design.
- Record applied and rejected dispositions with their reasons. Give fresh reviewers the current plan and
  ledger, rather than the prior verdicts.
  Re-review after every plan edit, including one made while disposing a finding.

## Stop and hand back

- **Clean:** the latest independent plan review meets
  [sdd.cycle.5](../../../docs/instructions/implementation/cycle.md#review-cleanliness) on the current documents.
  Zero findings or info-only findings proceed to document presentation and confirmation. Note info
  observations in the review's Dispositions and carry them to the hand-back; they require no document edit,
  extra review round or register resolution. Any later plan edit needs another review.
- **Cycling:** the same underlying findings recur without progress, fixes reverse one another, or the share
  of findings caused by the previous fixes is rising. Verify the causal link against the actual document
  changes; touching a span is not evidence that its defect was introduced by the fix. Stop before another edit
  wave, freeze what is churning and register the residue with the round/finding ids, changes and ruling needed.
- **Round limit:** after five plan-review rounds, stop whatever the last count.
- **Guidance:** remaining changes require a user decision. Register what is undecided and what each answer
  would unblock. A silence from the user is not a ruling. An info observation alone is not a guidance stop.

At any stop, present what the user approves, in this order:

1. **The surface** — every endpoint, event and stored shape the plan adds or changes: its link, what it does, who
   may call it, its request and its response with an example, and the flow that strings them together. This is
   reviewed and approved as a whole, not picked line by line.
2. **The Proposals, then the Alternatives, one at a time** — for each: how the thing works today, what the plan
   changes, the options, the trade, what it touches, and a recommendation, in plain words a reader without the plan
   open can rule on. Never present as a choice what a convention, the code's pattern or a ruling already decides,
   and never ask the user to re-confirm an obvious pick.

The user rules each one; every ruling, accepted or rejected, lands as a `grill.md` row, and a rejected option is
never raised again. Apply each ruling to the documents as it is given. Another cycle runs only on the user's word.

On a non-clean stop, also say what converged, what remains, and which changes have not had an independent read;
link the relevant findings and register rows, suggest the next decision, and ask the user for guidance. Leave
step 2 current. Do not claim settlement or silently launch another round.

On a clean stop, present the actual `task.md` and `implementation.md` for confirmation under sdd.step2.5;
identify any existing user-approved waiver under sdd.step2.9. A clean review does not approve the documents.
Only after the user's confirmation close step 2 and make the settlement commit allowed by sdd.commit.1,
including this cycle's plan-review reports, reviewer reports and persistent preparation. A change after presentation returns
to the loop before confirmation. Never build, deliver or push from this skill.
