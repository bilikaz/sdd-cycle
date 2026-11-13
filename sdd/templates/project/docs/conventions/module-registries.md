# Module registries: the folder layout IS the registry

**Rule in one line:** when a family of implementations is selected by a key,
make the folder layout the registry — one module per implementation at
`<kind>/<key>.ts`, each exporting one canonical name; resolution parses the
key to the path, and a missing file *is* the "unsupported" error.

## Why

Hand-maintained dispatch (a `switch`, a routing table, per-kind factory
functions) is the same information stated twice: once in the file system,
once in code. The copies drift — tables fork per kind, switches grow special
cases, and "add an implementation" becomes an N-file change. When the path is
the registry, adding an implementation is dropping a file, deleting one
removes it everywhere, and the failure mode ("there is no `text/generate`
provider") falls out of the lookup instead of needing guard code.

## How to apply

1. **One module per implementation**, named by its key, grouped by kind:
   `providers/text/openai.ts`, `providers/image/generate.ts`,
   `exporters/csv.ts`. The abstract base for a kind lives in that folder's
   `base.ts`.
2. **One canonical export name** across all modules (e.g. every module exports
   `class Provider`) — the resolver depends on the name, not per-module
   knowledge. The file path already says which one it is; the class name
   doesn't repeat it.
3. **Resolve by parsing, not by listing**: derive the path from the selection
   keys (`` `${kind}/${type}.ts` ``) and look it up in an eagerly collected
   module map (`import.meta.glob` under Vite; an equivalent static manifest
   elsewhere). Throw a message that names the missing coordinate.
4. **Absence is the capability statement.** Don't write "X cannot do Y"
   guards; let the missing cell answer. If a combination needs a special
   message, phrase the lookup error well once.
5. Modules that aren't implementations (a kind's `base.ts`, content modules)
   may live in the same folders — they simply never match a key, because keys
   come from a closed union that doesn't contain `base`.
6. **Enumerate-and-instantiate variant.** Some registries don't resolve one
   implementation by key — they instantiate *every* implementation in a folder
   (e.g. a tool registry that pre-builds all tools by name). Here there is no key
   to "not match", so absence can't filter out non-implementations. Two rules keep
   it safe: **(a) filter to the family** — instantiate only modules whose export is
   actually a member of the family (`v.prototype instanceof Base`), so a sibling
   helper export is ignored, not constructed; and **(b) keep non-implementations
   out of the globbed set** — put shared helpers in a sibling `helpers/` folder the
   glob doesn't reach, not beside the implementations. Relying on convention alone
   (only-implementations-here) breaks the first time a helper is added next to them;
   the family filter is the cheap guard that makes the mistake a no-op instead of a
   crash.
7. **Keep the glob out of the base module.** Bundlers compile an eager glob to static imports **hoisted to
   the top of the module** — they run before the rest of the file body. If the glob lives in the same module
   as the family's abstract base class, it imports the implementation modules (which `extends Base`) *before*
   the `class Base` declaration has executed — a "class extends undefined" cycle at load. Put the glob in a
   separate module (a dispatcher, or the composition root) that imports the base; the base module stays pure
   declaration. (Resolve-by-key registries already glob at the call site; the trap is specific to the
   enumerate-and-instantiate variant tempted to self-glob.)
8. **Runtime entries — a dynamic source.** A registry built from a static glob can still accept entries
   added *after* construction, when a source is discovered only at runtime (a connected server's operations,
   a loaded extension's commands). Keep them **first-class**: register the same implementation type the
   static path produces — not a parallel "dynamic entry" shape — so lookup, gating, and teardown treat them
   identically and there is no second code path. Two guards make it safe: **(a) tag each runtime entry with
   its owning source** so the whole group drops when that source disconnects/disables; and **(b) keep a
   `registeredName → source coordinates` map** on the registrar, so dispatch resolves through the map and
   never parses a (possibly prettified, possibly colliding) display name back into coordinates. The static
   "absence is the error" rule is unaffected — runtime entries simply add rows to the same table, gated by
   the same predicate.

## Example

```ts
const MODULES = import.meta.glob<{ Provider?: ProviderCtor }>("./providers/*/*.ts", {
  eager: true,
});

function resolve(kind: Kind, type: Type): ProviderCtor {
  const ctor = MODULES[`./providers/${kind}/${type}.ts`]?.Provider;
  if (!ctor) throw new Error(`there is no ${kind}/${type} provider.`);
  return ctor;
}
```

Static side-tables on the canonical class extend the registry without new
lookups (e.g. `Provider.listModels?.()` — capability by presence).
