# Pluggable backends: one feature, a discriminant on the record, an adapter per backend

**Rule.** When a feature must speak to several interchangeable backends (databases,
storage providers, message queues, model hosts), build **one** feature with a
per-record discriminant naming the backend, and isolate each backend's library behind
a small adapter exposing a neutral interface. Never copy the whole feature per backend.
Code that is bundled for more than one target must not import a backend library.

## Rules

1. **The discriminant lives on the record, not the feature.** The unit of work (a
   connection, a bucket, a target) is what varies by backend, so the backend tag is a
   field on that record. A consumer names a record and the adapter layer resolves which
   backend is behind it — consumers never pick a backend-specific entry point.
2. **One adapter per backend, behind a neutral interface.** Define the few operations
   the feature actually needs (open / query / probe / close) as an interface; each
   adapter wraps one library and maps its native result onto a **neutral result type**.
   The rest of the feature — formatting, callers, tests — stays backend-agnostic and
   never branches on the discriminant.
3. **A `discriminant → adapter` map is the registry.** Adding a backend is a new adapter
   file, one map entry, and one union member — no edits to callers. The map, not a
   hand-maintained switch, is what resolves a record to its adapter; the neutral result
   type is what keeps the feature from branching on the backend everywhere.
4. **Validate and default the discriminant where records are stored.** Persisted records
   are untrusted: coerce an unknown backend value to a safe default, and derive
   backend-dependent defaults (ports, regions, limits) from the chosen backend.
5. **A real backend without its credentials is off; a test double is a backend of its own.**
   Every real backend needs *something* configured before it can reach the outside world (a
   base url, an api key, a client id and secret). When a required value resolves **empty**,
   the backend is **off** — not offered, and a call that names it is refused as not enabled —
   never a fake answering in its place. A real adapter that answers without its credentials is
   a door: whatever it is wired to (a sign-in, a payment, a send) can be driven by anyone who
   reaches it in a space where nobody configured it. The offline lane is a **named backend of
   its own** — a deterministic double with canned, schema-valid output and **no network
   call** — selected explicitly by the configuration (its own discriminant value or registry
   key), off by default, and switched on only where tests run. It goes through the real path
   end to end (a redirect-and-callback flow returns straight to its own callback), so the
   feature stays exercisable with no outside service while no real backend can fake one. State
   per backend which values are its credentials.
6. **Keep cross-target-bundled code free of backend libraries.** Backend drivers are
   often platform-bound (Node-only). A module bundled into more than one target — e.g. a
   manifest compiled into both a main process and a renderer — must not import an
   adapter. Lift the per-backend plain data it needs (default ports, capability flags)
   into a dependency-free module both sides can read.

## Why

One-feature-per-backend duplicates everything the feature owns — UI, config, lifecycle,
tools — when the records differ only by which library opens them. It also leaks the
split to the user (toggle N features, mentally partition records by backend) and to any
agent or caller (choose among N near-identical entry points). Putting the discriminant
on the record collapses that to one surface: callers name a record, the adapter knows
the backend. A neutral result type is what keeps the collapse honest — without it the
"one feature" still branches on backend everywhere and you have N features wearing one
name. The bundling rule is the trap that bites last: a manifest or config module that
innocently imports an adapter drags a Node-only driver into a browser bundle and breaks
the build far from the edit.

## How to apply

- Name the operations the feature needs and nothing more; that interface is the adapter
  contract. Each adapter wraps one library and returns the neutral type.
- Put the backend discriminant on the stored record; default + validate it at the store
  boundary, and derive backend-specific defaults from it there.
- Resolve backend via a `discriminant → adapter` map. Adding one is a new file plus a
  map entry plus a union member — never a caller edit.
- Give every real adapter a readiness check on its credentials, and serve none that is not
  ready. Give the feature one test-double backend of its own that covers the *whole* flow —
  including any callback or second leg — so it is exercisable with no outside service.
- Audit which modules are bundled for multiple targets; ensure none import an adapter.
  Per-backend constants those modules need live as plain data they can import freely.
