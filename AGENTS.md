# How we work

Guidance for agents working in this workspace. **This file routes; it does not rule.** The instructions and
standing documents it points at are the current detail and more authoritative than anything restated here — a
rule stated in two places is a rule that will disagree with itself.

## What this workspace is

A portable spec-driven task cycle and the skills that run it. Task records live under `docs/tasks/`;
the consuming project's repositories, document homes, execution environments and gates are recorded in
[workspace.md](docs/instructions/workspace.md).

## Read these before you touch anything

1. [docs/instructions/INDEX.md](docs/instructions/INDEX.md) — the cycle and documentation instructions.
2. [docs/instructions/workspace.md](docs/instructions/workspace.md) — the project setup map, initially a
   template and populated during planning.
3. [docs/tasks/INDEX.md](docs/tasks/INDEX.md) and the named task's records — its current step and user rulings.

Read applicable project documents when they exist and the task needs them. Initial grilling does not
require a populated architecture map, glossary, conventions or decision log.

Point subagents at the same specific documents and verified execution boundaries.

## What the instruction set governs

The task cycle, one task at a time in `docs/tasks/task<n>/` — five user-driven steps whose rules carry stable
ids, the model being [`docs/instructions/implementation/cycle.md`](docs/instructions/implementation/cycle.md).
This file only points; the standing documents are updated to current truth as work lands, and implementation
never rewrites a settled document mid-build.

## The task cycle — the short version

Five steps, one folder per task, **driven by the user**: they name the step, an agent runs it and stops. A skill
runs each.

| Skill | Steps | Does |
|---|---|---|
| `sdd-new-task` | 1 · 2 | grill the task, then settle `task.md` + `implementation.md` and commit them — nothing is built |
| `sdd-plan` | 2 | draft or revise an existing task's documents, confirm and settle; related coordinating role: [sdd-planner](.agents/skills/sdd-planner/SKILL.md) |
| `sdd-implement` | 3 | build to the settled documents, verify and update standing docs; related coordinating role: [sdd-implementer](.agents/skills/sdd-implementer/SKILL.md) |
| `sdd-qa` | 4 | a fresh QA lead uses the shared change map, dispatches code-review, conventions and drift agents, verifies their reports and writes `qa<y>.md` |
| `sdd-commit` | 5 | commit the changed repositories and record the delivery under the step-5 rules and the project's configured Git targets |
| `sdd-review` | review | a fresh review lead assigns built changes and conventions to six specialists, verifies their reports and writes `review<x>.md` for step 3 |
| `sdd-plan-review` | plan review | a lead assigns conventions to six specialist reviewers once, reuses their source guides, verifies their reports and writes `plan-review<x>.md` for step 2 to dispose |
| `sdd-planner` | 2 ↔ plan review | drive drafting and plan reviews under a delegated routing; stop at a clean plan for document confirmation, or at cycling for user guidance |
| `sdd-implementer` | 3 ↔ 4 · review | coordinate implementation, QA and code review under explicit delegation, then return the report |

Three things worth knowing without opening the rules: the **settled documents are the truth** an agent reads —
never the conversation; the **QA reviewer is never the builder**; and the **user drives** — an agent takes no
step that was not named.

## The procedure is fixed while it is used

The instruction set is being built while tasks run against it. On the user's instruction, **any agent may edit
any file of it, whatever step is open** — a procedure file is not the work a step is judging, so its write
boundary does not bind here. Do not push the correction back for the user to relay: an agent that spots a gap
in its own instructions fixes it and says so.

## Settle, then move

When a question, objection or correction is raised — about code or docs — **the debate comes first and the
edits come after**. Reading while it is open is fine; changing files is not. This holds for the first request
too: a task that sounds clear is not yet settled scope — lay out the design and its consequences, surface the
corner cases, restate the shape, and edit once the user confirms it. Review findings are adjudicated the same
way: a reviewer without the conversation is sometimes wrong, so what was applied versus rejected is recorded
with the why.

## Git — one settlement commit, one delivery

Two commit occasions, each needing its own explicit signal: the **settlement** at the end of `sdd step 2` — the
user's word confirming the documents is its signal, so settling and committing are one act — and the
**delivery** at `sdd step 5`, which commits the changed repositories and pushes to their configured targets. Between them nothing is
pushed, and the only other commit is a local **checkpoint** of each changed task branch before each new edit
wave (sdd.commit.4). A prior signal authorizes only the change in front of it, never the follow-ups, and the
default between signals is read-only.

Repository boundaries and permitted Git targets are recorded in
[workspace.md](docs/instructions/workspace.md) (sdd.workspace.1–3).

## How we talk

**English only**, always — not in reasoning, chat, code, comments, docs, or commit messages. Chat is short:
what's done, what's broken, what's next, in a few sentences. Depth belongs in the docs, not in the reply.
