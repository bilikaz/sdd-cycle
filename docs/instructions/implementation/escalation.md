# Escalation and evolution

A change to a settled task has exactly one home, and the fork is one question: **does it move the settled
shape?** If yes, `sdd step 2` re-settles the documents. If no, the change is an **evolution**, recorded in
`evolution.md`. The user answers the question — the agent may suggest an answer, never give it. Escalation is how
a change or a QA finding that carries a decision reaches that fork.

## Escalation

- **sdd.escalation.1.** A QA finding too large, too tangled, or with a remedy that carries a decision is
  **escalated**, not fixed in `sdd step 3`. The executor names the options and settles none; the user decides.
- **sdd.escalation.2.** An escalated finding is resolved by the user one of two ways: an **evolution**, or
  re-entering `sdd step 2`. There is no third door. The agent may prejudge — *this leaves the settled shape
  standing* — and suggest the door with that reason; the ruling is the user's, never an agent's, and never an
  coordinating role's.
- **sdd.escalation.3.** An escalation is not a deferral: it hands back a decision nobody has taken, together
  with the ledger row and the done-when that follow from the answer.

## Evolution

- **sdd.escalation.4.** An evolution is a change to the settled plan the user ruled leaves the settled shape
  standing: no decision, done-when or scope line of `task.md` changes and the plan of `implementation.md` holds.
  It is recorded in `evolution.md` in the user's words and applied in `sdd step 3`; the settled documents stay
  frozen (`sdd.step2.4`).
- **sdd.escalation.5.** One row per change, appended as it resolves:

```md
| # | What was asked | Answer, verbatim | Landed in |
|---|---|---|---|
| E-<n> | <the change, and at which step it was asked> | <their words> | <what it added or changed> |
```

  A correction row (sdd.escalation.10) carries no user words: its *Answer* column reads *correction — no ruling*
  and its *Landed in* names the misstatement it fixes.

- **sdd.escalation.11.** A revised evolution rewrites its row to the change that now stands, and one of which
  nothing stands is deleted ([current-truth.md](../documentation/current-truth.md)).
- **sdd.escalation.6.** Thinking lands in `grill.md`; the ruling lands in `evolution.md`. The reasoning is a
  ledger row; the change is the evolution row.
- **sdd.escalation.7.** `evolution.md` is the ledger of *what evolved and why* — a requirement added, a
  direction changed. It is not a plan and not a review.

## Re-entering `sdd step 2`

- **sdd.escalation.8.** A change that carries a decision edits `task.md` and `implementation.md`, is confirmed
  by the user, and commits ([step-2-settle.md](step-2-settle.md)).
- **sdd.escalation.9.** A change so large the task restarts, or that reaches beyond the task, is outside the
  cycle: the user decides what happens to the task.

## What is neither

- **sdd.escalation.10.** A settled document that merely misstates something already settled — a wrong count, a
  stale name, a sentence superseded in its sibling — carries no decision. The frozen documents are not edited
  for it: it takes an `evolution.md` row marked *correction*, which needs no ruling, and the next `sdd step 2`
  re-entry folds it in. It is not escalated and not asked about.
