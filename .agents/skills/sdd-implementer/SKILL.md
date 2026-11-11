---
name: sdd-implementer
description: Coordinates implementation, QA and built-code review under explicit delegation, using fresh builders and review leads until QA and review are clean. Zero findings or info-only findings are clean. Use for sdd-implementer or a delegated implementation/review loop. Runs the existing steps and returns a report; delivery remains sdd-commit.
---

# sdd-implementer — the delegated implementation loop

Not a step. It drives the cycle's existing steps when the user has handed over the routing, and holds the loop's
two hard edges: what the delegation does **not** transfer, and when to stop. The steps' rules are the
instruction files'; the loop is this file's.

The related step entry point is [sdd-implement](../sdd-implement/SKILL.md); this coordinating role manages
the explicitly delegated loop around that step.

## Dispatch

- The delegation is the user's **explicit** instruction, never inferred from a long session or an impatient
  message. No instruction, no loop: run the ordinary skills.
- Record it in `grill.md` before the first round — what was delegated, in their words, and the boundary stated
  back. It holds until they withdraw it.
- The task must have built work; otherwise name `sdd-implement`.
- Resolve the development path's execution environment under sdd.workspace.6 before dispatch. Give that host,
  checkout and boundary to every builder and reviewer; delegation never authorizes switching environments.

## The loop

`sdd step 3 → sdd step 4 → sdd step 3 → …`, turned by you, until a QA round is **clean**.

| Act | Who | Notes |
|---|---|---|
| `sdd step 3` | a **separate** sub-agent you instruct, via `sdd-implement` | it proposes its disposition table; you verify it against the tree before any fix lands (sdd.step3.11) — the disposition stays `sdd step 3`'s, and an escalation waits for the user (sdd.escalation.2) |
| `sdd step 4` | a fresh **qa-lead** via `sdd-qa` | the lead prepares the shared map, dispatches its three agents, verifies and composes; never the builder |
| `sdd step review` | a fresh **review-lead** via `sdd-review` | the lead prepares the shared map, dispatches its applicable specialists, verifies and composes; findings go to the next `sdd step 3` |
| `progress.md` | **you alone** | the step entries are yours under a delegated routing (`cycle.md`, sdd.progress.4) |
| `open-questions.md` | **you**, and a reviewer for a question the record does not answer | the register |

- Delegate each complete review round to its lead, with read/search, shell, report-writing and
  agent-management tools. The lead reads the settled context, refreshes `changes.md` with every root's
  original starting commit, prepares assignments, dispatches its agents and verifies their reports.
  Give it the task path, execution environment and starting commits; retain `progress.md` ownership here.
- Require actual independent agent work. Before accepting a round, check its source guides, agent reports,
  final verification and coverage status. Missing reads, absent reports and unexplained coverage gaps are
  incomplete, regardless of the finding count. The lead returns its final report and summary; detailed
  specialist context remains with the lead.
- Review writes are limited to the shared map, assigned preparation/reports and the task register. Source
  and settled documents remain read-only. Validation follows the project's testing and environment rules.

- The loop closes with `sdd step review` (`step-review.md`). A review with a blocker, major or warning turns the loop
  back to `sdd step 3`; it ends only when a QA round and the review after it are both clean.
- Cleanliness follows [sdd.cycle.5](../../../docs/instructions/implementation/cycle.md#review-cleanliness).
  Zero findings or info-only findings let the loop advance: clean QA proceeds to built-code review and a
  clean built-code review proceeds to the hand-back. Retain info observations in the lead reports and carry them
  to the hand-back; they require no fix wave, re-review or register resolution before advancing.
- Verify each finding against the tree before ruling on it: a reviewer misattributes, and a fix aimed at a
  misattributed cause is worse than none.
- Tell the next round what the record already answers, so it is not raised again.
- **You lead the rounds; you do not turn a crank.** After each round, read where its findings come from — which wave
  made them, which file or rule they keep landing on, whether the code moves or only its wording — and brief the next
  agents with that judgement: the reviewer what the issue is, what to ignore and why; the builder what to fix, extra
  included, and why. You write no code or documents yourself.

## What the delegation does not transfer

| Never yours | Why |
|---|---|
| the **reviewer's independence** | a round read by the agent that built it is not a review; a new sub-agent every round |
| the **`sdd step 5` delivery** | the invocation is the authorisation to commit, merge into `main` and push — it stays the user's |
| **promotion approval** | a standing rule that binds future work is a proposal; mark it proposed and carry on |
| **answering a question** | a question nobody can answer is a register row, not a stop |
| the **escalation ruling** | evolution or a re-entered `sdd step 2` is the user's call; carry it to the hand-back with your suggested door |

## Never

- Never stop the loop for a question: take the reading the documents best support, write the row in
  `open-questions.md` with where it is visible in the tree, and carry on (`cycle.md`, sdd.register.3).
- Never hide an instruction-set edit made mid-loop: it is recorded in `grill.md` and told to the next round.
- Never trust a sub-agent's claim you can check — verify the load-bearing ones yourself.
- Never let a check that cannot fail stand as green.
- Never re-read `progress.md` once and write later; re-read immediately before writing.
- Never deliver — the `sdd step 5` is the user's.

## The hand-back

Stop when a QA round and the review after it are both clean. Nothing else ends the loop.

**When the loop starts feeding itself** — the share of a round's findings made by the previous wave's fixes is rising —
do not stop. Find the cause: the thing that churns (a rule reworded every wave, a fact two documents state
differently, a fix that keeps touching the same text). **Freeze that thing**: tell the next reviewer to leave it alone
and why, and the next builder not to touch it; a decision only the user can take about it is a register row. Every
other blocker, major or warning still needs the next wave's disposition. Info observations stay in their
reports and pass to the hand-back without starting a fix wave; decisions wait for the user.

Hand back with:

1. what converged and what did not, and the info findings of the closing QA round and review, one line each;
2. what changed that **no independent review has read**;
3. one row per decision waiting, each naming what it unblocks, in `open-questions.md`.

Before handing back, undo the task branch's checkpoints (`git reset --mixed` to the commit the branch was cut
from), so the user reads the whole change uncommitted as one diff (`cycle.md`, sdd.commit.5).

Then stop. Asking for the delivery is the last thing the loop does.
