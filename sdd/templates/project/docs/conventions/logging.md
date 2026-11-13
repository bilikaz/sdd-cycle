# Logging

**Rules.**

1. **Structured events, not sentences.** Log calls are `log.level(event, data?)`
   where `event` is dot-scoped snake_case (`anchor.unresolved`, `llm.heal`) and
   `data` is a flat object. Never interpolate values into the event string — sinks
   and tests need the fields, not a sentence to regex.
2. **Scoped children.** A component takes a logger and derives its scope via
   `child(scope)`; scopes join with dots (`review.post`). The join format is defined
   once and shared by every sink — essential duplication, not incidental.
3. **Logger is a port.** Components depend on the interface; sinks are adapters
   (console for humans/CI, in-memory for tests). Swapping or adding a sink touches
   only the logger folder.
4. **Raw streams get their own channel.** Live token/progress streams go through a
   dedicated `stream(chunk)` method that structured sinks may ignore — they must not
   pollute the event stream.
5. **Logs to stderr, payload to stdout** for CLI tools whose stdout is consumed
   (piped output, machine-read results).
6. **Tests assert on entries, not rendered text** — the in-memory sink records
   `{level, scope, event, data}`; assertions target those fields structurally.

## Observability failures

7. **Observability never fails the operation it observes.** Contain failures of optional logs, metrics
   and traces at their owning boundary. A mandatory action record is part of the operation, not optional
   telemetry: its failure follows the action's atomicity contract.
8. **An observability trail writes what it still knows.** Missing observer state is reported with the
   available context; it does not silently erase the record of the operation.
