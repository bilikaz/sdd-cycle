# Ownership keys

**Rule.** When a unique key identifies an external or natural thing (an OAuth identity, a licence code, a device
id, an imported record number) and the row binds that thing to an owner (a user, an account, a tenant), do not
write it with an upsert. Read the current owner first and refuse a mismatch. An upsert on such a key silently
transfers ownership to the last writer — a takeover with no error and no trail.

## Rules

1. **Resolve the owner before writing.** The write is a three-way decision: no row → insert; row owned by this
   caller → no-op success (an idempotent re-submit); row owned by someone else → refuse with a conflict. The refusal
   is thrown as the conflict's own error carrying its code, never returned as an outcome the caller must sniff (see
   [canonical-shapes](canonical-shapes.md)).
2. **An upsert is safe only when the key already contains the owner.** `ON CONFLICT DO UPDATE` / `MERGE` is fine
   when the unique key is `(owner, thing)`. The danger is the key that omits the owner: `(provider, external_id)`,
   `(serial)`, `(email)`.
3. **Claiming is a privileged, authenticated action.** A binding that grants access is made by the party that
   already proved control of the owner — never inferred from an unauthenticated request that merely presents the
   external thing.
4. **A uniqueness violation is never the only guard.** A database error surfacing as a 500 is not a policy. Decide
   the outcome in code so the refusal is deliberate, typed and, where it matters, audited.
5. **Guard unbinding too.** If a binding is a way to authenticate, removing the last one locks the owner out.
   Count the remaining credentials and detach under one lock on the owner, re-checked inside it, and refuse to
   remove the final one — otherwise two concurrent detaches each see the other's credential and remove both.

## Why

Upserts read as harmless idempotence, but on an ownership key the statement meant to make a re-submit safe is the
one that reassigns the row. The write succeeds, so nothing reports a problem: the previous owner stops being able
to use the thing, or an attacker who can present the identifier inherits everything attached to it. Tests usually
cover first bind and re-bind by the same owner, not binding something already owned. One read before the write
turns an invisible takeover into an explicit conflict. Unbinding is the same bug from the other end: each detach
looks reversible until the last one is gone.

## How to apply

```ts
async function bindIdentity(ownerId: string, identity: ExternalIdentity): Promise<void> {
  const existing = await identities.findByExternalKey(identity.provider, identity.externalId);
  if (!existing) return identities.insert({ ...identity, user_id: ownerId });
  if (existing.user_id === ownerId) return; // idempotent re-submit
  throw new IdentityConflictError("identity_already_bound");
}

async function unbindIdentity(ownerId: string, identityId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await users.lockForUpdate(tx, ownerId);
    if ((await identities.countForOwner(tx, ownerId)) <= 1) {
      throw new LastCredentialError("add_another_sign_in_first");
    }
    await identities.delete(tx, identityId);
  });
}
```

- Model the write as one `bind(thing, owner)` call that does the lookup and the insert, so no caller can skip the
  check.
- An upsert on a key without the owner is a defect; remove it in the same change that finds it.
- Require an authenticated owner for any bind that grants access, and log it — a binding change is a security
  event.
- The refusal of a last-credential unbind names which credential must be added first.
