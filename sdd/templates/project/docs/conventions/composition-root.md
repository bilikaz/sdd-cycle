# Composition root

**Rule.** Every process declares all of its dependencies in one composition object at its entry point and
injects them downward. Below the root, code reaches infrastructure only through what it was handed;
factories take values, not names; each unit receives one scoped context; and a missing or malformed wire
fails loudly at the first read.

## Rules

1. **One visible root per process.** Every dependency a process has — connections, clients, the logger,
   ports, its registration manifest — is declared in one composition object at its entry point, each wire
   readable on the line that consumes it. Reading the root tells you the process's whole footprint.
2. **Inject down, never acquire ambiently.** Below the root, code reaches infrastructure only through what
   was injected: the root's clients and scoped views of them. A module-scope singleton is a defect unless
   it is (a) the factory the root itself calls, or (b) a documented physical necessity (a subscriber
   connection that cannot be the shared command client). A process-level accessor may exist solely as the
   bridge for modules loaded by a scanner, which have no signature to receive the root; it may be called
   only at root-shaped call sites (a register body, a worker's boot handler, the server's main), enforced
   by a lint rule where the project wires one.
3. **Factories take values, not names.** `createPool(url)`, not `createPool('core')` — a factory that maps
   names to addresses is a hidden second root. Name-to-address mapping is the root's job. Memoize by the
   wire's identity (user at host and port), so equal wires share one pool. One process, one database user,
   one connection pool; a transaction spans the stores that user's grants reach. Two carve-outs may sit
   outside that pool: a **migrator connection** for DDL at boot, which commits on its own and never carries
   a business transaction, and a small **lock pool** whose sessions hold long-lived advisory locks, so a
   held lock never occupies a connection the work itself needs.
4. **Units take one context parameter.** A constructed unit (a service, a worker context) receives one
   scoped view of the root carrying everything it may touch: its config branch, the shared clients, a
   tagged child logger. Derived values are computed once at construction — the inputs are immutable until
   restart; a getter that re-derives a constant per call is waste.
5. **Fail loud at the seam.** A name the root did not wire, a value that parses to garbage, a branch a unit
   expected — each throws naming the missing thing at the earliest read. A fallback exists only for genuine
   absence with a documented meaning, never to paper over a set-but-wrong value ([fail-loudly](fail-loudly.md)).

## Why

When infrastructure is acquired ambiently, nobody can say what a process touches, tests must patch module
state, and a second process silently shares or duplicates connections. A single root makes the footprint
readable in one place, makes every unit constructible in a test with fakes, and turns a missing wire into
a boot failure instead of a runtime surprise.

## How to apply

```ts
// server.ts — the root
const config = loadConfig();
const logger = createLogger(config.log);
const pool = createPool(config.db.url);          // a value, not a name
const cache = createCache(config.cache.url);
const clock = systemClock;

const app = createApp({ config, logger, pool, cache, clock });
await app.listen(config.http.port);

// a unit receives one scoped context
interface BillingContext {
  config: Config['billing'];
  pool: Pool;
  clock: Clock;
  logger: Logger;
}

export class Billing {
  private readonly graceMs: number;
  constructor(private readonly ctx: BillingContext) {
    this.graceMs = ctx.config.graceDays * 86_400_000; // derived once
  }
}

const billing = new Billing({ config: config.billing, pool, clock, logger: logger.child({ unit: 'billing' }) });
```
