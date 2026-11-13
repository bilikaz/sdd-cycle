# Canonical shapes: one concept, one shape, end to end

**Rule in one line:** a domain concept gets ONE canonical shape that every
layer speaks — stores persist it, boundaries pass it through — and a union of
look-alike shapes discriminated by sniffing (`"field" in obj`) is the smell
that says the canonical shape is missing.

## Rules

1. **An answer has one shape.** A function, a service or a route answers one shape; a refusal is never an answer
   shape (`{ conflict: true } | { userId }`, `{ refused: reason }`) but a thrown error carrying what its caller needs
   (services rule 5) — the caller that must know more (a refused login's reason, for its trail)
   catches that error class. A value that may be one of several outcomes says which in one field of the one shape
   (`requiresTwoFactor: boolean`, `state: "enroll"`).
2. **A union of object shapes is never told apart with `"key" in value`.** An `in` on one type — an `unknown`
   narrowed (`"code" in err`), a record's key — reads no union and stays.
3. **A union of object shapes is declared only with its reason.** A type, a schema union or a function's answer
   that is two or more object shapes carries `@union <why>` in the comment on its declaration — the tag is the
   conscious choice, and most unions that cannot name a why are a missing shape (rule 1). What earns one: messages
   that truly differ on one channel (a bus's events, told by `type`); a type that demands a field exactly in one
   case (an icon-only button's `aria-label`). A library's own unions are its API, not a declaration here.

## Why

When the same concept exists in two shapes (a flat settings record here, a
nested registry record there), every boundary grows a translator, and the
translators grow guards (`"provider" in target ? … : …`), and the guards grow
fake-object shims to satisfy the other side's type. None of that code does
domain work — it exists only because the shapes disagree. Worse, the
translators don't die when one caller is fixed; they migrate to the next
boundary. The fix is never a better translator; it's making the shapes agree.

## How to apply

1. **Model the shape after how the data is entered/owned**, not after what one
   consumer finds convenient. If users configure "a provider hosting models",
   the shape is `{provider: {...}, model: {...}}` — and a per-call override
   bag can then overlay one half without being able to touch the other.
2. **Unify the discriminant axes.** Two fields meaning "which kind" on two
   shapes (`provider: "openai"` vs `api: "openai"`) become one field with one
   union on the one shape.
3. **Push the shape into the stores.** A canonical shape only at runtime still
   needs seam translations from every store; a canonical shape IN the stores
   makes boundaries pass-throughs. Layer-specific extras extend the canonical
   shape (`interface Settings extends CanonicalShape { uiExtras… }`) — they
   ride along harmlessly.
4. **Derive, don't store, presentation** (display labels etc.) — stored
   derived fields are where shapes start diverging again.
5. **When converging stored shapes, decide migration explicitly.** Carrying
   old-shape readers forever is the translation layer sneaking back in;
   resetting (with the owner's sign-off) is often cheaper than migrating
   low-value local state. Either way the decision is recorded, not implied.
   The mechanism for the reset path is a **data-version stamp**: store a
   version with the data and, on load, wipe + re-seed when the stamp is older
   than the code's — so a breaking shape change is a one-line version bump, not
   scattered back-compat readers. An unstamped store is grandfathered when the
   change is forward-compatible (unknown fields drop, missing ones default).
6. **Pick one canonical source; mind lossy backends and guard the round-trip.**
   When one canonical shape spans interchangeable backends, name a single source
   of truth and make every backend mirror it — backends adopt the canonical
   shape, never the reverse. Backends are *not* equally shape-faithful: a
   whole-object/blob store (a JSON column, an IndexedDB object store) is lossless
   by construction — a new field rides along automatically — while a
   typed-column store (a SQL schema with an explicit DTO mapping) silently
   **drops** any field it has no column for. So a field added to the canonical
   shape persists fine through the blob backend and vanishes through the typed
   one, invisible until it changes behaviour. Add a round-trip / compile-time
   **parity check** on the lossy backend so the next added field fails a check
   instead of disappearing only when that backend is active. The trap that bit:
   fields persisted fine locally (blobs) and were silently lost on the remote
   (typed columns) until behavior broke.
7. **Group churning, never-queried fields into one bag — guarded as one field.**
   When a cohesive set of fields is pure round-trip state (written every cycle,
   never filtered or indexed), give them ONE sub-object on the canonical shape and
   let the typed backend store it as a single opaque JSON value, not a column each.
   It's still one shape end to end — both sides carry the same bag — so the parity
   check (rule 6) guards the bag as a single field; its contents stay unguarded, so
   a new flag in the bag needs no schema change. Reserve this for runtime state:
   identity/queryable fields still earn their own columns. The opposite split — an
   *identity* field buried in the bag — loses the index you'll want. Example: a
   session's per-turn `usedTokens`/`lastModel`/`errorKind`/… ride in one `meta`
   object, while `containerId`/`parentId` stay columns.

## Example

Before: `resolve()` returns `FlatA | NestedB`; consumers sniff shape and fake
one shape out of the other. After: every source returns `CanonicalShape`;
the consumer is one lookup with zero branches — and the "unsupported"
special-cases collapse into ordinary absent-capability errors.

## Additional shared rules

8. **A forwarding event carries the produced record whole, not a projection.** An event or message that hands a
    consumer a record another component produced carries the canonical record, not the one or two fields the first
    consumer reads. A projection forces an emit-site change and a re-flatten each time a consumer needs one more
    field, and the event drifts from the record; the whole record stays a pass-through (rule 6, applied to events).

12. **A point in time is a unix timestamp in seconds — the preferred shape.** Time is held, passed and stored as
    an integer count of seconds since the epoch, compared and computed with plain arithmetic; a date object or a
    formatted string exists only at the edge that parses or displays it. Milliseconds only where a rule needs that
    precision — a duration of fast work, an order within one second — and then the name says so (`…Ms`). The
    project records its preference for new fields in the workspace map (*Project preferences*): a project whose
    stored time is already date-times, where converting would cost more than it returns, keeps date-times; either
    way the field's name says which it is ([naming](naming.md) rule 9).

Rules 2 and 3 are enforced by type-aware lint rules where the project wires them; ESLint has no standard rule for
either.
