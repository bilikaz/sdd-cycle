# Project workspace

This file is the project's setup map. The reusable cycle ships it as an unpopulated template.
Agents gather setup answers during grilling and record the confirmed details during planning.
Update it as the project develops.

## Filling this template

- Ask about repository boundaries, execution environments and verification needs when they matter to the task.
- During planning, fill the sections below from the user's answers and verified project configuration.
- Leave unknown values explicitly unconfigured; mark a section not applicable when the project does not use it.
- A new project can begin with this template empty. Existing architecture, glossary, conventions and decisions
  are recorded as those documents become available.
- Use information appropriate for the repository's audience. Keep credentials and private operational
  values in suitable local configuration or secret storage; public documentation can name the configuration
  reference without copying its contents.

## Repositories

| Repository | Root relative to workspace | Purpose | Base branch | Task branch pattern |
|---|---|---|---|---|

Record every independent Git root the project uses, including which root owns the task records.

- **sdd.workspace.1.** Each independent repository owns its changes. Identify the root before running Git
  commands; a single-repository project needs only one entry.
- **sdd.workspace.2.** Record each repository's base branch, task-branch pattern and protected-branch
  boundaries. Use the cycle's task-initialization procedure rather than inferring branch rules from an
  unrelated project.

## Git targets

| Repository | Remote name | Repository reference | Permitted delivery action |
|---|---|---|---|

Record the project's intended push targets and delivery behavior. Use a suitable configuration reference
for details that should not be published.

- **sdd.workspace.3.** Verify that the selected Git target belongs to the current project before pushing.
  A populated entry is project configuration; an unpopulated template does not authorize a guessed remote.

## Standing documents

| Role | Project-relative home | Availability |
|---|---|---|

Record the architecture map, glossary, conventions, decision log and other standing documents as they
become available. These are the project's own homes; the cycle does not require a particular product layout.

- **sdd.workspace.4.** Follow the documentation standard of the repository that owns a changed document.
- **sdd.workspace.5.** Record approved terms, conventions, decisions and architecture facts in their
  designated homes under the [single-source rule](documentation/single-source.md).
- **sdd.workspace.8.** Apply the conventions of the code being changed. For a task spanning several roots,
  identify each root's applicable rules rather than assuming they are identical.

## Where things run

| Checkout or mount reference | Execution environment | Command working directory | Boundary or local configuration reference |
|---|---|---|---|

Describe where commands execute. For mounted checkouts, distinguish the editing view from the underlying
execution environment. Use repository-appropriate references rather than publishing private host details.

- **sdd.workspace.6.** Identify the actual checkout and execution environment before operational commands
  and pass that boundary to delegated agents. Verify mount targets when relevant. Resolve an unknown
  environment from the user or project configuration before dependent operations; an old example is not
  authority to select a host.
- **sdd.workspace.7.** Verify prerequisites in the selected environment when they are needed: the project's
  runtime, dependencies, test services and other configured tools. Missing prerequisites do not authorize
  switching to another host or project.

## Verification gates

| Repository | Full gate command | Working directory | Prerequisites | Focused checks |
|---|---|---|---|---|

Record the actual full verification entry point for each root and any focused checks used during
development. Describe what is needed to execute the gate. Do not assume a runtime, package manager or
container setup.

## Delivery and shared resources

| Concern | Project configuration or local reference | Owner | Permitted operations |
|---|---|---|---|

If used, record deployment checks, shared services, resource ownership, naming boundaries and operational
dependencies. A project without deployment or shared infrastructure can mark this section not applicable.

- **sdd.workspace.9.** Record resource allocations and dependencies only where the project uses them;
  use references suitable for the repository's visibility.
- **sdd.workspace.10.** Identify the project's resource names and ownership boundaries before operating
  services, containers, networks, images or volumes.
- **sdd.workspace.11.** Scope cleanup to the project's explicitly identified resources. Shared infrastructure
  is not permission to clean up another project's resources.
- **sdd.workspace.12.** Document any shared-service prerequisites, permitted lifecycle operations and required
  startup order. Follow the project's configured delivery checks; this template supplies no deployment command.
