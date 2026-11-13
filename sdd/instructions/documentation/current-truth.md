# Current truth — what is dropped leaves no trace

Every document says only what stands. A reverted answer, an option not taken, a removed feature, a superseded
design — each is deleted from every document that held it, never kept and labelled. It exists because an agent
reads documents cold: a dropped thing still on the page reads as fact, and a fact that is not true is how an agent
comes to act on something that no longer exists. Git keeps the history; the documents keep the present.

## The rule

1. **Delete, never mark.** No *dropped*, *removed*, *reverted*, *superseded*, *was*, *no longer*, *formerly*
   beside a thing — the thing goes, and its mention with it. A sentence that only explains that something is gone
   is itself deleted.
2. **A revision rewrites in place.** A ruling the user revises is rewritten to the ruling that now stands, in the
   same row or sentence; nothing keeps the earlier version alongside. The grill ledger (`sdd.step1.18`) and the
   evolution ledger (`sdd.escalation.11`) apply this to their rows.
3. **Options not taken are not recorded.** A ledger row states the question as decided and the user's words that
   decided it; the alternatives that lost appear nowhere — not in the row, not in `task.md`, not in
   `implementation.md`.
4. **It lands the moment the ruling does** ([single-source.md](single-source.md) rule 5): every document that
   held the dropped thing is cleaned in the same change that records what replaced it.

## What it does not cover

- **Work that removes something.** A task whose work is to delete a thing names that thing in its own records,
  because the removal is the work — a task title, a done-when, a touch-list row.
- **A QA disposition.** A finding disposed of as *rejected* is a ruling about a review, not a dropped fact; it stays
  in its round's `## Dispositions` with its reason.
- **Git.** Commit messages and history are the record of what changed; they are never rewritten.
