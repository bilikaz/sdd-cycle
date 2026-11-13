# Composition root

**Rules.**

1. **One visible root per process.** Every dependency a process has — connections, clients,
   loggers, ports, its registration manifest — is declared in ONE composition object at its entry
   point, each wire self-describing on the line that consumes it (the reference name readable where
   it is used). Reading the root tells you the process's whole footprint.
2. **Inject down, never acquire ambiently.** Below the root, code reaches infrastructure only
   through what was injected — the root's clients, and scoped views of them. A module-scope
   singleton is a defect unless it is (a) the factory the root itself calls, or (b) a documented
   physical necessity (e.g. a subscriber connection that cannot be the shared command client). A
   process-level accessor may exist solely as the bridge for modules loaded by a scanner, which
   have no signature to receive the root.
3. **Factories take values, not names.** `getDb(url)`, not `getDb("core")` — a factory that maps
   names to addresses is a hidden second root. Name→address mapping is the root's job; memoize by the wire's
   identity — the user at the host and port — so equal wires share the pool: a URL's path names no separate
   store. The factory takes the URL whose identity keys the pool, and a schema group names the stores that one
   connection serves — one app process, one user, one connection; a store is a handle that names its schema on
   every query, and the app's one open transaction spans the schemas that user's grants reach
   (repositories rule 10). The law's one carve-out is the boot migrator: a root may wire a
   separate migrator connection for DDL, outside the app's one — DDL commits of its own and is a boot duty, not
   an action; no business transaction ever opens across it.
4. **Units take one context parameter.** A constructed unit (service, worker context) receives one
   scoped view of the root carrying everything it may touch — its config branch, the shared
   clients, a tagged logger child. Derived values are computed ONCE at construction (the inputs are
   immutable until restart); getters that re-derive constants per call are waste.
5. **Fail loud at the seam.** A name the root didn't wire, a value that parses to garbage, a branch
   a unit expected — each throws naming the missing thing at the earliest read. Fallbacks exist
   only for genuine absence with a documented meaning (default-on-absence), never to paper over a
   set-but-wrong value.
