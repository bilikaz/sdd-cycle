# Services: the feature's logic, framework-free

**Rule in one line:** a feature's `service.ts` holds its operations — the rules, the repo and realm calls,
the ledger entries, the mails — built per request with its dependencies and the acting user, returning
the object or throwing the App error, and never seeing the framework.

## Rules

1. **Built per request with the user.** The service extends the core's feature service base and is
   constructed for each request with its injected dependencies (the ledger, the mail service, its repos and
   realms) and the signed-in user's id as a value — none on a public route.
2. **Its dependencies are services and config, never a value resolved from them.** No `appUrl: string`
   beside the config: the service takes the injected config and reads the setting where it needs it
   (`this.params.config.platform.ui.publicUrl`). A dependency that only holds settings is config, never a
   service of its own ([configuration](configuration.md) rule 9).
3. **Framework-free.** It imports no HTTP type and never sees a request context; everything it reads arrives
   as its DTO ([routes](routes.md) rule 3) or its dependencies.
4. **It returns the object.** An operation answers the object the route returns, or nothing; the router
   answers either ([routes](routes.md) rule 4). A row it must find it reads with its refusal, so the answer is
   never `null` and nothing downstream re-checks it ([repositories](repositories.md) rule 4).
5. **A refusal throws the App error.** A refused operation throws an instance of a subclass of the base
   error, carrying a machine code — never a string, never a status:

   ```ts
   throw new AppErrorConflict({
     code: "email_in_use",
   });
   ```

   It names no status (the glossary's App error; the family's naming,
   [naming](naming.md) rule 6; a class, never a factory, [base-classes](base-classes.md) rule 6). The app's one
   error handler turns it into the kind's status and the standard body; anything else thrown is a 500.
6. **One ledger entry per change.** Every change the service makes is trailed as one entry for the user,
   through the base's `trail`, its verb the act (`create` · `update` · `delete`), never a field's name. An
   update is one statement and one entry, whatever it changes: the entry carries every field it changed, before
   and after (`previousValue: { label, status }`) — never a statement or an entry per field. **A change, its Job
   rows and its trail commit together, or not at all: the trail is written inside the change's transaction, and a
   trail the store refuses rolls the change back.** Why: a trail written after the commit leaves a committed change
   with no entry whenever the ledger refuses it — the request answers 500 for a change that stands, and the caller's
   retry makes the change a second time. The trail is the base's `trail(entry)`, handed nothing: the app holds its one
   connection and the open transaction, and the ledger's repo takes it,
   so where the call stands decides what it rides. A record that changes no row — a failed sign-in, a mailed link's
   request, a template's test send, the handover, the boot's start — is the same `trail(entry)` called outside any transaction, a write of its
   own that no rollback can take; it is never written inside an entry that then refuses. Where the action's entry is the
   realm's — a sign-in, a password change, a session's revocation — the realm's opener takes the record as a hook and
   runs it inside its transaction, and the hook is a plain `trail(entry)`. A change that writes many rows at once —
   an import, a branch delete — trails one entry for the action, its value a summary of what it changed (the tree
   of paths an upload added, replaced and skipped; the tree a delete took), never one entry per row: a row per file
   is noise nobody can search.
7. **An operation is named after its route's DTO, less `Dto` and less the service's own entity**, which the
   class already names: on `UsersService`, `userCreateDto` → `create(dto)`, `userUpdateDto` → `update(dto)`,
   `userOwnershipTransferDto` → `ownershipTransfer(dto)`; an operation that opens a transaction carries the suffix — `ownershipTransferInTransaction(dto)` (rule 9); an entity that is not the service's own keeps its
   name (`sessionDelete` on the auth service). The route-by-route reading is the table in [dtos](dtos.md)
   rule 3.
8. **A rule over several rows is the service's.** An operation that changes several rows under one rule (an
   ownership transfer: two role updates) runs them inside `repo.transaction(run)` — the service decides what
   is atomic, the repo only bundles it ([repositories](repositories.md) rule 6). An entry transaction holds
   short locks only while the app's own rows are updated, and two requests racing for one row are settled by
   its key or its lock — the first wins, the second takes the ordinary refusal — never by a rerun or a wider
   lock. **An admin's action has no race to design for.** People do not click like monkeys: two console actions
   meeting on the same rows in the same moment are not designed, locked, retried or tested for — no lock
   redesign, no deadlock analysis, no race test; a rare loser takes whatever error the store raises. Correctness
   for one person acting is the bar. This is a hard rule: a race is designed for only when a strong reason is
   named and the user rules it — a reviewer's "two clicks could collide" is never that reason. It covers an
   admin's console actions only, where two actions meeting is no real race or deadlock — at worst one gets an
   error, and that is all. So an admin's action locks at most the rows it changes — the entity it changes, inside
   the transaction its change and its trail share — never a row it only reads, never a whole table; it takes no
   re-read "in case it moved", no lost-race code; a key it loses to a race is answered by the repo base's
   generic refusal ([repositories](repositories.md) rule 3), never by a lost-race code of its own. A fake race can be
   chased without end — one more lock, one more lost-transaction debate — and this rule ends that chase before
   it starts; outside the console, [realistic-failures](realistic-failures.md) ends it the same way. What must hold beyond one person's action — atomic,
   tamper-proof, immutable — is the database's to enforce, designed as such from the start: a stored procedure,
   a trigger, a constraint, a grant (the ledger's append-only grant is one); service code never approximates it
   with locks and re-reads. **Designed for races are:** auth and security writes (a token's rotation, a replay
   check, a one-time link); async workers, jobs, sweeps and other machine-driven writes; and any action someone
   gains by racing on purpose — money moved or withdrawn, a balance, a limit, a one-time grant — where a person
   fires it twice at once to exploit it — each for the races ordinary operation reaches, never a coincidence
   ([realistic-failures](realistic-failures.md)). This is the one set the conventions mean by "a write rule 8 designs races
   for". **Prework stands outside the lock.** A slow check — a hash, a verify — runs before the transaction.
   In a write rule 8 designs races for, the transaction re-reads what that prework depended on and refuses
   if it moved, then settles the write: the lock holds the compare and the write, not the work that earned them.
   An admin's action re-reads nothing (above), and neither do the config versions' Activate and Save: each tests
   over an unlocked read of the draft before the transaction — a Save landing between Activate's test and its
   rename is activated with the rest, and a Save writes its branch by upsert from its own read. The session store is an own store — a
   Redis await inside the entry is lawful; it is not a third-party call:

   ```ts
   const { usersRepo } = this.params;
   await usersRepo.transaction(async () => {
     const owner = await usersRepo.query(
       {
         role: "owner",
       },
       {
         error: new AppErrorConflict({
           code: "no_owner",
         }),
       },
     );
     const users = await usersRepo.allQuery(
       {
         userIds: [owner.userId, userId],
       },
       {
         lock: true,
       },
     );
     if (!users.some((user) => user.userId === userId)) {
       throw new AppErrorNotFound();
     }
     await usersRepo.update(
       {
         userId: owner.userId,
       },
       {
         role: "admin",
       },
     );
     await usersRepo.update(
       { userId },
       {
         role: "owner",
       },
     );
   });
   ```

9. **The transaction belongs to the entry method, and its name says so: `…InTransaction`.** The entry method is
   the route-facing operation that opens a transaction, named after its DTO with the suffix `InTransaction`
   (rule 7's naming plus the suffix — the one naming exception), and it is the only shape allowed to call
   `transaction(run)`: it opens the one transaction, and its body is the action itself: the repo calls that make it,
   each on its own line and awaited, every one of them riding the transaction the app holds open. **And the suffix
   follows the opener wherever it stands** — a mechanism's method, a runtime function, a private helper: what calls
   `transaction(run)` carries it, so the name says it at the call as it says it at the route; a step that writes
   inside its caller's transaction carries none, for it opens nothing. A step earns a name of its own only
   when it is reused or holds real logic — a guard, a computation ([earn-the-abstraction](earn-the-abstraction.md)
   rule 6); a capability that owns its rows and what follows them stays the service it is — `emailService.send`
   hands the mail's job to `jobService.record(job)`, whose own repo writes the row inside whatever transaction is
   open and which fires the send: a dependency, never a wrapper. **A transaction opens on one of two grounds — hold or settle** (glossary):
   to **hold** — in a write rule 8 designs races for, the data the write decides against stays correct and
   unchanging while the process runs, a row read under `lock` before the write that depends on it, a lock with no
   life outside a transaction; an admin's action holds at most the rows it changes (rule 8) — or to **settle** —
   several statements land at once, an admin's change and its trail among them. Where neither stands — a read, a list, a single write with no lock and no decision to guard — no
   transaction opens and no suffix is carried: one statement is atomic by itself, and a lone write calls its repo
   plainly. The name marks where a transaction opens, not how many rows it spans.
   **A lock may cover the whole table only in a write rule 8 designs races for, and only when it is held for a
   moment** — a locked read filtered on a column no index serves locks every row it scans, so it is allowed
   only where the entry does nothing between the read and the commit but its own writes and its trail; an admin's
   action never takes one — it reads plainly, and locks at most the rows it changes, by their ids (rule 8's
   ownership transfer). Such a read carries `// @biglock #db.<table> <why>` on the line above it, so every
   table-wide lock is found by one search on its table's tag; a new one on a tagged table is checked against the others for a
   lock-order collision before it lands.
   A step is transaction-neutral: it writes through the repos it holds, opens nothing of its own, and neither knows
   nor decides atomicity — its caller decides. **Nothing nests: a transaction never opens inside another** — a `transaction(run)` reached while one is open
   throws `RepoNestedTransactionError` ([repositories](repositories.md) rule 6), so the entry that returns has always
   committed and the code after it may act on that. The throw names a defect of the code, never of the request. An
   entry is never called inside another entry: the lint refuses the call where it is written inline, and at runtime
   it throws only when a transaction is then open. An entry is called from a `routes.ts` handler, a worker task method, a
   composition-time caller, a test file, or a service method that holds no transaction (a feature service driving
   the realm's entry); a service needing another's transactional act runs those neutral steps itself inside its own
   transaction, or the act becomes a route of its own. Work that must outlive a rollback runs outside the
   transaction (`outsideTransaction`, the attempt's work) or after the commit. A Job row — the queue row of a mail, of an image, of anything — is a record of the action
   like any other row, so it lands inside the entry's transaction: the service that owns the queue writes it
   through its own repo, which takes the transaction the app holds open
   ([composition-root](composition-root.md) rule 3's client law). A **third-party call is never awaited inside
   an entry transaction** — an SMTP send, an HTTP webhook, a vendor SDK: the bar is the await, not the call.
   The bounded Library storage publication/cleanup phase named above is the declared exception. An outside read the action needs is made before the transaction or after its commit, and an outside write
   is a job its worker makes ([durable-execution](durable-execution.md) rule 8). The bar reaches every
   transaction a request or the config's resolution opens, not only a feature's `service.ts`. It is the
   entry's bar: the queue runtime's **attempt transaction** — the one place an outside call is awaited under a
   lock, its own job row held while the job's outside work runs, so that row is never picked up twice and no
   request waits on it — is ruled by [durable-execution](durable-execution.md) rule 1. The third-party effect that fulfils a job is fired from
   inside, **unawaited**, after its row write, and a worker that grabs the job before the commit re-queues
   ([durable-execution](durable-execution.md) rule 8's requeue). A failure on any awaited line rolls the whole
   action back, so nothing is visible that was not committed — an action is undone by its own rollback, never by a
   compensating transaction after a commit: an undo's writes are written inside the entry's transaction.

   ```ts
   // a route handler calls the entry
   // routes.ts: this.post("/", UserCreateDto, (service, dto) =>
   //   service.createInTransaction(dto));

   async createInTransaction(dto: UserCreateDto): Promise<PlatformUserEntity> {
     const { userId } = await this.params.usersRepo.transaction(async () => {
       const created = await this.params.authService.authRealm.createUser(dto.email, undefined, dto.role,
         dto.userId);
       // the mail's queue row — a record of this action, on its transaction
       await this.params.emailService.send({
         template: this.params.authService.templates.newAccount,
         to: dto.email,
         data: {
           token: created.token,
           email: dto.email,
         },
       });
       // the change's ledger entry — rule 6, on the same transaction
       await this.trail({
         verb: "create",
         targetKind: "platform.user",
         targetId: created.userId,
         currentValue: {
           userId: created.userId,
           email: dto.email,
           role: dto.role,
         },
       });
       return created;
     });
     return this.query({ userId });
   }
   ```

## Why

A handler that parses, decides, writes, trails and mails is five changes in one place: every new rule edits
HTTP code, and no rule can be tested without a request. A service over plain values is testable with plain
values, and a thrown App error keeps the one mapping from refusal to status in one handler instead of in
every route.

A lock held across a call to an outside system makes every request on that row wait on that system, and the
system's slowness or failure stalls the write or rolls it back after the outside system has already acted. Locks
held only while the app's own rows change stay short, and a race between two requests stays cheap: the key or the
lock decides it, and the loser takes the same refusal it would take a moment later. Machinery that reruns a lost
race or widens a lock to prevent one only moves the wait and adds a path no ordinary request takes.

## How to apply

- A service that imports the framework, returns a status code or returns a refusal string is a defect: throw
  the App error.
- A dependency typed as a string or a number that another dependency could answer is resolved inside the
  service instead.
- A write without its `trail` is a missing ledger entry.
- A `trail` called in a loop, or an entry per row of a bulk change (an import, an upload, a branch delete), is
  noise that buries the action: the action trails one entry whose value summarises what it changed — the tree,
  the paths, the counts — never the rows' bulk text.
- A `trail` awaited after the entry's transaction returns is the defect rule 6 names: `this.trail(entry)` is called
  inside the entry.
- A record of no change (a refused sign-in, a mailed link's request) written inside a transaction that then refuses is
  a lost record: it is called after the refusal, outside any transaction.
- Two repo writes that must succeed together and are not inside one `transaction(run)` are a race.
- A call to a system outside the app's own stores awaited inside an entry transaction — in a service or the
  config's resolution — is a defect: a read moves before the transaction or after its commit; a write becomes a
  job its worker makes ([durable-execution](durable-execution.md) rule 8). The attempt transaction's await on
  its own job's outside call is the intended shape ([durable-execution](durable-execution.md) rule 1), not this
  defect.
- A reusable method that opens its own `transaction(run)` is a boundary in the wrong place: hoist it to the entry
  method, and the step runs in its open transaction.
- The shape is guarded by the lint rule `local/transaction-entry`: a `transaction(` call opens only inside an
  `…InTransaction` method, never written inline inside an open run's callback, and an `…InTransaction(` entry is
  never called inside an `…InTransaction` method or an open run's callback — the suffix exists so this is caught at
  the call. A `transaction(` or an entry inside an `outsideTransaction(` callback is outside the open run; a test
  file, standing at a boundary, opens freely. One reached any other way — a run passed by name, an entry reached
  through a method of no suffix — throws `RepoNestedTransactionError` at runtime when a transaction is then open.
  Task36's user-named private `ProjectsService.updateLastLetterNumberInTransaction` is a counter-only
  participant: only `uploadInTransaction` in that exact service may call it within the open transaction.
  The participant may not open a transaction; the rule enforces that narrow exception.
  It holds at `error` in `eslint.config.mjs`. Mechanism files are not exempt: an opener names itself (the suffix). The client-app block
  (`apps/platform/src/**`) stands because that surface opens no transaction.
