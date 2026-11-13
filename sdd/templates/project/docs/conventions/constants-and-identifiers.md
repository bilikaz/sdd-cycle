# Constants and identifiers

**Rule.** A value that changes behaviour gets a name; a value that identifies an entity comes from one generator;
a value that persists gets a namespaced key. Unnamed literals are where behaviour hides.

## Rules

1. **Behavioural literals are named.** Any number that changes what the program does — timeouts, poll intervals,
   retry counts, token budgets, size caps — is a named `UPPER_SNAKE` module-level constant next to its use
   (`FETCH_TIMEOUT_MS`, `OUTPUT_CAP_BYTES`, `MAX_RETRY_ATTEMPTS`). The name states the unit when one exists
   (`_MS`, `_BYTES`); where the value itself needs a reason, it is given beside the constant in the form
   [source-comments.md](source-comments.md) allows.
2. **Presentation literals stay inline.** Pixel sizes, spacing classes, icon dimensions — naming them adds
   indirection without meaning. The test: would a different value change *behaviour* or only *looks*?
3. **One id generator.** Entity and call ids come from `crypto.randomUUID()` (or the platform's single
   equivalent) — never `Math.random()`, timestamps or counters. Mixed generators mean mixed collision properties
   and unsearchable id formats. Any other id family (a slug, a trace id) is a named exception the convention that
   owns it defines ([data-model-naming.md](data-model-naming.md), [traceability.md](traceability.md)).
4. **Seeds are not ids.** A number fed to a generator as randomness (a seed for a random or generative process)
   is not an identifier: it may come from `Math.random()` and stays numeric. Its name says it is a seed, so a
   cleanup pass does not "fix" it into a UUID.
5. **Persisted keys are namespaced and named.** Every `localStorage`, IndexedDB or file-cache key lives under one
   app prefix (`<app>:<feature>`) and is a named module-level constant, never an inline string. The prefix makes
   the app's persisted footprint greppable and avoids collisions with anything else on the origin; the constant
   makes a rename a one-line migration site.

## Why

Inline literals are invisible at review and unfindable when debugging. Naming costs one line; the payoff is that
a search answers "what are this app's timeouts, keys and budgets" instead of a code-reading session.

## How to apply

```ts
// never
await fetch(url, {
  signal: AbortSignal.timeout(15000),
});
const id = `${Date.now()}-${Math.random()}`;
localStorage.setItem("draft", text);

// always
const FETCH_TIMEOUT_MS = 15 * 1000;
const DRAFT_STORAGE_KEY = "myapp:editor:draft";

await fetch(url, {
  signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
});
const id = crypto.randomUUID();
localStorage.setItem(DRAFT_STORAGE_KEY, text);

const imageSeed = Math.floor(Math.random() * 2 ** 32);
```
