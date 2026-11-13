# Module registries

**Rule.** When a family of implementations is selected by a key, the folder layout is the registry: one module
per implementation at `<kind>/<key>.ts`, each exporting one canonical name. Resolution derives the path from the
key, and a missing file is the "unsupported" error.

## Rules

1. **One module per implementation,** named by its key and grouped by kind: `providers/text/completion.ts`,
   `exporters/csv.ts`. A kind's abstract base lives in that folder's `base.ts`.
2. **One canonical export name** across all modules (every module exports `class Provider`). The resolver depends
   on the name, not on per-module knowledge; the path already says which one it is.
3. **Resolve by parsing, not by listing.** Derive the path from the selection keys and look it up in an eagerly
   collected module map (a bundler glob import, or a generated static manifest). The error names the missing
   coordinate.
4. **Absence is the capability statement.** Don't write "X cannot do Y" guards; the missing cell answers. If a
   combination needs a special message, phrase the lookup error well once.
5. **Non-implementations may share the folder** (a `base.ts`, content modules) because keys come from a closed
   union that never contains them.
6. **Enumerate-and-instantiate registries filter to the family.** A registry that instantiates every module in a
   folder has no key to miss, so (a) it instantiates only exports that are members of the family
   (`v.prototype instanceof Base`), and (b) shared helpers live in a sibling folder the glob does not reach.
7. **Keep the glob out of the base module.** An eager glob compiles to static imports hoisted above the module
   body; in the base's own module it loads implementations that `extends Base` before `Base` exists — a
   "class extends undefined" cycle. The glob lives in a separate dispatcher or the composition root (see
   [composition-root](composition-root.md)); the base module stays pure declaration.
8. **Runtime entries are first-class.** A registry may accept entries discovered after construction (a connected
   server's operations, a loaded extension's commands). They register the same implementation type the static
   path produces — no parallel "dynamic entry" shape — so lookup, gating and teardown treat them identically. Tag
   each runtime entry with its owning source so the group drops when the source disconnects, and keep a
   `registeredName → source coordinates` map so dispatch never parses a display name back into coordinates.

## Why

A hand-maintained dispatch (a `switch`, a routing table, per-kind factories) states the file system's
information twice, and the copies drift: tables fork per kind, switches grow special cases, and adding an
implementation becomes an N-file change. When the path is the registry, adding an implementation is dropping a
file, deleting one removes it everywhere, and "there is no `text/generate` provider" falls out of the lookup
instead of guard code.

## How to apply

```ts
const MODULES = import.meta.glob<{ Provider?: ProviderCtor }>("./providers/*/*.ts", { eager: true });

export function resolveProvider(kind: Kind, type: ProviderType): ProviderCtor {
  const ctor = MODULES[`./providers/${kind}/${type}.ts`]?.Provider;
  if (!ctor) throw new Error(`there is no ${kind}/${type} provider`);
  return ctor;
}

// Enumerate-and-instantiate variant: filter to the family.
export function buildAllTools(deps: ToolDeps): Map<string, Tool> {
  const tools = new Map<string, Tool>();
  for (const mod of Object.values(TOOL_MODULES)) {
    const ctor = mod.Tool;
    if (ctor?.prototype instanceof BaseTool) {
      const tool = new ctor(deps);
      tools.set(tool.name, tool);
    }
  }
  return tools;
}
```

- Static side-tables on the canonical class extend the registry without new lookups
  (`Provider.listModels?.()` — capability by presence).
- A `switch` over implementation keys, or a guard restating what a missing file already says, is a finding.
