# sdd-cycle

A task cycle with steps 0–5 for building software with a coding agent — and the ten skills that
run it. Use it as an outer workspace, point your agent at [`AGENTS.md`](AGENTS.md), and every task runs the
same way: **initialize → grill → settle → build → review → deliver**.

Not a framework and not code: a small set of markdown instructions plus agent skills. The instructions
are the truth an agent reads before it acts, so the cycle survives a fresh session, a different model, or
a different person.

## The cycle

One folder per task, under `project/docs/tasks/` — `<YYYY-MM-DD>-<milestone-code>-<slug>/` for a roadmap milestone, `task<n>/` otherwise. Six numbered steps, **driven by the user** — they name the step,
an agent runs it and stops.

| Step | Skill | Does |
|---|---|---|
| 0 → 1 | `sdd-new-task` | initialize the task branch, folder, progress and first grill entries, then run the grill |
| 1 | `sdd-grill` | interview one question at a time, record answers, then stop before planning |
| 2 | `sdd-plan` | draft or revise an existing task's documents, confirm and settle; related coordinating role: [sdd-planner](.agents/skills/sdd-planner/SKILL.md) |
| 3 | `sdd-implement` | build, verify and update standing docs; related coordinating role: [sdd-implementer](.agents/skills/sdd-implementer/SKILL.md) |
| 4 | `sdd-qa` | a fresh QA lead coordinates code-review, conventions and drift agents using the shared change map |
| review | `sdd-review` | a fresh lead coordinates applicable built-code specialists and returns verified findings |
| plan review | `sdd-plan-review` | a fresh lead coordinates applicable proposed-design specialists and verifies their findings |
| 2 ↔ plan review | `sdd-planner` | draft and review the plan under delegated routing, then present it for confirmation |
| 5 | `sdd-commit` | deliver under the [step-5 rules](sdd/instructions/implementation/step-5-commit.md) |
| 3 ↔ 4 · review | `sdd-implementer` | coordinate implementation, QA and code review under explicit delegation, then return the report |

The steps' rules live in [`sdd/instructions/implementation/`](sdd/instructions/implementation/cycle.md),
carry stable ids (`sdd.step3.4`), and are the model a skill only points at.

## Install

1. Clone or copy this repository as the outer workspace, keeping `sdd/`, `.agents/`, `scripts/`,
   `tests/` and `AGENTS.md` together. The application lives in an independent checkout at `project/`.
2. Clone an existing application into `project/`, or run `bash scripts/init-project.sh` to initialize
   an empty Git repository there. The script copies missing starter documents and a gate starter from
   `sdd/templates/project/`; existing files are preserved. It creates no commits or remotes.
3. Point the agent at the outer `AGENTS.md`. Keep `.claude/` aliases pointing to the canonical
   `.agents/skills/` and `.agents/agents/` when using Claude.
4. Fill in [this workspace's map](sdd/workspace.md), including the project's Git policy and full gate.
   Wire `project/scripts/ci.sh` to the application's required checks. `bash scripts/ci.sh` runs that entry
   point from the project root and forwards arguments and its exit status. The supplied starter fails
   until checks are configured; no script starts a development environment.
5. Record task starting commits and use `bash scripts/changes.sh taskN --base <starting-commit>`
   under the [change-map protocol](sdd/instructions/implementation/changes.md).

## Project setup

The [workspace map](sdd/workspace.md) belongs to the outer repository and describes this workspace's
checkouts, execution environments and allocations. Each persistent workspace keeps its own map and
`project/` checkout. Reuse the portable instructions and skills; retain the destination workspace's
configuration when updating them.

Project task records and standing documents belong to the application Git repository. The outer
repository ignores `project/`; application commits include their own `docs/tasks/` records. The
tracked `sdd/templates/project/` directory supplies starter files for new projects. Once copied, those
files are maintained as the consuming project's documents, not synchronized on every initialization.

| Path relative to outer workspace | Purpose |
|---|---|
| `sdd/instructions/` | Portable cycle rules and task-document templates |
| `sdd/workspace.md` | Current workspace configuration — local, ignored by Git |
| `sdd/templates/workspace.md` | The workspace map's template, copied into place when the map is missing |
| `sdd/templates/project/` | Starter files copied only when absent |
| `project/` | Independent application Git checkout |
| `project/docs/architecture/` | Architecture map and glossary |
| `project/docs/conventions/` | Project engineering rules |
| `project/docs/adr/` | Project decision records |
| `project/docs/tasks/` | Task register, plans, progress and review records |
| `.agents/` | Canonical skills and specialist definitions |
| `scripts/` | Workspace initialization, gate dispatch and change-map tools |
| `tests/` | Verification of the workspace scripts |

## Persistent workspaces and Docker

We prefer persistent workspace folders for parallel work on one project. Each checkout retains its local
environment files, container identity, port allocations and storage across task branches. Docker defines the
runtime and service topology; the [workspace map](sdd/workspace.md) records each configured
workspace and the services shared once per host. Follow the [Docker](project/docs/conventions/docker.md) and
[port](project/docs/conventions/service-ports.md) conventions for the common layout and allocation rules.

Git worktrees provide separate code checkouts and can use separate environment files and Docker resources.
They do not provision that infrastructure: a new per-task checkout still needs local configuration,
credentials and unique runtime allocations supplied. Persistent configured folders let us reuse that setup.
See [Git worktrees](https://git-scm.com/docs/git-worktree) and
[Compose project isolation](https://docs.docker.com/compose/how-tos/project-name/).
