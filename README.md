# sdd-cycle

A five-step, user-driven task cycle for building software with a coding agent — and the nine skills that
run it. Copy it into a repository, point your agent at [`AGENTS.md`](AGENTS.md), and every task runs the
same way: **grill → settle → build → review → deliver**.

Not a framework and not code: a small set of markdown instructions plus agent skills. The instructions
are the truth an agent reads before it acts, so the cycle survives a fresh session, a different model, or
a different person.

## The cycle

One folder per task, under `docs/tasks/task<n>/`. Five steps, **driven by the user** — they name the step,
an agent runs it and stops.

| Step | Skill | Does |
|---|---|---|
| 1 · 2 | `sdd-new-task` | grill the task, then settle `task.md` + `implementation.md` and commit them — nothing is built |
| 2 | `sdd-plan` | draft or revise an existing task's documents, confirm and settle; related coordinating role: [sdd-planner](.agents/skills/sdd-planner/SKILL.md) |
| 3 | `sdd-implement` | build, verify and update standing docs; related coordinating role: [sdd-implementer](.agents/skills/sdd-implementer/SKILL.md) |
| 4 | `sdd-qa` | a fresh QA lead coordinates code-review, conventions and drift agents using the shared change map |
| review | `sdd-review` | a fresh review lead coordinates six built-code specialists, verifies their findings and returns the final review |
| plan review | `sdd-plan-review` | a fresh lead coordinates six proposed-design specialists and verifies their findings |
| 2 ↔ plan review | `sdd-planner` | draft and review the plan under delegated routing, then present it for confirmation |
| 5 | `sdd-commit` | commit the whole working tree, push, and open a PR when the branch has none |
| 3 ↔ 4 · review | `sdd-implementer` | coordinate implementation, QA and code review under explicit delegation, then return the report |

The steps' rules live in [`docs/instructions/implementation/`](docs/instructions/implementation/cycle.md),
carry stable ids (`sdd.step3.4`), and are the model a skill only points at.

## Install

1. Copy `docs/instructions/` into your project's `docs/`.
2. Copy `.agents/skills/` and `.agents/agents/` into your project (the canonical skills and specialist definitions).
3. Copy `.claude/` into your project, preserving its relative directory symlinks:
   `skills` points to `../.agents/skills` and `agents` to `../.agents/agents`. Keep these links in Git.
4. Point your agent at `AGENTS.md`.
5. Wire the gate: `scripts/ci.sh` is the one entry point `sdd step 3` runs. Put your tests in it.
6. Copy `scripts/changes.sh` (requires Git and Python 3). Follow the
   [change-map protocol](docs/instructions/implementation/changes.md) to record starting commits and generate
   each task's shared `changes.md` before QA and built-code reviews.

## What a project must provide

The cycle reads a few standing documents, and `sdd step 3` keeps them current. This repo ships **empty
stubs** for them so every link resolves; fill them in, or point the links at your own.

| Path | What |
|---|---|
| `docs/architecture/INDEX.md` | the map: what exists, present tense |
| `docs/architecture/glosary.md` | the glossary: one canonical name per concept |
| `docs/conventions/INDEX.md` | the binding engineering rules, portable across projects |
| `docs/adr/` | the decision log |
| `docs/tasks/INDEX.md` | the task register |
| `scripts/ci.sh` | the gate — one entry point, non-zero on failure |

## Layout

```
AGENTS.md                                  this project's guide for an agent
docs/instructions/implementation/          the five steps, escalation, testing
docs/instructions/documentation/           the laws about the documents the cycle keeps
docs/architecture · docs/conventions · docs/adr · docs/tasks   the stubs a project fills
.agents/skills/sdd-*/SKILL.md              the skills, canonical
.agents/agents/sdd-*.md                    specialist agent definitions, canonical
.claude/skills                            relative symlink to ../.agents/skills
.claude/agents                            relative symlink to ../.agents/agents
scripts/ci.sh                              the gate
```
