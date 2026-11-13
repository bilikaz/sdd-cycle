# Error handling

**Rules.**

1. **Normalize unknown throws.** `catch (e)` binds `unknown`; `(e as Error).message`
   is a cast, not a check — it yields `undefined` when a non-Error was thrown, and
   the log line silently loses its cause. Every catch site goes through one helper:

   ```ts
   export function errorMessage(error: unknown): string {
     if (error instanceof Error) {
       return error.message;
     }
     if (typeof error === "string") {
       return error;
     }
     try {
       return JSON.stringify(error);
     } catch {
       return String(error);
     }
   }
   ```

   The `(e as Error)` cast is banned; grep for it should return nothing.

2. **Context-prefixed messages.** Throw `Error` with `context: detail`
   ("`GitLab API 403: …`", "`missing LLM_URL. Pass --llm-url or set LLM_URL.`").
   The message must let the admin act without a stack trace.

3. **Per-item catch in batches.** When processing N independent items (posting N
   comments, resolving N threads), one failure is caught, logged with its item's
   identity, counted — and the loop continues. One bad item must not abort the run.

4. **Fail fast at startup, for what boot needs.** Boot validates presence, required
   keys and the values the code computes with, refusing with an actionable hint
   before any network or work happens. It does not validate what a platform the
   value is handed to already refuses — a cron Inngest refuses at registration, a
   duplicate a unique index refuses (repositories rule 3), a
   shape the database's schema enforces — nor input that fails loudly on its first
   use: a typo, a malformed cron, a wrong provider API key fails at once and
   visibly — an error, a refused registration, a 401 — and that failure is the
   guard; no validator or test is written for it. A validator exists only where
   wrong input would be accepted and fail silently
   ([realistic-failures](realistic-failures.md)). A value typed by its concept's one
   field — a model id by the model id's field, wherever it is held — is no validator
   written for it but the concept's shape ([canonical-shapes](canonical-shapes.md)),
   and stays.

5. **Exit codes are the contract** for CLI tools running as gates: success / policy
   failure / usage error get distinct codes; logs explain, codes decide.

6. **Error classes are named `<X>Error`** (the API's `AppError` family excepted: `AppError<Kind>`, see
   [naming](naming.md) rule 6) and reserved for failures a caller might
   meaningfully catch by type; everything else throws plain `Error` with a good
   message.

7. **Surface dependency outages; don't bury them.** When a backing dependency (a
   downstream service, an encoder, a database) is unreachable, that is categorically
   different from a bad request — and the distinction must survive to whoever can
   act on it. Throw a typed error at the point of contact (rule 6), map it at the
   boundary to a *distinct* status the caller can branch on (e.g. 503, not a generic
   500), and carry a message plain enough to relay verbatim. Where the operation can
   still partially succeed, **degrade and annotate** rather than fail wholesale —
   return what you have plus a note saying what was skipped and why. The failure mode
   this prevents: a generic 500 (or a silent success on a fire-and-forget write)
   leaves the consumer unable to tell "the service is down" from "your input was
   wrong," so it can neither retry sensibly nor tell the user what happened.

   ```ts
   // boundary maps the typed outage to a relayable status
   router.onError((error, context) =>
     error instanceof ServiceDownError
       ? context.json(
           {
             error: error.message,
           },
           503,
         )
       : context.json(
           {
             error: errorMessage(error),
           },
           500,
         ),
   );

   // partial success degrades instead of throwing
   try {
     hits.push(await semanticLeg(query));
   } catch (error) {
     if (!lexicalQuery) {
       throw error;
     }
     note = "semantic search unavailable — service down; lexical matches only";
   }
   ```

8. **Bound calls that can hang.** A throw is recoverable; a promise that *never
   settles* is not — `.catch` can't fire on a non-rejection. A cross-process or
   external call can hang forever when the far side is wedged: a renderer
   `executeJavaScript` or a CDP command against a page stuck mid-navigation (a dead
   host / DNS failure), an IPC `invoke` whose handler is missing. Wrap such calls in
   a timeout that resolves a safe fallback, so the worst case is a bounded wait and a
   degraded result, not a hung operation. Don't retry a call that *timed out* (vs.
   one that resolved empty) — the far side is wedged; another attempt just burns the
   timeout again.

   ```ts
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
   const text = await withTimeout(readPageText(webContents), READ_TIMEOUT_MS, "");
   ```

9. **A low layer names the universal facts; the human words are the caller's.** A repo, a client or any
   other low layer that refuses names only what it knows for any caller — the table (or resource) and the
   key of what is missing or already held — never a domain's words, which it cannot know. One shared mapping
   answers an unhandled one generically (a referenced entity gone: 404, `details` `<table>: <id>`). A service
   that knows what the thing is may catch it and answer in human words — the RAGs save answers "RAG not
   found" with the missing RAGs' ids — and only where it knows; it never invents what the low layer did not
   say.

## Additional shared rules

10. **A published failure carries its own code and status.** A failure the API publishes to its consumers carries
    its code and status as data, set when it is constructed, so it cannot exist without them. The codes live in
    the module whose contract lists them; the shared renderer builds the response from what the failure carries
    and names no module's codes. A failure with no published code stays a plain error that the standard pipeline
    classifies. Adding, dropping or renaming a code is a change to the shared contract.
