# Ownership keys: never upsert on a natural key that decides who owns something

**Rule.** When a unique key identifies an **external or natural** thing (an OAuth identity,
a licence code, a device id, an imported record number) and the row's job is to bind that
thing to an **owner** (a user, an account, a tenant), do **not** write it with an upsert.
Read the current owner first, and refuse a mismatch. An upsert on such a key silently
**transfers ownership to the last writer** — a takeover with no error, no audit trail, and
no way for the loser to notice.

## Rules

1. **Resolve the owner before writing.** The write is a three-way decision, not one
   statement: no row → insert; row owned by **this** caller → no-op success (idempotent
   re-submit); row owned by **someone else** → refuse with a conflict. The refusal is
   **thrown** — the conflict's own error, carrying its code — never returned as an outcome
   the caller must sniff ([canonical shapes](canonical-shapes.md) rule 1).
2. **An upsert is only safe when the key already contains the owner.** `ON CONFLICT DO
   UPDATE` / `onDuplicateKeyUpdate` / `MERGE` are fine when the unique key is
   `(owner, thing)` — the row can then only ever be your own. The danger is exactly the
   key that omits the owner: `(provider, external_id)`, `(serial)`, `(email)`.
3. **Claiming is a privileged, authenticated action.** A binding that grants access must
   be performed by the party that already proved control of the owner — never inferred
   from an unauthenticated request that merely *presents* the external thing.
4. **Never let a uniqueness violation be the only guard.** A database error surfacing as a
   500 is not a policy. Decide the outcome in code so the refusal is deliberate, typed,
   and (where it matters) audited.
5. **Guard the reverse direction too — unbinding.** If a binding is a way to authenticate,
   removing the **last** one locks the owner out. Count the remaining credentials before
   detaching, and refuse to remove the final one — the count and the detach under one lock
   on the owner, re-checked inside it, or two concurrent detaches each see the other's
   credential and remove both.

## Why

Upserts are the reflex for "insert or update" and they read as harmless idempotence. On an
ownership key they are the opposite: the statement that was meant to make a re-submit safe
is also the statement that reassigns the row. Whoever writes last wins, and because the
write "succeeds", nothing anywhere reports a problem — the previous owner simply stops
being able to use the thing, or worse, an attacker who can present the external identifier
inherits everything attached to it.

It is a quiet failure mode because the unique index is doing exactly what it was asked to
do, and because tests usually cover the two easy paths (first bind, re-bind by the same
owner) and not the third (bind something already owned). The fix is cheap — one read before
the write — and it converts an invisible takeover into an explicit conflict.

The unbinding half is the same bug seen from the other end: each individual detach looks
reversible, so no single call feels dangerous, and the account is only discovered to be
unreachable after the last one is gone.

## How to apply

- Model the write as `bind(thing, owner)` that binds, or throws a conflict; do the owner lookup
  and the insert in the same call so no caller can skip the check.
- Reserve upserts for keys that already include the owner; if you find one on a key that
  doesn't, treat it as a defect and remove it in the same change.
- Require an authenticated owner for any bind that grants access, and log it — a binding
  change is a security event.
- Before an unbind, count what remains that can still authenticate the owner — inside a
  transaction holding the owner's lock; refuse when the count would reach zero, and say which
  credential must be added first.
