# Traceability

**Rule.** Work that someone must follow after handing it off — a background job, a fan-out, a long run — gets a
trace id from one global trace registry before it starts. The id rides the work's own payload, the work marks it
completed once its outcome is stored, and anyone asks the registry whether that id is completed. Nothing is
followed by the runtime's event or run ids, and the registry records nothing but when an id was created and when
it was completed.

## Rules

1. **The registry creates the id.** The caller asks for an id for a tag naming the kind of work; the registry
   records the tag's last number plus one — the pair (tag, number) is the entry's key — with its creation time, and
   returns `<tag>-<n>`. Two creates for one tag at the same instant collide loudly rather than share a number, and
   the caller fails as any failed call does. The registry is the one generator of trace ids (see
   [constants-and-identifiers](constants-and-identifiers.md)); nothing else mints them.
2. **The id rides the payload.** The trace id travels in the work's data — an event's data, a job's arguments —
   never in the transport's own id field, where it would double as a de-duplication key and change delivery.
3. **The work stores its outcome, carrying the id, then marks it completed.** Completion comes after the outcome,
   so a completed id's outcome, when there is one, is readable at that moment. Created and completed times together
   measure request-to-delivery time.
4. **One check, for everyone.** Any caller, at any time, asks the registry whether an id is completed. An id not
   completed is just that: the registry keeps no pending, running or progress state, so a stuck task never shows a
   state that claims more than is known.
5. **Runtime ids are never keys.** A runtime's event and run ids may be logged beside the trace id for debugging;
   they are never the key work is followed by. A rerun, a replay or a manual retry gets new runtime ids and keeps
   the payload — and so the trace id.

## Why

A durable runtime gives every rerun its own run id, and event ids are optional and carry de-duplication meaning.
Work followed by either is lost exactly when it is retried by hand — which is when someone is watching. A trace id
the caller holds, carried in the payload and closed by the work itself, survives every retry, and one registry
answers "is it completed?" the same way for every kind of work. Keeping only the two times keeps the registry
honest: a progress field or status goes stale the moment a process stops, and the log already says what a task was
doing.

## How to apply

```ts
// Start
const traceId = await traceRegistry.create("item-validation"); // "item-validation-42"
await jobs.send("validate-item", { itemId, traceId });

// Finish (inside the job)
await results.insert({ item_id: itemId, trace_id: traceId, verdict });
await traceRegistry.complete(traceId);

// Follow
while (!(await traceRegistry.isCompleted(traceId))) await sleep(POLL_INTERVAL_MS);
const result = await results.findByTraceId(traceId); // read once, by its own id
```

- The follower reads what is stored by its own trace id — never waits for a shared result slot another run may
  already have overwritten.
- Following a job by the runtime's run id, keying a result by the event id, a status or progress column in the
  registry, or a feature keeping its own "running" flag is a finding.
