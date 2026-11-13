# Canonical shapes: one concept, one shape, end to end

**Rule.** A domain concept gets one canonical shape that every layer speaks — stores persist it, boundaries pass
it through. A union of look-alike shapes told apart by sniffing (`"field" in obj`) is the smell that says the
canonical shape is missing.

## Rules

1. **An answer has one shape.** A function, a service or an endpoint answers one shape. A refusal is never an
   answer shape (`{ conflict: true } | { userId }`, `{ refused: reason }`) but a thrown error carrying what its
   caller needs; the caller that must know more (a refused login's reason) catches that error class. A value that
   may be one of several outcomes says which in one field of the one shape (`requiresTwoFactor: boolean`,
   `state: "enroll"`).
2. **A union of object shapes is never told apart with `"key" in value`.** An `in` on a single type — an
   `unknown` being narrowed (`"code" in err`), a record's key — reads no union and stays.
3. **A union of object shapes is declared only with its reason.** A type, a schema union or a function answer
   made of two or more object shapes carries `// @union <why>` on its declaration
   ([source-comments.md](source-comments.md) rule 4). Most unions that cannot name a why are a missing shape
   (rule 1). What earns one: messages that truly differ on one channel (an event bus's events, told by `type`); a
   type that demands a field in exactly one case (an icon-only button's `aria-label`). A library's own unions are
   its API, not a declaration here.
4. **Model the shape after how the data is entered and owned**, not after what one consumer finds convenient. If
   users configure "a provider hosting models", the shape is `{ provider: {…}, model: {…} }` — and a per-call
   override can then overlay one half without touching the other.
5. **Unify the discriminant axes.** Two fields meaning "which kind" on two shapes (`provider: "x"` vs `api: "x"`)
   become one field with one union on the one shape.
6. **Push the shape into the stores.** A canonical shape only at runtime still needs translations at every store;
   a canonical shape in the stores makes boundaries pass-throughs. Layer-specific extras extend the canonical shape
   (`interface SettingsView extends Settings { … }`) and ride along harmlessly.
7. **Derive, don't store, presentation.** Stored display labels and other derived fields are where shapes start
   diverging again.
8. **Converging stored shapes decides migration explicitly.** Carrying old-shape readers forever is the
   translation layer sneaking back; resetting low-value local state, with the owner's sign-off, is often cheaper.
   The reset mechanism is a data-version stamp stored with the data: on load, data older than the code's version is
   wiped and re-seeded, so a breaking shape change is a one-line version bump. An unstamped store is grandfathered
   when the change is forward-compatible (unknown fields drop, missing ones default). Either way the decision is
   recorded.
9. **One canonical source; lossy backends get a round-trip check.** When one shape spans interchangeable backends,
   one source of truth is named and every backend mirrors it — never the reverse. A whole-object store (a JSON
   column, a document store) is lossless by construction; a typed-column store silently drops any field it has no
   column for. The lossy backend gets a round-trip or compile-time parity check, so the next added field fails a
   check instead of vanishing only where that backend runs.
10. **Churning, never-queried fields share one bag, guarded as one field.** A cohesive set of pure round-trip state
    (written every cycle, never filtered or indexed) is one sub-object on the canonical shape, stored by a typed
    backend as one opaque JSON value; the parity check (rule 9) guards the bag as a single field, and a new flag in
    it needs no schema change. Identity and queryable fields keep their own columns — an identity field buried in
    the bag loses the index it will need.
11. **A forwarding event carries the produced record whole, not a projection.** An event or message that hands a
    consumer a record another component produced carries the canonical record, not the one or two fields the first
    consumer reads. A projection forces an emit-site change and a re-flatten each time a consumer needs one more
    field, and the event drifts from the record; the whole record stays a pass-through (rule 6, applied to events).

Rules 2 and 3 are enforced by type-aware lint rules where the project wires them; ESLint has no standard rule for
either.

## Why

When one concept exists in two shapes, every boundary grows a translator, the translators grow guards
(`"provider" in target ? … : …`), and the guards grow fake-object shims to satisfy the other side's type. None of
that code does domain work — it exists only because the shapes disagree, and it migrates to the next boundary when
one caller is fixed. The fix is never a better translator; it is making the shapes agree.

## How to apply

Before: `resolve()` returns `FlatA | NestedB`, and consumers sniff and fake one shape out of the other. After:
every source returns the canonical shape, the consumer is one lookup with no branches, and the "unsupported"
special cases collapse into ordinary errors.

```ts
// never: refusal as an answer shape, told apart by sniffing
type SignUpAnswer = { conflict: true } | { userId: string };
const answer = await signUp(input);
if ("conflict" in answer) {
  return reply409();
}

// always: one answer shape; the refusal is thrown
async function signUp(input: SignUpInput): Promise<{ userId: string }> {
  if (await usersRepo.emailTaken(input.email)) {
    throw new ConflictError({
      code: "email_in_use",
    });
  }
  return {
    userId: await usersRepo.insert(input),
  };
}

// a declared union, with its reason
// @union bus events differ by channel and are told apart by `type`
type BusEvent =
  | {
      type: "job.started";
      jobId: string;
    }
  | {
      type: "job.failed";
      jobId: string;
      error: string;
    };

// session runtime state in one bag; identity stays a column
interface Session {
  id: string;
  parentId: string | null;
  meta: {
    usedTokens: number;
    lastModel: string;
  };
}
```
