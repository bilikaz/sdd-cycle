# Types placement: `types.ts` holds vocabulary

**Rule.** Every folder with a shared contract has a `types.ts`, but it holds *vocabulary* — the names several
modules must speak — not every type in the folder. Small functions that define what a contract term means live
there too; cross-cutting helpers live in `shared.ts`; everything with one owner stays beside its behaviour.

## Rules

A type moves to `types.ts` when **any** of rules 1–3 holds:

1. **Two importers** — it is imported by name from two or more modules in the folder.
2. **Boundary** — it is imported from outside the folder; it is the folder's public contract.
3. **Family** — it is structurally connected to types that qualify above. Families move together: a request type
   rides with the message shapes it composes; one vocabulary is never scattered across files.

A type stays beside its behaviour when **both** of rules 4–5 hold:

4. **No name consumers** — its only use is structural: a parameter type filled by object literals, an inferred
   return type, an error nobody catches by type, or an unexported internal.
5. **Single-owner change cycle** — it describes one function's surface or internals and should change freely
   whenever that function does.

Functions follow the same promotion logic, split by whether they define *meaning* or do *work*:

6. **`types.ts` also holds vocabulary functions** — small functions that define what a domain term means: a
   canonical predicate, a URL-to-implementation dispatch, a key format every consumer must reproduce. Changing one
   changes the meaning of the contract, so it lives with the contract.
7. **`shared.ts` holds cross-cutting helpers** used by several sibling modules — assembly and orchestration
   mechanics, not domain meaning. A contract is never placed in `shared.ts`, and a folder without such helpers has
   no `shared.ts`.
8. **A single-consumer helper stays with its consumer**, like a single-owner type. It moves to `shared.ts` only
   when a second sibling genuinely needs it — essential duplication, not an incidental look-alike
   ([consolidation.md](consolidation.md)).

Across packages:

9. **A type-only need crosses a package boundary with `import type`.** It erases at build and run time: a value
   import is a runtime edge, a type import only a compile-time one. A lower layer typed against a higher layer's
   contract it must not load accepts a handle of that type as a parameter and never constructs or imports the
   runtime — no cycle, no load-order coupling. The manifest declares that dependency as type-only (a dev or peer
   dependency, per the toolchain), so it says what is really needed.

## Why

Placement communicates blast radius. `types.ts` says "shared and stable — changing me ripples outward";
colocation says "mine — changes freely with its function". Filing single-owner types in `types.ts` breaks both
signals: readers need two files to understand one function, editors treat local changes with false caution, and
the contract file degrades into a junk drawer that no longer answers "what is this subsystem's vocabulary".

Parameters and results are asymmetric: callers pass object literals, so parameter types acquire no import sites,
but they name result types when passing them on. A function's result type often promotes while its parameter
type stays put — that is the rule working.

## How to apply

Litmus for a function: if rewording it would change what a domain statement *means*, it is vocabulary and goes to
`types.ts`. If it would only change *how* work gets done, it is a helper — `shared.ts` when shared, colocated when
not.

```ts
// billing/types.ts — vocabulary: named by several modules and by callers outside the folder
export interface Invoice {
  id: string;
  dueAt: Date;
  paidAt: Date | null;
}
export function isOverdue(invoice: Invoice, now: Date): boolean {
  return invoice.paidAt === null && invoice.dueAt < now;
}

// billing/render.ts — single owner: stays beside its function
interface RenderLineParams {
  label: string;
  amountCents: number;
}
function renderLine(params: RenderLineParams): string {
  return `${params.label}: ${(params.amountCents / 100).toFixed(2)}`;
}

// queue/worker.ts — a lower layer typed against a higher contract it must not load
import type { JobHandler } from "@app/jobs";
export function runWorker(handler: JobHandler): void {
  // …
}
```
