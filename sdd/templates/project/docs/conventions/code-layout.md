# Code layout: every branch is a block

**Rule.** An `if`, `else` or loop always takes a braced block with its body on its own line; an object that maps
a key to a value is written one property per line; a call nested more than two levels deep opens one level per
line; and a value whose meaning is not its digits is a name, not a literal. The linter and the formatter enforce
what they can, so no review has to.

## Rules

1. **Every `if` / `else` / loop body is a braced block**, even a one-statement guard.
2. **The body starts on its own line** — no `if (x) { return; }` on one line.
3. **An object with a `key: value` is one property per line.** Once an object literal maps a key to a value it is
   data the reader has to analyse. An object made only of names — `{ slug, language }`, `{ ...change }` — passes
   values along and may stay on one line.
4. **A call chain nested deeper than two levels opens one level per line**, each indented one step. A constructor
   building nested values reads top-down when every level starts its own line, and each level is judged at its
   own line, not decoded from the middle of an expression. Where the formatter would fold the levels back onto
   one line, the inner levels become named constants instead.
5. **A literal whose meaning is not its digits is a named constant.** A protocol or platform value — an HTTP
   status, a signal, an exit code — uses the constant the platform or a library already defines, or one the
   project names once; a behavioural value follows [constants-and-identifiers.md](constants-and-identifiers.md).
   A test may write the literal where the value is what its assertion pins.
6. **A derived constant shows its derivation.** `90 * 24 * 60 * 60 * 1000`, not `7776000000`: the reader checks
   the arithmetic and sees the unit.
7. **No source file silences a tool.** No `prettier-ignore`, `eslint-disable…`, `@ts-ignore`, `@ts-expect-error`
   or `@ts-nocheck` in source; an exception is a file-level override in the tool's own config, its reason beside
   it.
8. **Everything else is the formatter's.** Layout the rules above do not fix is left to the project's formatter
   (Prettier), checked in the gate.

Rules 1–2 are ESLint's `curly: ["error", "all"]` and `brace-style: ["error", "1tbs", { allowSingleLine: false }]`.
Rule 3 is enforced by a lint rule where the project wires one; the formatter keeps an object expanded once its
first property is on its own line. Rule 7 is enforced by a gate check where the project wires one.

## Why

A condition and its action on one line hide the branch: the eye reads a statement, not a decision, and a second
statement added later lands outside the guard. A line of `key: value` pairs hides data the same way — which value
goes with which key is read pair by pair. Deep nesting on one line hides the structure the code builds. A bare
number makes the reader remember what it means, and a precomputed one hides its unit. One shape everywhere, fixed
by tools, costs nobody a thought.

## How to apply

```ts
// never: braceless, one-line branch (rules 1–2)
if (refusal) throw refusalError;
// always
if (refusal) {
  throw refusalError;
}

// never: data on one line (rule 3)
throw new ForbiddenError({ code: refusal, message: refusalMessages[refusal] });
// always
throw new ForbiddenError({
  code: refusal,
  message: refusalMessages[refusal],
});
// names only: one line
await usersRepo.query({ userId });

// never: three levels on one line (rule 4)
const order = new Order(new Customer(new Address(street, city)), items);
// always: one level per line, or named levels where the formatter would fold them
const address = new Address(street, city);
const customer = new Customer(address);
const order = new Order(customer, items);

// never (rules 5–6)
if (response.status === 404) {
  return undefined;
}
const RETENTION_MS = 7776000000;
// always
if (response.status === HTTP_STATUS.NOT_FOUND) {
  return undefined;
}
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
```
