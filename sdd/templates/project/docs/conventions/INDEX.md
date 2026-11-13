# Conventions

Binding engineering rules for a TypeScript project, one topic per file: the rule, why it exists, how to apply
it. A project keeps this folder as its own — it adds its topics, records a deviation where it departs from a
rule, and adopts a rule for new and changed code without rewriting what already stands.

## Code shape

| Topic | Rule in one line |
|---|---|
| [naming.md](naming.md) | A name says the role it plays at the use site, in full words, with no qualifier the scope already says |
| [code-layout.md](code-layout.md) | Every `if` / `else` / loop body is a braced block on its own line; one property per line; nesting opens one level per line |
| [source-comments.md](source-comments.md) | A comment only where the code cannot show it — one checked form, English, no task or ticket ids, no history |
| [file-granularity.md](file-granularity.md) | Files split by concern — never a file per constant, helper or few-line class |
| [types-placement.md](types-placement.md) | `types.ts` holds vocabulary several files share; everything else colocates; `import type` across packages |
| [canonical-shapes.md](canonical-shapes.md) | One concept, one shape end to end; a refusal is thrown, never a second answer shape |
| [constants-and-identifiers.md](constants-and-identifiers.md) | A behavioural literal is named; ids come from one generator; persisted keys are namespaced |
| [type-safety.md](type-safety.md) | The strictest type-aware lint; no assertion but `as const`; outside data parsed, not cast; only erasable syntax |
| [one-door.md](one-door.md) | A folder's `index` is its one door: the outside imports only it, its own files never import it |

## Design discipline

| Topic | Rule in one line |
|---|---|
| [consolidation.md](consolidation.md) | Extract only essential or near-universal duplication; code born as a copy is extracted at its second consumer |
| [earn-the-abstraction.md](earn-the-abstraction.md) | A generic seam only for a consumer you can see; no one-caller pass-through |
| [no-dead-code.md](no-dead-code.md) | What a change makes obsolete goes in the same change, across its whole reach |
| [realistic-failures.md](realistic-failures.md) | Handle the failures ordinary operation reaches; a coincidence gets no code, no test and no finding |

## Failure and runtime

| Topic | Rule in one line |
|---|---|
| [fail-loudly.md](fail-loudly.md) | A path that cannot know the answer refuses — never a plausible substitute; a blind guard fails |
| [error-handling.md](error-handling.md) | Normalize what is caught; a message states what failed; per-item catch in batches; bound calls that can hang |
| [logging.md](logging.md) | Structured events under scoped child loggers; logging never fails what it observes |
| [configuration.md](configuration.md) | One env read point; typed config injected; exported defaults; settings validated by shape; fail fast at boot |
| [composition-root.md](composition-root.md) | One visible root per process; dependencies injected down, never acquired ambiently |
| [capability-injection.md](capability-injection.md) | Platform parts installed onto a shared context at the root; agnostic code gates on their presence |
| [capability-gating.md](capability-gating.md) | One predicate gates an affordance, enforced where it is advertised and where it is invoked |

## Data and testing

| Topic | Rule in one line |
|---|---|
| [data-model-naming.md](data-model-naming.md) | Tables plural; `<singular_table>_id` keys; one generated single-column primary key; natural keys are unique constraints |
| [ownership-keys.md](ownership-keys.md) | Never upsert on a key that decides ownership; never unbind the last credential |
| [destructive-actions.md](destructive-actions.md) | A delete names exactly what it destroys; deleted listed items leave visible tombstones |
| [testing.md](testing.md) | Mock at the port, drive real engines, assert structure; a model-dependent result is judged over runs |

## Where the project has them

| Topic | Applies where | Rule in one line |
|---|---|---|
| [docker.md](docker.md) | containers | Fixed environment layout, local runtime identity, isolated resources, host-wide shared services |
| [service-ports.md](service-ports.md) | containers | Port bands, service numbers and publication boundaries |
| [durable-execution.md](durable-execution.md) | a replay runtime or a job queue | Every side effect rides a memoized step; a job carries references and its intent; durable or fire-and-forget is settled per operation, and only named durable operations retry |
| [llm-interfaces.md](llm-interfaces.md) | model calls | Stable schemas, catalogs as data, bounded resubmitted payloads, one placeholder primitive |
| [pluggable-backends.md](pluggable-backends.md) | interchangeable backends | One feature, a per-record backend discriminant, an adapter per backend behind a neutral type |
| [module-registries.md](module-registries.md) | a keyed family of implementations | The folder layout is the registry: one module per implementation, resolved by path |
| [traceability.md](traceability.md) | handed-off work | Handed-off work carries a trace id one registry creates; the work completes it |
