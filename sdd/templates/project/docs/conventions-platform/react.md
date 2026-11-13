# React components

**Rule.** Components are plain named functions over typed props, reading state
through hooks. The component layer renders; it does not own engine state or
reach into store internals.

## Rules

1. **Named function declarations, exported by name** — `export function
   SessionView(...)`. No `React.FC`, no default exports: named exports keep
   imports greppable and rename-safe; `React.FC` adds nothing but an implicit
   `children`. Where a framework demands a default (a Next page), the file that
   demands it exports its own screen as the default — [app-routes](app-routes.md) rule 1.
2. **Props are typed inline or via a local interface.** Destructure in the
   parameter list for small prop sets; destructure in the body (or use
   `props.x`) when the list is long enough that the signature stops being
   readable.
3. **State access is hooks-only.** Components call `use<Thing>()` hooks; they
   never import a store object or call its getters directly. The hook is the
   subscription; direct reads silently skip re-renders.
4. **List keys use a stable identity when items have one** (an id, a unique
   url). Index keys are acceptable only for immutable render-only lists —
   content that is appended and re-rendered but never reordered or removed
   item-by-item. An editable list with index keys is a reorder bug waiting.
5. **Event handlers are `on<Event>`** (`onPickFiles`, `onScroll`) — both the
   prop name and the local function.
6. **Async handlers never leak rejections.** Wrap awaited work in try/catch or
   call APIs that return result objects; deliberate fire-and-forget is an
   explicit `void fn()`, so every floating promise is visibly intentional.
7. **Inline `style` only for values computed at runtime** (a percent width, a
   measured height). Static styling belongs in classes — a hardcoded inline
   style is a class that escaped review.
8. **Blocks are never nested; they move out when shared.** A component never
   declares another inside its body (a nested definition re-creates on every
   render and can't be reused or tested). A block only one component uses is a
   top-level function in that component's file; it gets its own file the moment
   a second component needs it. Splitting a file into one-block files for their
   own sake is noise, not structure.
9. **Streaming/append-heavy lists memoize at the leaves.** When a store
   updates immutably, objects the mutation didn't touch must keep reference
   identity — that stability is load-bearing, not incidental: list leaves wrap
   in `memo(function Name() { … })` (the sanctioned `const`-export exception to
   rule 1) and bail by reference, so one item's change re-renders one item.
   Cloning items "for safety" in a store mutation silently breaks every memo
   below it; derived lookups a parent rebuilds per render are compared by the
   entries a leaf reads, not by container identity.
10. **Server-side singletons key on `globalThis`, not module scope — in any
    framework that bundles entrypoints separately.** Meta-frameworks compile each
    route handler / server entry as its own bundle with its own module registry, so
    a module-level `let`/`Map`/client set in one handler is **not** visible in
    another — an in-process singleton (a session storage, a connection pool, a cache)
    silently splits into one-per-bundle. Hang it off `globalThis` behind a typed
    accessor instead: `const g = globalThis as { __store?: T }; const store =
    g.__store ??= make();`. Plain module scope is correct only for values that are
    fine to recompute per bundle (pure constants, stateless helpers). This is the
    server side of the framework app — the same discipline as one-way component
    state, applied to process-global state.

## Why

These rules make the component layer boring on purpose: every component looks
the same shape, state flows one way through hooks, and nothing in the render
tree holds engine logic hostage. Boring components are the ones you can move,
split, and test without archaeology.
