# Type safety: the checker sees every value

**Rule.** The type checker is given no blind spot: the strictest type-aware lint runs on every package, no
assertion overrides a type, anything from outside the process is parsed before it is trusted, "optional" means
absent, never an explicit `undefined`, and code runs as written under a type-stripping runtime.

## Rules

1. **The strictest type-aware lint runs on every typed package, tests included.** Its findings are fixed, never
   suppressed. A rule switched off is switched off in the lint config with its reason beside it — for the whole
   project (a framework idiom it misreads), or per file only as rule 2's named exception; never inline.
2. **No type assertion but `as const`.** A cast tells the checker to stop checking. The value gets a real type
   instead: an annotation, a type guard, `satisfies`, a generic that carries the type, or a schema parse. Where a
   library's types genuinely cannot express a value (a query builder's dynamic columns, a partial test double),
   the exception is named in the lint config, file by file, with the reason beside it.
3. **Anything from outside the process is parsed, not cast** — a third party's JSON reply, a stored string read
   back, a cache value, an API answer read by a client. A schema declares the fields the code reads and parses the
   value where it enters — never a hand-written type guard, which is a copy of the schema that drifts. An `any`
   never flows into typed code. A value that fails its parse is the source's fault: a stored value or a message
   reads as absent; a reply is a server-side error, never the caller's 400. A test's assertion subject
   (`expect(await res.json())`) is not a use — the assertion is the check.
4. **Optional means absent.** A field typed optional may be missing; it is never present with the value
   `undefined` (`exactOptionalPropertyTypes`). Data — a record, a stored state, an answer — leaves the key out. A
   parameter bag whose `undefined` is documented to mean "no constraint" (a query's filter, pagination, an options
   object, a component's props) declares it: `limit?: number | undefined`. A props object passed to a third-party
   component drops its unset keys.
5. **On the wire, absent means unchanged and `null` means cleared.** No caller has to send every field; a partial
   update asks "was it sent" with `!== undefined`, and uses `== null` where absent and cleared mean the same.
6. **A condition the types prove always true or always false is a finding.** Either the type is wrong (the value
   can be missing and the type says it cannot — fix the type) or the check is dead (remove it).
7. **A named function or method declares its signature.** Every parameter carries its type, and a return type is
   mandatory once the answer is a value — only a `void` answer may stand bare. What a declaration leaves to
   inference is a contract the reader learns from the body, and one the next body can change without declaring
   it. An inline callback handed to a framework or a `.map` is a use, not a declaration: it takes its types from
   where it stands.
8. **Write only erasable TypeScript.** Code that runs under a type-stripping runtime (Node's type stripping,
   `--experimental-strip-types`) or must stay ready to has no constructor parameter properties and no `enum`:
   fields are declared explicitly and assigned in the constructor, and a closed set of values is an `as const`
   object with a union type derived from it.

Rule 1 is typescript-eslint's `strict-type-checked` preset; rule 2 is
`@typescript-eslint/consistent-type-assertions` with `assertionStyle: "never"`; rule 4 is the compiler's
`exactOptionalPropertyTypes`; rule 6 is `@typescript-eslint/no-unnecessary-condition`; rule 7 is enforced by a lint
rule where the project wires one (closest standard: `@typescript-eslint/explicit-function-return-type` with
`noImplicitAny`); rule 8 is the compiler's `erasableSyntaxOnly`. All of them run in the gate.

## Why

Each blind spot is a place the checker has silently stopped working: a cast asserts what nobody verified, an
`any` from a `.json()` call spreads untyped through everything it touches, and an explicit `undefined` in an
optional field makes "not sent" and "sent as nothing" the same to the type while code treats them differently. A
type-stripping runtime removes types and nothing else, so syntax that compiles to runtime code fails there. The
strict preset and the flags cost a one-time sweep; after it, a change that reopens a hole is refused at the gate
instead of found in production.

## How to apply

- A cast becomes a typed value (rule 2); where none is possible, its file joins the config's named exceptions
  with the reason.
- `const body = await res.json()` becomes `const body = replySchema.parse(await res.json())`, the schema naming
  only the fields read.
- A `?? fallback` or `if (x)` the lint calls unnecessary: fix the type, or delete the dead branch.

```ts
// rule 4 — never
const data = {
  field: maybeUndefined,
};
// always
const data = {
  ...(maybeUndefined !== undefined
    ? {
        field: maybeUndefined,
      }
    : {}),
};

// rule 8 — never
enum JobState {
  Queued,
  Running,
}
class JobRunner {
  constructor(private readonly params: JobRunnerParams) {}
}

// always
const JOB_STATE = {
  queued: "queued",
  running: "running",
} as const;
type JobState = (typeof JOB_STATE)[keyof typeof JOB_STATE];

class JobRunner {
  private readonly params: JobRunnerParams;

  constructor(params: JobRunnerParams) {
    this.params = params;
  }
}
```
