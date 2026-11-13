# Durable execution: every side effect rides a memoized step

**Rule.** In a replay-based durable-execution runtime (Inngest, Temporal, Restate — anything that
re-runs the function body and memoizes completed steps), **no side effect may live as plain code in
the function body**. Every write, post, send, or external call is wrapped in a durable step with a
replay-stable id; plain code between steps must be pure computation over step results.

## Rules

1. **Wrap the effect, not the region — and an effect that changes a store's own row is a transaction.**
   Each externally-visible action gets its own step (`step.run(id, fn)`), so a retry replays exactly that
   action's memoized result instead of re-performing it. An **external** write — one whose target is another
   process — never lands inside a database transaction and cannot be rolled back with it, so the two are
   separate effects and each gets a step. What is one by nature is wrapped as one: a transaction is a region,
   not a step — a step body may open one and do its writes inside it, and they succeed or roll back together.
   An effect that changes a row of a store this code runs against — the write of a record, a state, a
   deletion — is therefore a transaction of its own, never a wrapped step or a plain call.
   A Job engine owns claim and outcome, while the worker commits its own business transactions.

2. **Stable, centrally-minted step ids.** Ids come from one constants object beside the service that runs
   the steps ([file-granularity](file-granularity.md) rule 1), parameterized by position (`…ask:<n>`), never
   by timestamps or random values — a drifted id breaks replay and a duplicated id silently merges two
   effects.
3. **The rule extends through injected contexts.** When a framework hands sub-components a step
   handle (a resource, an activity, a callback), the component's own side effects are bound by the
   same rule — give it the step runner *and* an id-minting surface, and audit its writes like the
   host's.
4. **Nondeterminism is a side effect too.** `Date.now()`, `Math.random()`, UUID minting that feeds
   an effect — capture them inside a step (or derive from step output) so replays see the same
   values.
5. **Test with a replay, not a mock.** A pass-through step fake proves logic, not durability. The
   regression that matters runs the real runtime through a checkpoint (a wait, a retry) and asserts
   the effect count stayed 1.
6. **The consumer re-derives truth on every (re)connect.** A durable runtime's emitted progress
   events are best-effort **notifications, not the record** — a replay can re-emit, a dropped
   connection loses pings, and a consumer that connects mid-run never saw the earlier ones. So any
   live-status consumer reads the durable **snapshot first, on *every* connect** (not just the
   first), *then* attaches to the stream, deduping by a stable id. The snapshot is truth; the stream
   is a latency optimization on top of it.
7. **A cross-process lease must self-heal.** When a shared resource is capped across processes (a
   concurrency lease, a distributed lock) via a store like Redis, a holder that **crashes mid-hold must
   not leak the lease forever**. Model each hold as a **lease with a TTL** (e.g. a ZSET member scored by
   expiry): every acquire prunes expired leases before taking one, so a dead holder's lease frees itself.
   A bare INCR/DECR counter has no recovery path — one crash and the cap is permanently short. Release
   also wakes waiters (a pub/sub ping), with a re-poll timeout as the backstop for a missed wake.
8. **An outside API's write is a job; its read is the request's.** A change a request makes to a service
   outside the process — a `POST`, `PATCH`, `DELETE` or any other write to a mail transport, a
   provider, an outside API — is queued as a job and made by its worker, never inline in the request. One cleanup is
   named beside it: a best-effort delete in the application's own storage, made after the request's
   transaction commits, logged when refused and never refusing the request, whose leftover the next write or a
   sweep repairs. Two doors
   write a job's row. A row of an action is a record of the action: an `…InTransaction` entry writes it as any other
   row, through the job service's `record`, in the action's transaction, and a row the store refuses rolls the whole
   action back (the application transaction law). A job outside an action — a scheduled or background enqueue,
   an outside write whose own record has no transaction to join — is its own write: the request saves its
   record, queues the job through the `queueInTransaction` door and answers success. Through that door a job that fails,
   or could not be queued, is a failed job in the Jobs report. A screen reads that same persisted outcome
   under rule 9 rather than keeping its own failure record; a row whose own write the store refuses is logged,
   the one record left of it. A failed
   queueing never refuses the door's caller; the door reached inside an open transaction throws
   `RepoNestedTransactionError` before it writes the row — a defect of the caller, never of the request
   (the application transaction law). A job
   is queued through the `job` service and sent once; a row its queue never ran stays `queued`, and the job
   requeue sends it again once it has waited past the configured requeue interval — a row whose worker this
   engine never registered is the one thing that ends `failed` `no such worker: <name>` unsent — that pass
   fails it instead of sending it. A read the screen needs for its step (a `GET`, e.g. a provider's model
   listing) is made in the request.

9. **Long-running requests return a Job for polling.** User-requested processing that can exceed the
   HTTP response deadline runs through the existing job system. The acceptance request validates access
   and input bounds, durably stages any input the worker needs, and records the job before returning
   `202 Accepted` with its job id. It waits only for acceptance, leaving expensive processing to the worker.
   If durable input or the job record cannot be saved, the request refuses rather than acknowledging
   work that cannot be recovered. Queue delivery and repeat-safe execution follow rules 1 and 8.
   A report read keyed by job id authenticates the caller and follows its declared access policy. It returns
   persisted status and the declared result/error fields, keeping internal Job params out of the response.
   Authenticated possession of an unguessable job id may be the declared read policy; an ownership check is
   not added when that policy deliberately permits shared report access.
   The initiating screen polls at its operation's declared interval and derives pending and completed
   outcomes from that read. A failed poll is a status-read failure, not a failed job. Reconnecting with
   the retained id reads the same job; it does not submit the operation again. Retry presentation follows
   the operation's delivery guarantees: a failed attempt has its own `finishedAt` and remains retryable by
   status, but that does not prove another retry is scheduled. A generic reader shows that failure with an explicit reread when
   automatic progress is uncertain. Processing
   success is reported only from a finished job. Inputs belong to Job params JSON and successful work returns
   its result to the runtime. Temporary file inputs use shared temporary storage with configured age cleanup;
   expiry produces an actionable re-upload error while the saved Job report remains available. The rationale
   is the operation's declared access policy.

10. **Keep durable workers self-contained; add recovery only when required.** Each Job attempt uses
    its persisted params and current authoritative data; it does not depend on request memory, another Job's
    transient state, or an invented retry counter. Keep attempts independently repeatable. Prefer one
    atomic business transaction for an attempt so a thrown failure rolls back that transaction and the Job
    engine records the failed outcome in its own transaction. If work must commit incremental or external
    effects that cannot roll back with the attempt, make each committed stage safe to repeat and document
    the specific recovery need. Do not add extra guards, locks, leases, cleanup scans or recovery Jobs unless
    the task explicitly requires them or an irreversible side effect makes them necessary.

## Why

Memoized effects separate replay from delivery. Each effect keeps its identity across replay, while its
explicit delivery contract determines whether failures retry. Persisted work is the authority for progress;
notifications only reduce the delay before a reader refreshes that state.

An action's Job row and mandatory audit record are part of that action and share its atomicity. Queue
notifications are a separate delivery mechanism. Attempt state belongs to the Job engine, and worker
business transactions commit under their own boundaries.

## How to apply

- When writing any code inside a durable function (or a component it calls), ask of every line:
  *"if this ran three times, would anything outside notice?"* If yes, it goes in a step.
- Grep test: side-effecting calls (`db.insert`, `fetch`, `post`, `send`) inside a durable function
  file but outside a `step.run` callback are findings.
- When a framework contract exposes a wait/park handle to plugins, expose the step runner with it —
  a handle that can only wait invites unwrapped effects around the wait.
- For any live-status consumer (SSE/WebSocket relay, progress subscriber), assert the reconnect case
  in a test: connect *after* the run has emitted, and confirm the snapshot alone carries the full
  state. A consumer that snapshots only on the first connect is a finding.
- For a worker of the job engine, ask of every line of a task method instead: *"what does a second run of
  this do?"* — the work's writes stand once made and a retry runs the method again (rule 1), so every effect
  it makes, a store write as much as an outside call, is safe to repeat by the method's own shape; a method
  that writes its own row's status or mints an id for the outcome is a finding of its own.
- Grep: a request handler's write to an outside API that is not a queued job — a `POST`, `PATCH` or
  `DELETE` to a provider, a mail send, a queue — is a finding; so is a screen that reports a failed outside
  write from its own record instead of reading the Jobs report.

## Additional shared rules

11. **A job carries references, never records.** Its params hold ids and codes, and the handler re-resolves its
    subject from the store; a nested params object resolves entirely to plain serializable values. A caller holding
    the record still sends its references. A handler that re-resolves behaves the same whether it runs inline or
    on a worker.
12. **A job carries its intent, not its routing.** A job's type names what it does — never its callers, its
    transport or the use cases it serves, in code or in a comment. The routing and the callers know the job; the
    job knows neither.
13. **Settle durable or fire-and-forget per operation.** The design names which calls and side effects must be
    durable and which may be sent and forgotten; a status message or notification is not implicitly durable. An
    unanswered delivery decision is settled with the design, never invented by an implementer or reviewer from a
    failure scenario.
14. **Only named durable operations retry, within their stated budget.** Name the operation, its attempt limit and
    its terminal behaviour; three attempts means three in total, not three more per layer. No retry wrapper, queue,
    later resend or recovery flow renews an exhausted operation.
15. **Deduplicate writes that are explicitly retryable.** A named retryable external write derives one stable dedup
    handle per intended write and reuses it across its attempts, passing it to the target where supported. A receipt
    store, lookup-before-create or reconciliation flow needs an explicit delivery requirement and a reachable retry
    scenario ([realistic-failures](realistic-failures.md)).
16. **Fire-and-forget may end without delivery.** Make the normal send attempt and let its outcome end there, with
    normal error logging — no receipt, retry or reconciliation state. Inside a durable function the attempt still
    rides a memoized step, and an ordinary send error completes that step rather than retrying delivery or blocking
    the enclosing work. Replay protection and delivery retry policy are separate concerns.
17. **A retry or recovery proposal is judged against the settled contract** — the operation's delivery mode, attempt
    budget and terminal behaviour; a dependency being down does not change that contract.
