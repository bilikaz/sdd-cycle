# Service ports: published only where a person opens it, numbered by group, never a blocked port

**Rule.** A stack publishes a port only where a person opens it, numbered by one layout so the number says what
is behind it; every other process is reached inside the stack's network by its service name. No service ever
takes a port from the WHATWG fetch blocked-port list.

## Rules

1. **A port is published only where a person opens it** — a surface in a browser, a tool's UI, an inspection
   client on the host. A process only other processes call — an API behind its frontend's BFF, a worker, a
   queue's callback endpoint, an SMTP sink — is reached by service name inside the network and publishes
   nothing. A test that needs it runs inside the network too.
2. **One band per stack, one service number per published service.** A published port is the stack's band
   followed by a two-digit service number (band `86`, number `02` → `8602`); two stacks on one host never share
   a band.
3. **The service numbers run in three groups, consecutive inside each:**

   | Numbers | Group |
   |---|---|
   | 01–09 | what the surfaces' users open — each surface, then its public file origin |
   | 10–19 | the operator's and the developer's tools — a mail sink's UI, a queue's UI, a DB inspector, a component catalog |
   | 20–29 | the infrastructure — a database, a cache — bound to the host's loopback (`127.0.0.1`) only |

4. **A new published service takes the next free number of its group**, never a gap left for a guess, and a
   public origin that names a published port moves with it in the same change.
5. **Never a port from the WHATWG fetch blocked-port list** — among them **6000**, 6566, 6665–6669, 6697, 4045,
   5060/5061, 10080 ([the fetch spec's bad-port table](https://fetch.spec.whatwg.org/#port-blocking)). Every
   spec-conformant fetch implementation (browsers, Node's undici) refuses to dial them with
   `TypeError: fetch failed`, cause **`bad port`**, before any packet is sent. This binds the ports inside the
   network as much as the published ones.

## Why

A published port is a door into the stack: one nobody walks through is attack surface and a number to collide
with, and a numbering that grew by arrival order says nothing about what is behind it. Publishing only what a
person opens keeps the doors few, and the groups make every number readable at a glance — a low number is a
product surface, a teen a tool, a twenty a store that never leaves the host.

A blocked port fails invisibly to every other tool: `curl`, `node:http`, healthchecks and the service's own logs
all show a healthy endpoint, while every fetch-based client gets a connection-shaped error — a service provably
up and selectively unreachable. (Found in real work: an internal worker on port 6000 passed its container
healthcheck for weeks while the sibling API's fetch-based proxy could never reach it; every proxied route
answered 503.)

## How to apply

- Before publishing a port, name the person who opens it. If none does, the process stays on the network, and
  its caller — a sibling process, a test lane — uses its service name and container port. A database or cache a
  developer inspects from the host is published on `127.0.0.1` only.
- Screen every candidate port, published or not, against the blocked list first.
- If a legacy service already sits on a blocked port and cannot move, its clients use a socket API
  (`node:http`, `undici.request`) — plain `fetch` can never work.
- When a "connection refused"-shaped error appears only in some clients while the endpoint answers curl, check
  the port against the list before debugging the network.
