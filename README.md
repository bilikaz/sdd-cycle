# sdd-cycle

A task cycle with steps 0–5 for building software with a coding agent — and the ten skills that
run it. Copy it into a repository, point your agent at [`AGENTS.md`](AGENTS.md), and every task runs the
same way: **initialize → grill → settle → build → review → deliver**.

Not a framework and not code: a small set of markdown instructions plus agent skills. The instructions
are the truth an agent reads before it acts, so the cycle survives a fresh session, a different model, or
a different person.

## The cycle

One folder per task, under `docs/tasks/task<n>/`. Six numbered steps, **driven by the user** — they name the step,
an agent runs it and stops.

| Step | Skill | Does |
|---|---|---|
| 0 | `sdd-new-task` | initialize the task branch, folder, progress and first grill entries |
| 1 | `sdd-grill` | interview one question at a time, record answers, then stop before planning |
| 2 | `sdd-plan` | draft or revise an existing task's documents, confirm and settle; related coordinating role: [sdd-planner](.agents/skills/sdd-planner/SKILL.md) |
| 3 | `sdd-implement` | build, verify and update standing docs; related coordinating role: [sdd-implementer](.agents/skills/sdd-implementer/SKILL.md) |
| 4 | `sdd-qa` | a fresh QA lead coordinates code-review, conventions and drift agents using the shared change map |
| review | `sdd-review` | a fresh lead coordinates applicable built-code specialists and returns verified findings |
| plan review | `sdd-plan-review` | a fresh lead coordinates applicable proposed-design specialists and verifies their findings |
| 2 ↔ plan review | `sdd-planner` | draft and review the plan under delegated routing, then present it for confirmation |
| 5 | `sdd-commit` | deliver under the [step-5 rules](docs/instructions/implementation/step-5-commit.md) |
| 3 ↔ 4 · review | `sdd-implementer` | coordinate implementation, QA and code review under explicit delegation, then return the report |

The steps' rules live in [`docs/instructions/implementation/`](docs/instructions/implementation/cycle.md),
carry stable ids (`sdd.step3.4`), and are the model a skill only points at.

## Install

1. Copy `docs/instructions/` into your project's `docs/`.
2. Copy `.agents/skills/` and `.agents/agents/` into your project (the canonical skills and specialist definitions).
3. Copy `.claude/` into your project, preserving its relative directory symlinks:
   `skills` points to `../.agents/skills` and `agents` to `../.agents/agents`. Keep these links in Git.
4. Point your agent at `AGENTS.md`.
5. Configure each repository's gate in the workspace map. `scripts/ci.sh` is an unwired starter;
   connect it to the project's checks or use an existing full gate.
6. Copy `scripts/changes.sh` (requires Git and Python 3). Follow the
   [change-map protocol](docs/instructions/implementation/changes.md) to record starting commits and generate
   each task's shared `changes.md` before QA and built-code reviews.

## Project setup

Start with the guided, empty [workspace map](docs/instructions/workspace.md). Grilling gathers relevant
setup answers; planning records known repository, execution and verification details there. Update it as
setup develops, like any standing document, and deliver its changes in step 5. Existing standing documents
are used when available; a new project does not need a full set before grilling.

| Path | What |
|---|---|
| `docs/architecture/INDEX.md` | the map: what exists, present tense |
| `docs/architecture/glossary.md` | the glossary: one canonical name per concept |
| `docs/conventions/INDEX.md` | the binding engineering rules, portable across projects |
| `docs/adr/` | the decision log |
| `docs/tasks/INDEX.md` | the task register |
| `scripts/ci.sh` | starter for a configured gate — currently unwired |

## Persistent workspaces and Docker

We prefer persistent workspace folders for parallel work on one project. Each checkout retains its local
environment files, container identity, port allocations and storage across task branches. Docker defines the
runtime and service topology; the [workspace map](docs/instructions/workspace.md) records each configured
workspace and the services shared once per host. Follow the [Docker](docs/conventions/docker.md) and
[port](docs/conventions/service-ports.md) conventions for the common layout and allocation rules.

Git worktrees provide separate code checkouts and can use separate environment files and Docker resources.
They do not provision that infrastructure: a new per-task checkout still needs local configuration,
credentials and unique runtime allocations supplied. Persistent configured folders let us reuse that setup.
See [Git worktrees](https://git-scm.com/docs/git-worktree) and
[Compose project isolation](https://docs.docker.com/compose/how-tos/project-name/).

## Layout

```
AGENTS.md                                  this project's guide for an agent
docs/instructions/implementation/          steps 0–5, escalation, testing
docs/instructions/documentation/           the laws about the documents the cycle keeps
docs/architecture · docs/conventions · docs/adr · docs/tasks   the stubs a project fills
.agents/skills/sdd-*/SKILL.md              the skills, canonical
.agents/agents/sdd-*.md                    specialist agent definitions, canonical
.claude/skills                            relative symlink to ../.agents/skills
.claude/agents                            relative symlink to ../.agents/agents
scripts/ci.sh                              the gate
```
