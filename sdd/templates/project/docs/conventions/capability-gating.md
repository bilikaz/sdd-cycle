# Capability gating

**Rule.** An affordance that is useless or harmful without a runtime capability gates on one predicate,
and that predicate is checked at both boundaries the affordance can be reached through: where it is
*offered* (the catalog or schema a caller picks from) and where it is *invoked* (the executor).

## Rules

1. **One source of truth for "can this run".** Expose a single predicate (`canRun()`, `isSupported()`)
   that reads the capability off the injected carrier — the resolved client or config, not a global or a
   re-derived guess ([capability-injection](capability-injection.md)). Both gates call the same predicate,
   so they cannot disagree.
2. **Filter the catalog with it.** The list of affordances offered to a caller (tool schemas sent to a
   model, actions in a menu, entries in a permission editor) excludes anything the predicate rejects.
3. **Re-check at the point of execution.** The executor calls the same predicate before doing the work and
   refuses with a clear "not available" result if it fails. This is not redundant: the caller may not have
   come through the catalog — a hand-written request, a fabricated tool call, a stale UI.
4. **Match the predicate to the control's truth.** If a setting is a plain boolean checkbox, gate on
   `=== true`, not "truthy unless explicitly false"; an unset value must read the way the UI renders it.
5. **Gate on the right capability.** A feature that feeds a secondary service (a recogniser, a converter)
   gates on *that* service being configured, not on the primary actor's capabilities.

## Why

A gate that exists only where things are advertised fails silently the moment something reaches the
affordance another way, and it can be lost in a refactor with nothing to catch it, because the executor
never shared the check. One predicate called at both boundaries makes the gate a property of the
affordance, not of one code path.

## How to apply

```ts
export const describeImage: Tool = {
  name: 'describe_image',
  canRun: (ctx) => ctx.vision !== undefined && ctx.config.vision.enabled === true,
  async run(ctx, input) {
    if (!this.canRun(ctx)) return { error: 'describe_image is not available' };
    return ctx.vision!.describe(input.imageUrl);
  },
};

// catalog: offer only what can run
export function toolSchemas(ctx: Context, tools: Tool[]) {
  return tools.filter((tool) => tool.canRun(ctx)).map(toSchema);
}
```
