# Traceability

Handed-off work carries an application-owned identity that remains stable across delivery attempts.

## Rules

1. **Use the persisted work identity when it already exists.** A durable Job id is a follow key; do not create
   a parallel trace registry merely to give the same work another id.
2. **Carry that identity through handoffs.** Results, notifications and downstream work retain the identity
   needed to correlate them with their owner.
3. **Runtime delivery ids are diagnostic metadata.** A queue event or execution attempt can change on replay;
   it does not replace the application's persisted work identity.
4. **Completion comes from authoritative stored outcomes.** Notifications improve latency; callers re-read
   the durable state after reconnecting.
5. **Add a separate registry only for work that needs it.** Its owner, identity, lifetime and completion
   semantics are settled with that work; a convention adoption does not introduce another service.
