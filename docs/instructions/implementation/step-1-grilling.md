# sdd step 1 — Grilling

Step 1 gathers what the task needs before anything is written. It has two doors: a decision that does not yet
exist is **grilled**; a decision that exists — the system contradicts something already written — is a **bug**,
and step 1 is discharged by citing it.

## Entry

The agent reads the task folder and this file, then asks the opening question: *what is the task?* Nothing is
created and no area document is read before the answer. The answer founds the task folder and opens the step-1
entry in `progress.md` ([cycle.md](cycle.md)). Then `docs/roadmap/todo.md` and `docs/roadmap/revisit.md` are read: an entry the
task touches is one of its questions ([cycle.md](cycle.md) sdd.register.5).

## Two doors

- **sdd.step1.1.** The decision does not yet exist — new behaviour, a change of direction, a target state
  nobody has written down — and the grill runs.
- **sdd.step1.2.** The decision exists and the system contradicts it: step 1 is discharged by citing where the
  right behaviour is already written. Without a citation it is not a bug and the grill runs.
- **sdd.step1.3.** The grill is never scaled down because the work looks small. The citation is the only other
  door.

## The interview

- **sdd.step1.4.** Ask one question at a time and wait for the answer. Never a batch.
- **sdd.step1.5.** A question carries a recommended answer where the documents, a ledger row or the user's own
  words ground one; where nothing grounds one it carries none. State the alternatives before the
  recommendation, and never end a question in *"A, or B?"*.
- **sdd.step1.6.** Walk each branch of the design tree, resolving dependencies one by one.
- **sdd.step1.7.** The debate comes first; the edits come after. Reading while a question is open is allowed —
  editing the thing under debate is not.
- **sdd.step1.8.** Never ask what the record already answers. Look for the answer first — the settled
  documents, this ledger, the user's own words — and where it is grounded, state it as the resolution with its
  citation and land the row.
- **sdd.step1.9.** Challenge a word that conflicts with the glossary of its side
  ([workspace.md](../workspace.md#standing-documents)) the moment it is used, and sharpen a fuzzy word to its canonical term.
- **sdd.step1.10.** Surface a contradiction between what the user says and what the documents say; never
  smooth it over.
- **sdd.step1.11.** Where a question compares states, it is a table — one row per item, one column per state,
  the differing cells marked — with the recommendation in one line under it.
- **sdd.step1.12.** A resolution lands as it resolves: a glossary row reaches the glossary of its side,
  an approved convention rule [the conventions](../workspace.md#standing-documents), a decision its Agent Note, the moment it is accepted
  ([single-source](../documentation/single-source.md) rule 5); the user's answer is its approval.

## `grill.md` — the answer ledger

One row per resolved question, appended as it resolves:

```md
| # | Question / finding | Answer, verbatim | Landed in |
|---|---|---|---|
| G-<n> | <the question, stated as decided — options not taken are not recorded> | <the answer as given — numbers, orderings and negatives intact> | <where it lands> |
```

- **sdd.step1.13.** *Landed in* names the destination: a glossary term · an Agent Note · a convention · a `task.md`
  done-when · a section of `implementation.md` · an `evolution.md` row · a register row · the instruction file a
  procedure correction amends.
- **sdd.step1.14.** On a bug the ledger holds one row per named defect, the cited text verbatim, landing in the
  done-when it grounds.
- **sdd.step1.15.** `grill.md` is living: it may gain rows after step 1 closes, in step 2 and later. A re-entry
  appends its rows for new questions.
- **sdd.step1.18.** A revised answer rewrites its row in place to the ruling that now stands — the question as
  finally decided, the user's words that decided it, its current destinations — and no row keeps what was
  reverted ([current-truth.md](../documentation/current-truth.md)). A revision changes no other row's id.

## Closing

- **sdd.step1.16.** Step 1 closes when no branch remains unresolved — on a bug, when every named defect has its
  citation. `task.md` is not written before it closes.
- **sdd.step1.17.** The agent closes the step-1 entry and stops.
