# Service ports

Publish only ports needed by a person or an explicitly shared host-wide service.
Workspace-internal callers use service names and container ports on their configured networks.

## Numbering

A published port is the stack's two-digit `PORT_BAND` followed by a two-digit service number.
Each independently running stack has a unique band on its Docker host. Record actual allocations in
`sdd/workspace.md` (docker allocations), not in this convention.

| Service numbers | Purpose |
|---|---|
| 01–09 | Product surfaces and public file origins |
| 10–19 | Operator and developer tools |
| 20–29 | Inspectable infrastructure, bound to host loopback |

Assign the next free number in the relevant group and update affected public origins in the same change.
Do not publish an internal service merely to make a test reach it; run the test on the appropriate network.

## Shared services

Host-wide services use their single configured shared band and explicit connection references.
Expose only the interfaces needed by their consumers and bind them to the required interface.
Ownership and lifecycle follow the [Docker shared-service convention](docker.md#shared-services).

## Client compatibility

For endpoints reached through browsers or Fetch, check both published and container ports against the
[Fetch standard's blocked-port table](https://fetch.spec.whatwg.org/#port-blocking).
A healthy service can still be unreachable through a client that blocks its port.
