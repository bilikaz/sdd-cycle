# Types placement: `types.ts` holds vocabulary

**Rule.** Every folder with a shared contract has a `types.ts` — but it holds
*vocabulary* (names multiple modules must speak), not every type in the folder.
Small domain functions that belong to the contract are welcome there (URL dispatch,
canonical predicates).

## Promotion test — a type moves to `types.ts` when ANY of:

1. **Two-importer rule** — imported *by name* from 2+ modules in the folder.
2. **Boundary rule** — imported from outside the folder; it is the folder's public
   contract.
3. **Family rule** — structurally connected to types that qualify above; families
   move together (a request root type rides with the message/tool-call shapes it
   composes — splitting one vocabulary across files scatters it).

## Stays beside its behavior when BOTH hold:

1. **No name consumers** — its only use is structural: a parameter type checked via
   object literals, an inferred return type, a throw nobody catches by type, or an
   unexported internal.
2. **Single-owner change cycle** — it describes one function's surface or internals
   and should change freely whenever that function does.

## Why

Placement communicates **blast radius**. `types.ts` says "shared and stable —
changing me ripples outward"; colocation says "mine — changes freely with its
function". Filing single-owner types in `types.ts` breaks both signals: readers need
two files to understand one function, editors treat local changes with false
caution, and the contract file degrades into a junk drawer that no longer answers
"what is this subsystem's vocabulary".

Note the parameter/return asymmetry: callers pass object literals (parameter types
acquire no import sites) but *name* result types when passing them onward — so a
function's result type often promotes while its args type stays put. That's the
rule working, not an inconsistency.

## Where functions live: `types.ts` vs `shared.ts` vs colocation

The same promotion logic governs functions, with one extra distinction — does the
function define *meaning* or do *work*?

- **`types.ts`** also holds small functions that are part of the vocabulary: they
  define what a domain term means (a canonical predicate like "open bot thread", a
  URL→implementation dispatch, a scope-join format every sink must reproduce).
  Changing one changes the *meaning* of the contract, so it lives with the contract.
- **`shared.ts`** holds cross-cutting *helpers* used by multiple sibling modules:
  multi-step assembly and orchestration work (build the prompt envelope, load
  colocated assets, construct a metric from a result). They encode shared mechanics,
  not domain meaning. A contract is **never** placed in `shared.ts`, and a folder
  that has no such helpers has no `shared.ts`.
- **Colocation** — a helper with a single consumer stays in (or next to) that
  consumer, exactly like a single-owner type. It promotes to `shared.ts` only when a
  second sibling genuinely needs it — essential or universal duplication, not incidental
  look-alikes.

Litmus: if rewording the function would change what a domain statement *means*,
it's vocabulary → `types.ts`. If it would only change *how* work gets done, it's a
helper → `shared.ts` (if shared) or colocated (if not).

## Crossing a package boundary: `import type` is a compile-time edge, not a runtime one

A type can cross a package boundary **without** creating a runtime dependency. When
module A needs only *types* from B — but B already depends on A at runtime, or you
simply don't want A to load B — import them with `import type`, which erases at
build/run time (a value import is a runtime edge; a type import is only a
compile-time edge). A then speaks B's vocabulary at the type level while staying
runtime-independent of it: **no cycle, no load-order coupling.** The canonical shape
is dependency injection — A's functions accept a B-typed handle as a parameter
(`import type { Handle } from "b"`) and never construct or import B's runtime.

Declare the dependency as **type-only** (a dev/`peer` dependency, per the toolchain)
so the manifest reflects reality: A needs B's *types*, not its *code*. Reach for this
whenever a lower layer must be typed against a higher-layer contract it must not load
— it turns a would-be cycle into a one-directional runtime graph.
