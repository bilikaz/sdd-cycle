# Capability injection: platform parts on the carrier, gated on presence

**Rule.** Host- or platform-specific capabilities are injected onto a shared context
object at the composition root; agnostic code consumes them through that context and
never branches on which host it runs in. A capability the current host lacks is an
absent optional member, and callers gate on its presence.

## Rules

1. **One composition root builds the context.** Each platform has a single `init()`
   that constructs the shared carrier and installs the parts that differ (the storage
   backend, IPC-backed services, native dialogs, the tool runner). The boot is the only
   place that knows the host.
2. **Agnostic code depends on the carrier, not the platform.** It imports neither a
   platform module nor an `isPlatformX()` check; it reads `ctx.<capability>` and uses it.
3. **Optional capability = optional member; gate on presence.** A host that can't do
   something simply doesn't install that method; callers write `ctx.host.thing?.(…)` —
   present means supported, absent means not. No platform flag, no `if (isDesktop)`.
4. **Cross-process state is data, not the live object.** When a capability executes in
   another process, only a serializable snapshot crosses the boundary; the live
   client/handle is re-minted on the far side. Never try to ship the object itself.

## Why

Branching on the host inside otherwise-agnostic modules (`if (isElectron) … else …`)
scatters platform knowledge across the codebase and makes the agnostic layers
un-testable in isolation and un-runnable on a second host. Pushing the host-specific
parts up to the composition root and consuming them through one carrier keeps every
other module blind to the platform — it reads a member or calls an optional method, and
the boot decided what that member is. Presence-gating beats a capability flag because
the type already states what may be missing; there is nothing to keep in sync.

## How to apply

- Give the app a single context object available everywhere work happens.
- Per platform, write one `init()` that fills it: parts every host shares are built in
  the constructor; the parts that differ are installed here.
- Model host services as an interface of **optional** methods; each platform supplies
  what it can. Callers use `?.()` and treat "unsupported" as a normal branch.
- Detect the platform exactly once, at boot, by feature presence (e.g. `"x" in window`),
  not a build flag — then never again.

## Additional shared rules

5. **Detect the platform once, at boot, by feature presence** (`'showOpenFilePicker' in window`), not by a
   build flag — then never again.
