# Durable execution

**Rule.** In a replay-based durable runtime — anything that re-runs the function body and memoizes completed
steps — no side effect lives as plain code in the function body: every write, post, send or external call is
wrapped in a durable step with a replay-stable id, and code between steps is pure computation over step results.
A write to an outside service is a queued job, never inline in a request; a job carries references and its
intent, and its worker re-resolves the rest and is safe to repeat. Progress streams are notifications; the stored
record is the truth.

## Rules

1. **Wrap the effect, not the region.** Each externally visible action gets its own step (`step.run(id, fn)`), so a
   retry replays that action's memoized result instead of re-performing it. An external write — one whose target
   is another process — never lands inside a database transaction and cannot roll back with it, so the two are
   separate effects, each with its own step. A transaction is a region, not a step: a step body may open one, and
   its writes succeed or roll back together. A change to a row of the code's own store — a record, a state, a
   deletion — is made in a transaction of its own, never as a bare call.
2. **Stable, centrally minted step ids.** Step ids come from one constants object beside the code that runs the
   steps, parameterized by position (`ask:<n>`), never by timestamps or random values. A drifted id breaks replay;
   a duplicated id silently merges two effects.
3. **The rule extends through injected contexts.** When the runtime hands sub-components a step handle (a wait, an
   activity, a callback), their side effects are bound by the same rule: give them the step runner and an
   id-minting surface along with the wait, and audit their writes like the host's.
4. **Nondeterminism is a side effect too.** The current time, random values and id minting that feed an effect
   are captured inside a step, or derived from step output, so replays see the same values.
5. **Test with a replay, not a mock.** A pass-through step fake proves logic, not durability. The test that matters
   runs the real runtime through a checkpoint (a wait, a retry) and asserts the effect count stayed one (see
   [testing](testing.md)).
6. **The consumer re-derives truth on every (re)connect.** Emitted progress events are best-effort notifications,
   not the record: a replay can re-emit, a dropped connection loses events, and a consumer that connects mid-run
   never saw the earlier ones. A live-status consumer reads the stored snapshot first on every connect, then
   attaches to the stream, de-duplicating by a stable id.
7. **A cross-process lease self-heals.** A resource capped across processes (a concurrency lease, a distributed
   lock) is modeled as leases with a TTL — e.g. sorted-set members scored by expiry — and every acquire prunes
   expired leases first, so a holder that crashed frees its lease. A bare increment/decrement counter has no
   recovery path. Release wakes waiters (a pub/sub ping), with a re-poll timeout as the backstop for a missed
   wake.
8. **An outside service's write is a job; its read is the request's.** A request's write to a service outside the
   process (a `POST`, `PATCH` or `DELETE` to a provider, a mail send) is queued as a job and made by its worker. A
   read the request needs to answer (a `GET` of a provider's listing) is made in the request. One cleanup may stay
   inline: a best-effort delete in the platform's own stores (its object store, its search index), made after the
   request's transaction commits, logged when refused and never refusing the request; the next write or a sweep
   repairs its leftover.
9. **Two doors write a job's row.** A job that is part of an action is a record of the action: it is written in
   the action's transaction like any other row, and a refusal of it rolls the whole action back. A job outside an
   action (a scheduled or background enqueue, an outside write with no transaction to join) is queued through a
   standalone door after the request saves its own record; the request then answers success. A job that fails, or
   could not be queued, shows as a failed job in the jobs report — the one place a failed outside write shows, so no
   screen keeps its own failure record. A failed queueing never refuses that door's caller; reaching that door
   inside an open transaction throws, as a defect of the caller.
10. **A job attempt is one transaction around claim and outcome, with the work outside it.** Where the project runs
    its own job table, an attempt claims the job's row (`FOR UPDATE SKIP LOCKED`) while it is `queued` or `failed`,
    awaits the worker's work outside that transaction, and lands one outcome before it commits: `finished` with the
    result, or `failed` with the error. The attempt locks only the job's own row; the bar that keeps outside calls
    out of a request's transaction does not apply to it, since the outside call is the job's work. A retry takes a
    `failed` row by status and overwrites its outcome; `finished` and `canceled` are terminal; a second delivery of
    a held or terminal row ends; a run that dies rolls back to the row as it stood. A row its queue never ran stays
    `queued` and a requeue pass re-sends it after a configured wait; a row naming an unregistered worker is failed
    instead.
11. **A worker handles a job and owns nothing of the engine.** A worker maps task names to handler methods; the
    engine looks the task up (an unknown task, or params that are not an object, fail the job) and calls the
    handler with the job (`{ jobId, worker, task, params }`). The handler returns a result or throws; it never
    claims, locks or marks its own row or mints an id for its outcome. Because an outside call can land while the
    commit fails, every effect a handler makes is safe to repeat by its own shape.
12. **A job carries references, never records.** Its params hold ids and codes, and the handler re-resolves its
    subject from the store; a nested params object resolves entirely to plain serializable values. A caller holding
    the record still sends its references. A handler that re-resolves behaves the same whether it runs inline or
    on a worker.
13. **A job carries its intent, not its routing.** A job's type names what it does — never its callers, its
    transport or the use cases it serves, in code or in a comment. The routing and the callers know the job; the
    job knows neither.
14. **Long-running requests return a job for polling.** Processing that can exceed the response deadline runs as a
    job. The accepting request validates access and input bounds, durably stages any input the worker needs,
    records the job and returns `202 Accepted` with its id; if the input or the job record cannot be saved, it
    refuses rather than acknowledging unrecoverable work. A read keyed by job id authenticates the caller under its
    declared access policy and returns persisted status and the declared result or error fields, never internal
    params. The initiating screen polls at its declared interval; a failed poll is a status-read failure, not a
    failed job; reconnecting with the retained id reads the same job and never re-submits. Success is reported only
    from a finished job. Staged temporary inputs have an age cleanup, and their expiry yields an actionable
    re-upload error while the job report stays readable.
15. **Workers are self-contained; recovery is added only when required.** An attempt uses its persisted params and
    current authoritative data — never request memory, another job's transient state or an invented retry counter.
    Prefer one atomic business transaction per attempt so a thrown failure rolls it back. Work that must commit
    stages or external effects that cannot roll back makes each stage safe to repeat. Extra guards, locks, leases,
    cleanup scans or recovery jobs are added only when the task requires them or an irreversible effect makes them
    necessary.

16. **Settle durable or fire-and-forget per operation.** The design names which calls and side effects must be
    durable and which may be sent and forgotten; a status message or notification is not implicitly durable. An
    unanswered delivery decision is settled with the design, never invented by an implementer or reviewer from a
    failure scenario.
17. **Only named durable operations retry, within their stated budget.** Name the operation, its attempt limit and
    its terminal behaviour; three attempts means three in total, not three more per layer. No retry wrapper, queue,
    later resend or recovery flow renews an exhausted operation.
18. **Deduplicate writes that are explicitly retryable.** A named retryable external write derives one stable dedup
    handle per intended write and reuses it across its attempts, passing it to the target where supported. A receipt
    store, lookup-before-create or reconciliation flow needs an explicit delivery requirement and a reachable retry
    scenario ([realistic-failures](realistic-failures.md)).
19. **Fire-and-forget may end without delivery.** Make the normal send attempt and let its outcome end there, with
    normal error logging — no receipt, retry or reconciliation state. Inside a durable function the attempt still
    rides a memoized step, and an ordinary send error completes that step rather than retrying delivery or blocking
    the enclosing work. Replay protection and delivery retry policy are separate concerns.
20. **A retry or recovery proposal is judged against the settled contract** — the operation's delivery mode, attempt
    budget and terminal behaviour; a dependency being down does not change that contract.

## Why

Replay engines re-execute the whole function body after every checkpoint, and only step results are memoized, so
plain code on that path runs once per replay: a post re-pings a person who already answered, a record is written
three times. Unit fakes are pass-through, so only a real replay shows it.

The job row is the record. An attempt that could end mid-state — a `running` row with no run, a `queued` row whose
event was lost — would be a defect of the engine; one transaction with one outcome writes no such state, and the
requeue answers the lost event. A queue is a notification path, so no caller is refused because it is down. A job
of an action is a record of the action and so rides its transaction. A message carrying a whole record serializes
badly, goes stale in transit and drags state the handler does not own; a message naming its callers or routing
points the dependency the wrong way and goes stale when either moves.

## How to apply

```ts
// Rules 1–2: each effect in its own step, ids from one constants object.
export const STEP = {
  saveAnswer: (n: number) => `save-answer:${n}`,
  postAsk: (n: number) => `post-ask:${n}`,
} as const;

export const handleQuestion = durable.fn("handle-question", async ({ event, step }) => {
  const askedAt = await step.run("captured-now", () => clock.now().toISOString()); // rule 4
  await step.run(STEP.postAsk(0), () => chat.post(event.data.channelId, event.data.question));
  const reply = await step.waitForEvent("answer", { timeout: "1d" });
  await step.run(STEP.saveAnswer(0), () => answers.insert({ question_id: event.data.questionId, reply, askedAt }));
});

// Rules 11–13: references and intent only; the handler re-resolves.
interface SendInvoiceEmail {
  invoiceId: string;
}

export class InvoiceWorker {
  readonly tasks = { sendInvoiceEmail: (job: Job<SendInvoiceEmail>) => this.sendInvoiceEmail(job) };
  private async sendInvoiceEmail({ params }: Job<SendInvoiceEmail>) {
    const invoice = await this.invoices.get(params.invoiceId); // re-resolve, never trust a carried record
    return this.mail.send(invoiceMail(invoice)); // safe to repeat: a duplicate send is the accepted case
  }
}
```

- Ask of every line inside a durable function: "if this ran three times, would anything outside notice?" If yes,
  it goes in a step. A side-effecting call (`insert`, `fetch`, `post`, `send`) outside a step callback is a finding.
- Ask of every line in a worker handler: "what does a second run of this do?" A handler that writes its own row's
  status or mints an id for its outcome is a finding.
- When a runtime exposes a wait handle to plugins, expose the step runner with it.
- For a live-status consumer, test the reconnect case: connect after the run has emitted and confirm the snapshot
  alone carries the full state.
- A request handler's write to an outside service that is not a queued job is a finding; so is a screen reporting
  a failed outside write from its own record instead of the jobs report, and a job param holding a whole record.
