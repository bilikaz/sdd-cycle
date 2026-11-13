# Pluggable backends

**Rule.** When a feature must speak to several interchangeable backends (databases, storage providers, message
queues, model hosts), build one feature with a per-record discriminant naming the backend, and isolate each
backend's library behind a small adapter exposing a neutral interface. Never copy the whole feature per backend. A
real backend without its credentials is off; the offline lane is a test-double backend of its own. Code bundled for
more than one target never imports a backend library.

## Rules

1. **The discriminant lives on the record, not the feature.** The unit of work (a connection, a bucket, a target)
   is what varies by backend, so the backend tag is a field on that record. A consumer names a record and the
   adapter layer resolves the backend — consumers never pick a backend-specific entry point.
2. **One adapter per backend, behind a neutral interface.** Define only the operations the feature needs (open,
   query, probe, close); each adapter wraps one library and maps its native result onto a neutral result type. The
   rest of the feature — formatting, callers, tests — never branches on the discriminant.
3. **A `discriminant → adapter` map is the registry.** Adding a backend is a new adapter file, one map entry and
   one union member — no caller edits, no hand-maintained switch.
4. **Validate and default the discriminant where records are stored.** Persisted records are untrusted: coerce an
   unknown backend value to a safe default, and derive backend-dependent defaults (ports, regions, limits) from the
   chosen backend at that boundary.
5. **A real backend without its credentials is off; a test double is a backend of its own.** When a value a real
   backend requires (a base URL, an API key, a client id and secret) resolves empty, the backend is not offered and
   a call naming it is refused as not enabled — never answered by a fake. A real adapter that answers without
   credentials is a door anyone can drive where nobody configured it. The offline lane is a named backend — a
   deterministic double with canned, schema-valid output and no network call — selected explicitly by
   configuration, off by default, switched on only where tests run, and going through the real path end to end
   (a redirect-and-callback flow returns straight to its own callback). State per backend which values are its
   credentials.
6. **Keep cross-target-bundled code free of backend libraries.** Backend drivers are often platform-bound
   (server-only). A module bundled into more than one target (a server and a browser bundle) never imports an
   adapter; the per-backend plain data it needs (default ports, capability flags) lives in a dependency-free module
   both sides read.

## Why

A feature per backend duplicates everything the feature owns — UI, config, lifecycle, tools — when records differ
only by which library opens them, and it leaks the split to every user and caller. The discriminant on the record
collapses that to one surface; the neutral result type keeps the collapse honest, or the "one feature" still
branches on the backend everywhere. A fake answering for an unconfigured real backend turns a missing secret into
an open door. The bundling trap bites last: one innocent import drags a server-only driver into a browser bundle
and breaks the build far from the edit.

## How to apply

```ts
type Backend = "postgres" | "sqlite" | "test";

interface Connection {
  connection_id: string;
  backend: Backend;
  url: string;
}

interface QueryAdapter {
  isReady(c: Connection): boolean; // credentials resolve non-empty
  query(c: Connection, sql: string): Promise<NeutralRows>;
}

const ADAPTERS: Record<Backend, QueryAdapter> = {
  postgres: postgresAdapter,
  sqlite: sqliteAdapter,
  test: testAdapter, // deterministic, no network, off unless configuration enables it
};

function adapterFor(c: Connection): QueryAdapter {
  const adapter = ADAPTERS[c.backend];
  if (!adapter.isReady(c)) throw new BackendNotEnabledError(c.backend);
  return adapter;
}
```

- Name the operations the feature needs and nothing more; that interface is the adapter contract.
- Default and validate the discriminant at the store boundary; derive backend-specific defaults there.
- Give every real adapter a readiness check on its credentials and serve none that is not ready; give the feature
  one test-double backend that covers the whole flow, including any callback leg.
- Audit which modules are bundled for multiple targets; none imports an adapter.
