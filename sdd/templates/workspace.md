# Workspace

This map describes the current outer workspace. Paths in its tables are relative to that workspace,
except columns explicitly marked project-relative. Update known configuration here; leave unknown
Git policies, application gates and runtime allocations unconfigured.

## Repository and document boundaries

The outer repository owns `sdd/`, the agent definitions and workspace scripts. `project/` is ignored by
that repository and owns its independent Git history, application files and `docs/`, including task
records. Ordinary application work runs in `project/`; the outer repository participates only when
its own files change, under the same per-root branch and delivery rules.

Each persistent workspace has its own `sdd/workspace.md` and `project/` checkout. This map is local to
its workspace: the outer repository ignores it and tracks only its template, `sdd/templates/workspace.md`,
which `bash scripts/init-project.sh` copies into place when the map is missing. Starter project documents
live in `sdd/templates/project/`; the same script copies only missing files into `project/`. Portable
instruction updates preserve the map and the consuming project's files. The map is never committed, and
it is not part of an application's task settlement commit.

## Filling this template

- Step 0 verifies the Git and execution facts needed to initialize a task. An empty template is not
  permission to guess them.
- Grilling gathers setup answers relevant to the task; planning records known configuration.
  Later tasks can fill or update the map as setup develops. Reuse confirmed answers rather than reasking.
- Leave unknown values unconfigured and mark unused sections not applicable.
- Keep credentials and private operational values in local configuration or secret storage.
  Public documentation can name a reference without copying its contents.

## Repositories

| Repository | Root relative to workspace | Purpose | Base branch | Task branch pattern | Protected branches |
|---|---|---|---|---|---|
| SDD workspace | `.` | Instructions, workspace map and tooling | Unconfigured | Unconfigured | Unconfigured |
| Application | `project/` | Application, standing documents and task records | Unconfigured | Unconfigured | Unconfigured |

Identify every independent Git root, including the one owning task records.

- **sdd.workspace.1.** Each repository owns its changes. Identify its actual root before Git commands.
- **sdd.workspace.2.** Configure base branches, task-branch patterns and protected branches per repository.
  Follow [step 0](instructions/implementation/step-0-new-task.md) rather than importing another project's branch policy.

## Git targets

| Repository | Remote or local reference | Permitted refs | Merge target and method | Delivery action |
|---|---|---|---|---|

Configure each repository's policy: local commit only, task-branch push, or merge and push to specified
targets. Record any required repository order and post-delivery actions below. No merge target or remote
is supplied by this template.

- **sdd.workspace.3.** Verify the configured target belongs to this project before delivery.
  An unconfigured entry authorizes no guessed merge or push. A narrower user request limits configured actions.

## Standing documents

| Role | Project-relative home | Availability |
|---|---|---|
| Architecture | `docs/architecture/INDEX.md` | Starter; populate for this project |
| Glossary | `docs/architecture/glossary.md` | Starter; populate for this project |
| Conventions | `docs/conventions/INDEX.md` | Starter; adapt to this project |
| Decisions | `docs/adr/INDEX.md` | Starter; add project decisions |
| Task register | `docs/tasks/INDEX.md` | Initialized with the project starter |

Record architecture, glossary, conventions, decision log and other homes as they become available.
An initial grill does not need a full set.

- **sdd.workspace.4.** Use the documentation standard of the owning repository.
- **sdd.workspace.5.** Land approved terms, conventions, decisions and facts under the
  [single-source rule](instructions/documentation/single-source.md).
- **sdd.workspace.8.** Apply each changed root's own conventions; do not assume several roots share all rules.

## Where things run

| Workspace | Checkout or mount reference | Execution environment | Command working directory | Local configuration reference |
|---|---|---|---|---|

List each persistent workspace for this project. Distinguish an editing mount from the actual checkout
where commands execute. Use references suitable for this repository's visibility.

- **sdd.workspace.6.** Identify the actual checkout and execution boundary before operational commands
  and pass it to delegated agents. Resolve an unknown environment from configuration or the user;
  another project's example is not authority.
- **sdd.workspace.7.** Check required runtimes, dependencies and services in that selected environment.
  Missing prerequisites do not authorize switching hosts or projects.

## Verification gates

| Repository and workspace | Full gate command | Working directory | Prerequisites | Supplemental or focused checks |
|---|---|---|---|---|
| SDD workspace | `python3 -m unittest discover -s tests` | `.` | Python 3, Bash and Git | None |
| Application | Unconfigured; wire `scripts/ci.sh` in the application | `project/` | Project-specific | Unconfigured |

Record actual commands and required checks. The cycle assumes no package manager, runtime or container stack.

## Docker allocations

| Workspace and environment | Docker host reference | Local env reference | Port band | Container prefix |
|---|---|---|---|---|

Use this section when Docker is used; otherwise mark it not applicable. Record allocations, not secret
values. Layout, naming and environment behavior live in the [Docker convention](../project/docs/conventions/docker.md);
port numbering lives in [service ports](../project/docs/conventions/service-ports.md).

- **sdd.workspace.9.** Record each stack's host allocation here or through a suitable local reference.
  Check existing allocations before assigning a new band or prefix.
- **sdd.workspace.10.** Identify resource names and ownership before operating containers, networks, images or volumes.
- **sdd.workspace.11.** Scope cleanup to identified resources. Shared infrastructure does not authorize
  global cleanup or operations on another project's resources.

## Shared services and delivery checks

| Host or workspace | Service or post-delivery action | Owner or owning checkout | Configuration reference | Permitted operations |
|---|---|---|---|---|

Identify the owner and connection references for each host-wide shared service, plus any configured
post-delivery commands and their prerequisites. A project without these concerns can mark this section not applicable.

- **sdd.workspace.12.** Follow configured dependencies, ownership and permitted lifecycle operations.
  This map supplies no default deployment command. Host-wide Docker service lifecycle follows the
  [shared-services convention](../project/docs/conventions/docker.md#shared-services).
