# Docker environments

Use Docker to make runtime dependencies and service topology reproducible. Each persistent checkout keeps
its runtime configuration across task branches; actual allocations and operational boundaries belong to
`sdd/workspace.md` (docker allocations).

## Layout and environment

| Project-relative directory | Purpose | Local configuration |
|---|---|---|
| `docker/dev/` | Workspace development stack | `docker/dev/.env` |
| `docker/test/` | Workspace verification stack | `docker/test/.env` |
| `docker/shared/` | Host-wide shared services and connection configuration | `docker/shared/.env` |

- Keep these paths the same in every checkout. No workspace directory level is added inside `docker/`.
- Each local `.env` supplies the stack's port band (the first two port digits) and container prefix.
  Use `PORT_BAND` and `CONTAINER_PREFIX` consistently in the project's scripts and Compose definitions.
  Actual prefixes are configured values, not a fixed workspace-name formula.
- Keep local environment values and secrets out of Git; commit placeholder `.env.example` files where needed.
  Initialization can copy an example only when the local file is absent. Never overwrite existing values.
- Scripts resolve paths from their own checkout and explicitly load the selected environment's configuration.
  The same script works in every workspace without injected checkout paths or hardcoded host allocations.
  Missing required values are reported by name without printing secrets.
- Compose project identity derives from the configured prefix. Explicit container, network, volume and image
  names must also respect the configured ownership boundary. Avoid global names that collide across stacks.
  See [Compose project names](https://docs.docker.com/compose/how-tos/project-name/) and
  [environment interpolation](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/).

## Resource isolation

Dev and test have distinct runtime identities, port allocations and mutable state per workspace.
Stateful verification targets the configured test stack, with target identity checked before writes.
Do not clean dev or shared data as test teardown.

An agent starts, rebuilds, recreates or stops the dev stack only when the user asks. Verification runs on the test
stack, which is recreated at the start of a run and left running after it — never stopped as teardown — so a run's
containers, logs and data stay open to inspection.

Resource operations name the owning stack and its resources. No global prune or cross-project cleanup.
Port allocations follow [service ports](service-ports.md); connection URLs change with their allocation.

## Shared services

A designated shared service runs once per host and serves the project's workspaces. Record its owning
checkout, runtime identity, connection references and permitted lifecycle operations in
`sdd/workspace.md` (shared services and delivery checks).
Other checkouts' shared configuration points to that same instance; it does not create a new stack.

Dev/test startup and gates check shared prerequisites without starting, rebuilding, recreating or restarting
them. A missing service is a prerequisite failure. Lifecycle changes require work explicitly authorized
for that host-wide service and run from its configured owner.

Use configured service endpoints or existing external networks to connect workspaces to shared services;
do not assume separate Compose projects share a default network. See
[Compose networking](https://docs.docker.com/compose/how-tos/networking/).
