# Feature layers: the map of an API feature

**Rule in one line:** an API feature folder is three files with one job each — `index.ts` registers,
`routes.ts` speaks HTTP, `service.ts` holds the logic — over the shared repositories and the feature's DTOs in
the layer's shared package, and the logic never sees the framework. The shape is a feature's — a **service**
folder is a scanned module under [one-door](one-door.md) rule 4: its `index` *is* the module, and holds the
class itself.

## Rules

1. **Three files, one job each**, beside the feature's DTOs; each job's rules live in its own convention:

   | File | Its job | Its rules |
   |---|---|---|
   | `index.ts` | registers the feature: builds its router with its dependencies (constructed, never called) and mounts it at its base — no handler, no rule, no repo call | this file |
   | `routes.ts` | the controller: one registration per route, the router validating, guarding and answering | [routes](routes.md) |
   | `service.ts` | the operations: rules, repo and realm calls, ledger entries, mails — framework-free | [services](services.md) |
   | the feature's `dto.ts`, in the layer's shared package | one request DTO per route and the response DTOs — the contract the console imports too | [dtos](dtos.md) |

   Neither the data access nor the contract is a feature file: the repos are shared, one per table
   ([repositories](repositories.md)), and the DTOs are shared with the console ([dtos](dtos.md) rule 6).
2. **They connect in one direction.** `index.ts` builds the router; the router, per request, validates the
   DTO and calls one operation on the service; the service reads and writes through the repos. The DTO sits
   at the edge — the router validates against it and encodes the answer through the response, the service is
   typed by them — and nothing calls back up.

   ```mermaid
   flowchart LR
     index["index.ts registers"] --> routes["routes.ts"]
     routes -- "validated DTO" --> service["service.ts"]
     service --> repos["repositories"]
     dto["shared dto.ts"] -.-> routes
     dto -.-> service
   ```

## Why

Splitting by job keeps each change in one file: a new rule edits the service, a new route edits the router
and its DTO, and a new table edits a repo — and the logic stays testable with plain values.

## How to apply

- A new feature folder starts as the three files, and its `dto.ts` in the layer's shared package, even when the
  service is small.
- A file that does a neighbour's job — a route that decides, a service that reads the request, an
  `index.ts` that handles — moves that work to the file the table names.
