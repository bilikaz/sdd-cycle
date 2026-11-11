---
name: sdd-implement
description: Runs `sdd step 3` — builds to the settled documents, runs each changed side's gate in the environment selected by the development path (`scripts/ci.sh` for the platform, `pnpm run check:all` for the harness), brings the standing documents current, disposes of a QA round's findings, and closes with the report tables. Use when the user says build it, implement, apply the fix, work through the findings, or invokes sdd-implement; or when a task rests with `sdd step 3` open and the user says continue. Not for settling (`sdd-new-task`, `sdd-plan`), the review (`sdd-qa`) or the delivery (`sdd-commit`).
---

# sdd-implement — `sdd step 3`

Builds to the settled documents and disposes of the newest QA round's findings. The step's rules are
`docs/instructions/implementation/step-3-implement.md`; this skill carries the entry and the boundary.

The related coordinating role is [sdd-implementer](../sdd-implementer/SKILL.md), invoked when the user
delegates the implementation/QA/review loop. Running this step alone does not delegate that loop.

## Dispatch

- Read the task folder's `progress.md`. Refuse without a settled `task.md` and `implementation.md` whose
  settlement commit has landed: name `sdd step 2` and build nothing (`cycle.md`, sdd.cycle.2).
- Re-entered after a QA round or a review, the newest `qa<y>.md` or `review<x>.md` — the one that sent it back — is read before the first act.

## Read, in this order

| # | File | Why |
|---|---|---|
| 1 | `docs/instructions/implementation/cycle.md` | the steps, `progress.md`, the commit boundary, the register |
| 2 | `docs/instructions/implementation/step-3-implement.md` | `sdd step 3` in full, the close report's tables included |
| 3 | `docs/instructions/implementation/testing.md` | the gate, and what a record must say |
| 4 | `docs/instructions/implementation/escalation.md` | a finding that carries a decision |
| 4a | `docs/instructions/workspace.md` | the two repos, the task's branch, where commands run |
| 5 | the settled context: `task.md` · `implementation.md` · `grill.md` · `evolution.md` | what to build to |
| 6 | `docs/conventions/INDEX.md` for `apps/`·`packages/`; `harness/AGENTS.md` — its Conventions and Commands — for `harness/` | they bind on every change (`docs/instructions/implementation/step-3-implement.md`) |
| 7 | the newest `qa<y>.md` or `review<x>.md`, if one sent it back | its findings take a disposition |

## The step

- Work on the task's branch in each repo it changes — cut on the first entry (sdd.step3.22, sdd.workspace.2).
- Build to the settled documents as written; a deviation is a defect of the implementation.
- Resolve the execution environment from the development path before any install, build or test
  (sdd.workspace.6–7), and keep every command and dependency in that environment. Iterate on focused checks;
  close on the gate of every
  side changed — `scripts/ci.sh`, `pnpm run check:all` with lint and the touched coverage beside it
  (sdd.testing.35) — executed, — and record each
  invocation and exit code in the close.
- Bring the standing documents the change touches to current truth; a rule that binds future work is a proposal
  until the user approves it.
- Dispose of the newest QA round's findings under sdd.step3.9 and append the `## Dispositions` table to that
  round's `qa<y>.md` or `review<x>.md`. Info observations are noted; they do not require a fix or re-review.
- Close the step entry with the report tables in place of a `Summary` — Parts, Verification, Promotions,
  Escalations and Findings in every close; Fixed and Rejected when findings were disposed of — and present the
  same tables in the closing reply, never a prose summary of them (sdd.step3.21).

## Never

- Never commit or push — the delivery is `sdd-commit`'s. Checkpoints (sdd.commit.4) are local scaffolding: when the step is handed back to the user, undo them
  (`git reset --mixed` to the commit the branch was cut from) so the whole change is uncommitted (sdd.commit.5).
- Never close without an executed gate, and never claim a run that did not happen.
- Never build past the settled shape; a change is settled first, and the user rules its door — `sdd-plan` or an
  `evolution.md` row. Never edit `task.md` or `implementation.md` in this step: they are frozen.
- Never reject a real defect.
- Never edit the working tree with a script — no `sed -i`, no `python -c` rewriting a file, no `cat >` over source —
  when a dedicated edit tool exists: a script's match is a guess about text it did not read, and one wrong `git checkout`
  or rewrite during a fix wave has cost a whole round's work. Read, edit, then re-read the region you edited.
- Never run a git command that writes — `checkout --`, `restore`, `reset --hard`, `stash` — over a working tree
  holding uncommitted task work. Take the sdd.commit.4 checkpoint first; a fix wave with no checkpoint is a wave
  that cannot survive its own mistake.
