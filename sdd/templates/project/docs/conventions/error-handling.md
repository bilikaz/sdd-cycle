# Error handling

**Rule.** Every caught value is normalized before it is read; every error message states what failed, with
enough context to act on without a stack trace. One bad item does not abort a batch, boot refuses only what it
needs, a dependency outage stays distinguishable from a bad request, a call that can hang is bounded, and a
failure the API publishes carries its own code and status.

## Rules

1. **Normalize unknown throws.** `catch (e)` binds `unknown` (`useUnknownInCatchVariables`, on under `strict`);
   `(e as Error).message` is a cast, not a check — it yields `undefined` when a non-`Error` was thrown, and the
   log line loses its cause. Every catch site that reads the error goes through one helper (see How to apply).
   The `(e as Error)` cast is banned: a search for it returns nothing.
2. **A message states what failed, with its context.** An error is `Error` with `context: detail` and names the
   subject it is about — its id or value — so it stands on its own: `` `GitLab API 403: ${body}` ``,
   `"missing LLM_URL. Pass --llm-url or set LLM_URL."`. It states the failure, never only the expectation it
   guards: `"Order 42 not found right after it was created"`, not `"orders are stored before use"`. The why behind a
   guard belongs in a comment beside it ([source-comments](source-comments.md)), not in the message.
3. **Per-item catch in batches.** When processing independent items, one failure is caught, logged with the
   item's identity and counted, and the loop continues. One bad item must not abort the run.
4. **Fail fast at startup, for what boot needs.** Boot validates presence, required keys and the values the code
   computes with, refusing with an actionable hint before any network or work happens. It does not validate what
   the platform the value is handed to already refuses — a cron the scheduler refuses at registration, a
   duplicate a unique index refuses, a shape the database schema enforces — nor input that fails loudly on first
   use: a typo, a malformed cron or a wrong API key fails at once and visibly, and that failure is the guard. A
   validator exists only where wrong input would be accepted and fail silently
   ([realistic-failures](realistic-failures.md)). A value typed by its concept's one shape — an entity's id by
   that id's type — is not a validator but the concept's shape ([canonical-shapes](canonical-shapes.md)), and
   stays.
5. **Exit codes are the contract** for CLI tools run as gates: success, policy failure and usage error get
   distinct codes; logs explain, codes decide.
6. **Error classes are named `<X>Error`** and reserved for failures a caller might meaningfully catch by type;
   everything else throws plain `Error` with a good message ([naming](naming.md)).
7. **Surface dependency outages; don't bury them.** An unreachable backing dependency is categorically different
   from a bad request, and the difference must survive to whoever can act on it. Throw a typed error at the point
   of contact (rule 6), map it at the boundary to a distinct status the caller can branch on (503, not a generic
   500), and carry a message plain enough to relay verbatim. Where the operation can still partially succeed,
   degrade and annotate — return what you have plus a note saying what was skipped and why. This applies where
   the caller's contract needs an outcome; an explicitly fire-and-forget operation follows its delivery contract
   instead and gains no retries or recovery state from this rule ([durable-execution](durable-execution.md)).
8. **Bound calls that can hang.** A throw is recoverable; a promise that never settles is not — `.catch` cannot
   fire on a non-rejection. A cross-process or external call whose far side is wedged can hang forever. Where the
   call takes an `AbortSignal`, `AbortSignal.timeout(ms)` bounds it;
   otherwise wrap it in a timeout that resolves a safe fallback, so the worst case is a bounded wait and a
   degraded result. Do not retry a call that *timed out* (as opposed to one that answered empty) — the far side
   is wedged, and another attempt burns the timeout again.
9. **A low layer names the universal facts; the human words are the caller's.** A repository, a client or any
   other low layer that refuses names only what it knows for any caller — the table or resource and the key of
   what is missing or already held — never a domain's words, which it cannot know. One shared mapping answers an
   unhandled one generically (a referenced entity gone: 404, `details` `<table>: <id>`). A service that knows
   what the thing is may catch it and answer in human words — a save that links users answers "User not found"
   with the missing users' ids — and only where it knows; it never invents what the low layer did not say.
10. **A published failure carries its own code and status.** A failure the API publishes to its consumers carries
    its code and status as data, set when it is constructed, so it cannot exist without them. The codes live in
    the module whose contract lists them; the shared renderer builds the response from what the failure carries
    and names no module's codes. A failure with no published code stays a plain error that the standard pipeline
    classifies. Adding, dropping or renaming a code is a change to the shared contract.

## Why

A caught value of unknown shape read as an `Error` loses the cause exactly when it is needed. A message read
where the failure surfaces — a log line, a test failure, a 500 — is read by someone who has not opened the code;
one that states only the guarded expectation leaves them to work out whether it held or broke. A consumer that
gets a generic 500 for an outage cannot tell "the service is down" from "your input was wrong", so it can
neither retry sensibly nor tell the user what happened. A hung promise is worse than any throw because nothing
downstream ever runs. A code is a promise to a consumer; a central map from error class to code rots apart from
the modules that make the promise, and a failure assembled at render time can be assembled wrongly.

## How to apply

```ts
// rule 1: the one normalizer
export function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null) {
    try {
      return JSON.stringify(error);
    } catch {
      return "an unserializable thrown object";
    }
  }
  return String(error);
}
```

An `Error` answers its message, another object its JSON (a circular one the fixed literal, not
`[object Object]`), and every primitive, `null`, `undefined`, function or symbol `String(error)`.

```ts
// rule 3: one bad item is logged and counted, the batch continues
let failed = 0;
for (const comment of comments) {
  try {
    await postComment(comment);
  } catch (error) {
    failed += 1;
    log.warn("comment.failed", { commentId: comment.id, error: errorMessage(error) });
  }
}
```

```ts
// rule 7: the boundary maps a typed outage to a relayable status
router.onError((error, context) =>
  error instanceof ServiceDownError
    ? context.json({ error: error.message }, 503)
    : context.json({ error: errorMessage(error) }, 500),
);

// partial success degrades instead of throwing
try {
  hits.push(...(await semanticSearch(query)));
} catch (error) {
  if (!lexicalQuery) {
    throw error;
  }
  note = "semantic search unavailable — service down; lexical matches only";
}
```

```ts
// rule 8: a call that cannot be aborted resolves a fallback after a bound
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    let done = false;
    const settle = (value: T) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(value);
      }
    };
    const timer = setTimeout(() => settle(fallback), timeoutMs);
    promise.then(settle, () => settle(fallback));
  });
}
const status = await withTimeout(worker.requestStatus(), STATUS_TIMEOUT_MS, "unknown");
```

```ts
// rule 10: the code travels with the failure; the renderer reads it
export class PublishedError extends Error {
  private constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) {
    super(message);
  }

  static tooManyItems(limit: number): PublishedError {
    return new PublishedError("too_many_items", 422, `The request carries more than ${limit} items.`);
  }
}

router.onError((error, context) =>
  error instanceof PublishedError
    ? context.json({ code: error.code, error: error.message }, error.status)
    : context.json({ error: errorMessage(error) }, 500),
);
```
