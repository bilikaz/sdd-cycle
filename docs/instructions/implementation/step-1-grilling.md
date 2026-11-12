# sdd step 1 — Grilling

Step 1 gathers what the task needs before the plan is written. It has two doors: a decision that does not yet
exist is **grilled**; a decision that exists — the system contradicts something already written — is a **bug**,
and step 1 is discharged by citing it.

## Entry

The entry point is [sdd-grill](../../../.agents/skills/sdd-grill/SKILL.md). Identify the named task, otherwise
the task matching the current branch, otherwise the sole task with step 1 open. Ask if ambiguous. Read its
`progress.md` and `grill.md`, including the brief already recorded by
[step 0](step-0-new-task.md). A missing task needs step 0; grilling creates no folder or branch.
An existing folder missing `progress.md`, `grill.md` or Git context in progress is incomplete initialization:
report the gap and existing branch/saved-work state under sdd.cycle.3, then ask for direction and stop.
Do not create replacement records, a duplicate task or a repair branch.
Check the branch against [Git context in progress](templates/progress.md#git-context) before writing. Report a mismatch or missing branch
information instead of creating a branch or switching away with unhandled work.

Questions within a running step 2 stay with its planner under sdd.step2.11; do not close that entry or
open step 1 merely to answer them. Otherwise, resume a current step-1 entry or open one when step 1 has
not run. A request to grill again after a completed interview opens a new occurrence under sdd.progress.3.
A bare continuation after a done grill reports it done and stops; never reopen its completed entry.
Apply sdd.progress.4 only when step 1 will actually run.

Use the recorded brief instead of asking the
opening question again. Consult relevant standing documents and roadmap entries when available; an initial
project may have none. Their absence does not block grilling or require creating them for this interview.

Ask about relevant project setup using [workspace.md](../workspace.md#filling-this-template). Record the
answers in `grill.md`; step 2 populates the setup map. Ask only facts this task needs that are not already
recorded; do not walk unused setup sections. This does not add a separate interview or change the
grilling process below.

## Two doors

- **sdd.step1.1.** The decision does not yet exist — new behaviour, a change of direction, a target state
  nobody has written down — and the grill runs.
- **sdd.step1.2.** The decision exists and the system contradicts it: step 1 is discharged by citing where the
  right behaviour is already written. Without a citation it is not a bug and the grill runs.
- **sdd.step1.3.** The grill is never scaled down because the work looks small. The citation is the only other
  door.

## The interview

- **sdd.step1.4.** Ask one question at a time and wait for the answer. Record it, then ask the next unresolved
  question until the closing condition is met. Never a batch.
- **sdd.step1.5.** A question carries a recommended answer where the documents, a ledger row or the user's own
  words ground one; where nothing grounds one it carries none. State the alternatives before the
  recommendation, and never end a question in *"A, or B?"*.
- **sdd.step1.6.** Walk each branch of the design tree, resolving dependencies one by one.
- **sdd.step1.7.** The debate comes first; the edits come after. Reading while a question is open is allowed —
  editing the thing under debate is not.
- **sdd.step1.8.** Never ask what the record already answers. Look for the answer first — the settled
  documents, this ledger, the user's own words — and where it is grounded, state it as the resolution with its
  citation and land the row.
- **sdd.step1.9.** Challenge a word that conflicts with the applicable project's available glossary
  ([workspace.md](../workspace.md#standing-documents)) the moment it is used, and sharpen a fuzzy word to its canonical term.
- **sdd.step1.10.** Surface a contradiction between what the user says and what the documents say; never
  smooth it over.
- **sdd.step1.11.** Where a question compares states, it is a table — one row per item, one column per state,
  the differing cells marked — with the recommendation in one line under it.
- **sdd.step1.12.** Land accepted terms, conventions and decisions under
  [single-source rule 5](../documentation/single-source.md#the-rule), using the available homes in
  [workspace.md](../workspace.md#standing-documents). The user's answer is its approval.

## `grill.md` — the answer ledger

Use the [grill template](templates/grill.md); its COMMENTS block defines the answer fields.

- **sdd.step1.13.** Record each ruling's destination using the template. A step-2 destination can be named
  before its file exists; step 1 does not create those plans.
- **sdd.step1.14.** On a bug the ledger holds one row per named defect, the cited text verbatim, landing in the
  done-when it grounds.
- **sdd.step1.15.** `grill.md` remains living after step 1 closes. Record additional user answers even while
  waiting for the next requested step, without reopening completed progress or starting planning.
- **sdd.step1.18.** A revised answer rewrites its row in place to the ruling that now stands — the question as
  finally decided, the user's words that decided it, its current destinations — and no row keeps what was
  reverted ([current-truth.md](../documentation/current-truth.md)). A revision changes no other row's id.

## Closing

- **sdd.step1.16.** Step 1 closes when required scope choices are resolved; on a bug, each named defect has its
  citation. Deferrable register entries do not block close. An unanswered required choice keeps step 1
  current: name what is needed and wait rather than inventing an answer or repeatedly asking it.
  Step 2 owns writing the plan documents.
- **sdd.step1.17.** The agent closes the step-1 entry under sdd.progress.2. Its chat completion report
  identifies the task, reports the resolved scope with a link to the ledger and any existing destinations,
  names planned destinations whose files do not yet exist, names any
  deferred register items and what they block, and says that
  `sdd-plan` / `sdd step 2` is available. It then stops for the user's instruction. It never starts planning
  or invokes `sdd-planner` automatically; the coordinating role is always invoked separately.
