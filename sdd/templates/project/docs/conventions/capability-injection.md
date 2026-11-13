# Capability injection

**Rule.** Host- or platform-specific capabilities are installed onto a shared context object at the
composition root. Agnostic code consumes them through that context and never branches on which host it
runs in. A capability the current host lacks is an absent optional member, and callers gate on its
presence.

## Rules

1. **One composition root builds the context.** Each platform has a single `init()` that constructs the
   shared carrier and installs the parts that differ (the storage backend, IPC-backed services, native
   dialogs, a tool runner). The boot is the only place that knows the host ([composition-root](composition-root.md)).
2. **Agnostic code depends on the carrier, not the platform.** It imports neither a platform module nor an
   `isPlatformX()` check; it reads `ctx.<capability>` and uses it.
3. **Optional capability = optional member; gate on presence.** A host that cannot do something does not
   install that method; callers write `ctx.host.thing?.(…)` — present means supported, absent means not.
   No platform flag, no `if (isDesktop)`.
4. **Cross-process state is data, not the live object.** When a capability executes in another process,
   only a serialisable snapshot crosses the boundary; the live client or handle is re-created on the far
   side.
5. **Detect the platform once, at boot, by feature presence** (`'showOpenFilePicker' in window`), not by a
   build flag — then never again.

## Why

Branching on the host inside agnostic modules scatters platform knowledge across the codebase and makes
those modules untestable in isolation and unrunnable on a second host. Pushing the host-specific parts up
to the root and consuming them through one carrier keeps every other module blind to the platform.
Presence-gating beats a capability flag because the type already states what may be missing; there is
nothing to keep in sync. When a feature must also be hidden from a catalog or refused at execution, see
[capability-gating](capability-gating.md).

## How to apply

```ts
// shared carrier: optional members are the capabilities a host may lack
export interface HostServices {
  openFile?(): Promise<string | undefined>;
  notify?(message: string): void;
}

export interface AppContext {
  storage: Storage;
  host: HostServices;
}

// desktop/init.ts — the only place that knows the host
export function init(): AppContext {
  return { storage: new FileStorage(), host: { openFile: nativeOpenFile, notify: nativeNotify } };
}

// web/init.ts — this host cannot notify, so it simply doesn't install it
export function init(): AppContext {
  return { storage: new IndexedDbStorage(), host: { openFile: browserOpenFile } };
}

// agnostic code: no platform check, "unsupported" is a normal branch
export async function importDocument(ctx: AppContext): Promise<void> {
  const path = await ctx.host.openFile?.();
  if (!path) return;
  ctx.host.notify?.(`Imported ${path}`);
}
```
