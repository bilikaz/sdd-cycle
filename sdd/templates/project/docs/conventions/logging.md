# Logging

**Rule.** Logs are structured events with flat data under dot-scoped child loggers, written through a logger
port whose sinks are adapters. Logging is a passenger: it never fails the operation it observes, and a trail
whose own state is lost still writes what it holds.

## Rules

1. **Structured events, not sentences.** A log call is `log.<level>(event, data?)`, where `event` is dot-scoped
   snake_case (`anchor.unresolved`, `llm.heal`) and `data` is a flat object. Values are never interpolated into
   the event string — sinks and tests need the fields, not a sentence to match.
2. **Scoped children.** A component takes a logger and derives its scope with `child(scope)`; scopes join with a
   dot (`review.post`). The join format is defined once and shared by every sink — essential duplication
   ([consolidation](consolidation.md)). A service's logger is scoped by its class name, a worker's by
   `worker.<name>`, a process's root logger by the process.
3. **The logger is a port.** Components depend on the interface — `debug`, `info`, `warn`, `error(event, data?)`
   and `child(scope)` — and receive it from the composition root ([composition-root](composition-root.md)).
   Sinks are adapters: a JSON-lines sink for the process, a console sink for humans and CI, an in-memory sink for
   tests. No component imports the logging library; swapping or adding a sink touches only the logger module.
4. **Raw streams get their own channel.** Live token or progress output goes through a dedicated `stream(chunk)`
   method that structured sinks may ignore; it never pollutes the event stream.
5. **Logs to stderr, payload to stdout** for CLI tools whose stdout is consumed (piped output, machine-read
   results).
6. **Tests assert on entries, not rendered text.** The in-memory sink records `{ level, scope, event, data }`;
   assertions target those fields structurally ([testing](testing.md)).
7. **Logging never fails the operation it observes.** A log, metric, trace or audit-trail write on an
   observability path is contained at the boundary that owns it — caught, reported through the logger and never
   rethrown — so a telemetry outage never becomes a service outage. Only the observer's failure is contained;
   the operation's own failure propagates as usual ([fail-loudly](fail-loudly.md)).
8. **A trail degrades to writing what it holds, never to silence.** A trail that has lost part of its own state —
   the record it meant to complete is gone — writes the entry it still has rather than returning early. The
   operation that broke the trail is exactly the one most worth a row.

## Why

Structured events let sinks route and tests assert without parsing prose, and a port keeps the logging library
out of every component. A request log that can fail the request it logs turns a telemetry outage into a service
outage, and the row that would have explained it is the one that never lands. A trail that gives up when its own
state is lost says nothing about exactly the operation most worth recording.

## How to apply

```ts
const log = rootLogger.child("review").child("post"); // scope "review.post"

log.info("comment.posted", { commentId, threadId }); // not: log.info(`posted comment ${commentId}`)
```

```ts
// rule 7: the audit write is contained; the request's own result is untouched
async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    await auditRepo.insert(entry);
  } catch (error) {
    log.error("audit.write_failed", { action: entry.action, error: errorMessage(error) });
  }
}
```

```ts
// rule 6: assert on the entry, not on rendered text
expect(memoryLogger.entries).toContainEqual({
  level: "warn",
  scope: "review.post",
  event: "comment.failed",
  data: { commentId: "c1", error: "GitLab API 403: forbidden" },
});
```
