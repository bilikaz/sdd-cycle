# Repositories: rows, never the business

**Rule in one line:** a repo is its table's one home — a thin class over one base that already reads and writes
any single table by its entity's fields (`query` · `allQuery` · `mapQuery` · `pageQuery` · `count` · `create` ·
`createMany` · `createCopyOf` · `update` · `delete` · `transaction`); the repo adds only what one table cannot answer (a join, a
report), and knows nothing of why.

## Rules

1. **One home per table, shared by every feature that reads it.** A feature folder holds no SQL; a second
   feature reading the table uses the same repo. A table has exactly one repo and a repo exists only for a table:
   one file and one class, named after the table (`email_templates` → `email-templates.ts`, `EmailTemplatesRepo`) —
   never one file for several tables, never a second class for one table (a narrower access is a scope, rule 7).
   A read that joins lives in the repo of the table it starts from (its `FROM`). The one exception is the
   ledger: one repo for its whole database (`ledger.ts`, its one `entries` table).
2. **Rows, never the business.** A repo answers and changes rows; the rule that decides whether a change may
   happen — or which row to pick among several (a language fallback) — is the calling service's
   ([services](services.md)).
3. **The base does the single table.** A repo is constructed with its store's handle, its table, its entity
   and its scope, and hands them to the base; every standard method is then the base's, with nothing written in
   the repo:

   | Method | Answers |
   | --- | --- |
   | `query(where, options?)` | one row, or `null` |
   | `allQuery(where, options?)` | every row matching — a bounded set (a version's values, a user's sessions), never capped |
   | `mapQuery(where, { key, field \| fields }, options?)` | a `Map`: each row's `key` to its `field`, or to an object of its `fields` |
   | `pageQuery(where, pagination, sorting)` | one page — the shared `Paginated` envelope; `sorting` allow-listed |
   | `count(where)` | how many rows match |
   | `create(values)` · `createMany(rows, onDuplicate?)` · `createCopyOf(overrides, where)` · `update(where, change)` · `delete(where)` | the writes — the base's `create` and `createMany` answer nothing, `update` and `delete` how many rows they touched; a `createMany` batch is one field set per row, encoded and scoped as `create` is, and a duplicate refuses — its `"update"` instead lets a row the key already holds take the batch's values; `createCopyOf` copies the rows the `where` answers in the same table, every column by reference inside the store and the `overrides` — the scope included — as literals, and what already stands stays: a copy never answers a duplicate |
   | `transaction(run, options?)` | one transaction (rule 6); an optional isolation level configures that same builder, with the connection default when omitted |

   A repo whose table takes an id it mints overrides `create` to mint it, and answers it where a caller reads it
   (jobs); one whose minted id nobody reads answers nothing (user socials).

   A write a unique index refuses rejects with `RepoDuplicateKeyError`, an `AppErrorConflict` whose code the base
   names from the index's columns, looked up in the index map the boot read once from the store
   (`db-index-map.ts`), no statement running on a refusal: an index over one column answers `<column>_in_use`
   (`email_in_use`, `user_id_in_use` for the users' primary key), an index over several `<entity>_in_use`, the
   entity the table's singular (`user_model_in_use`), and so does an index the map does not hold; its `index` keeps
   the store's name for it. No service maps a refusal of its own — but where the index is an internal marker no user
   should read: a library category's derived `uq_library_categories_path`, which category create answers
   `category_in_use` — the person typed a category, never a path; and a library RAG's `PRIMARY`, its slug, which RAG
   create answers `rag_in_use` — the person typed a RAG, never its key.

   A `create`, `createMany` or `update` a foreign key refuses — a write whose referenced entity is gone: the write
   creates the reference, the entity it names is what is missing — rejects with `RepoReferencedEntityMissingError`,
   which names the referenced table and the missing ids, nothing else; who answers it, and in whose words, is
   [error-handling.md](error-handling.md) rule 9. The referenced table and its one column are parsed from the
   refusal's message, the values are the written rows' values of the referencing column, and the base finds the missing ids by reading the referenced table once, in the open transaction — the
   one statement the base runs on another repo's table, named by the driver's message. A refusal whose message does not name a one-column key is rethrown as the driver's error, untouched. A `createCopyOf` row referencing a gone one is skipped, never refused — its insert ignores the refusal.

   No other verb: an intent that reads as a repo method (`rotate`, `begin`, `upsert`, `purge`) is one of these
   words or several of them under the service's rule; a yes/no read is `query(where) !== null` — there is no
   `has…` or `is…`.
4. **Every `…Query` takes the same `QueryOptions`** — `{ lock, order, error, fields, distinct, limit }`, grown in
   one place when a new need appears: `lock` takes the rows' lock (`SELECT … FOR UPDATE`, inside a transaction),
   and `lock: "skip"` passes over a row another transaction holds (`FOR UPDATE SKIP LOCKED`) instead of waiting on it;
   `order` the fields to sort by; `error` an App error thrown when nothing matches, so the answer is never empty
   and no caller re-checks it; `fields` the fields read; `distinct` one row per distinct set of `fields` (the
   options a filter offers: every worker the window ran); `limit` at most so many rows — `query` is `allQuery`
   limited to one. `pageQuery` is the table's page and takes its `pagination` and `sorting` instead.

   ```ts
   const user = await usersRepo.query(
     { userId },
     {
       error: new AppErrorNotFound(),
     },
   );
   ```

5. **A field is its column — no other option.** An entity's field is its column's name in camelCase
   (`created_at` ↔ `createdAt`); a name that differs is drift, fixed by renaming one of them. The base maps the
   names and converts the values by the type each field's schema declares — a boolean field reads its 0/1 column
   as a boolean, a number field reads a count as a number, a JSON field is written as its text. A JSON null is
   SQL NULL — written as the absence, filtered with `IS NULL`; a column that holds a JSON null is `JSON NULL` — and a
   JSON value filters as its document, the bound text cast to JSON. A field derived
   from a column is a read-only expression (`passwordSet`: whether `password_hash` is set) — or from a joined one
   (`fileCount`: a category's files, read through the repo's `join`) — and what never leaves
   the store (a hash, a stored key) is a server-only field — read only when named in `fields`, never in an
   answer. `where`, `fields`, `order` and `key` take field names only — each checked against the table's columns
   before any SQL is built and passed as a quoted identifier, never as SQL text.
6. **`transaction(run)` bundles; the service decides.** It opens one transaction on the app's connection and
   runs `run` inside it, handing nothing: every repo `run` reaches, of any store, takes that open transaction at its
   next statement (rule 10). A throw inside `run` rolls everything back and rethrows; called while a transaction is
   open, it throws `RepoNestedTransactionError` — a transaction never opens inside another. When a service uses it, and what a transaction may hold and call, is
   [services](services.md) rules 8 and 9.
7. **A scope is a construction rule.** Where a repo may reach only part of its table — a
   worker's own jobs — the part is a `RepoScope` handed to the constructor (`{ worker }`),
   and the base adds it to every read's and write's `where` and to every `create`'s, `createMany` batch's and `createCopyOf` overrides' values: the repo cannot read
   or write outside it.
8. **A comparison is a `RepoWhereField`, built inside the repo.** `where` matches by equality; a range, a
   search or a set is a `RepoWhereField` value — `RepoWhereAfter(date)` · `RepoWhereBefore(date)` ·
   `RepoWhereBetween(from, to)` · `RepoWhereLike(text)` · `RepoWhereIn(values)` · `RepoWhereNot(value)`, or a repo's own subclass (a
   search over several columns) — each building its expression from the field's checked column. They never leave
   the repo: a service passes the repo's own `where` fields as plain values (`{ createdAfter }`, `{ from, to }`,
   `{ search }`) and the repo turns them into `RepoWhereField`s for the base.
9. **The repo writes SQL only for what one table cannot answer** — a join (a row read with a column of another table), a
   report or an aggregate, named `‹x›Query` (`reportQuery`, `summaryQuery`), a write with a condition of its own
   (a terminal state written once) or a statement of its own (`INSERT IGNORE`, `INSERT … SELECT`). A read of
   rows takes the same `QueryOptions`; a paged report takes its `pagination` instead (as `pageQuery` does), and an
   aggregate — a count, a total — takes neither.
10. **A repo is typed by its store; the transaction is the connection's.** Each database is its own type, its own
    tables and no other's; a repo is built on its store's handle — the **Store handle**, which types its queries and
    names its **Store home** on each statement — and a repo handed another store's handle fails to compile. The store
    is query typing and nothing more: one container holds one connection, a transaction belongs to that connection,
    and the app holds the connection and its open transaction.
    So a repo takes the open transaction when there is one and its handle otherwise, at every statement — the base's
    and its own SQL alike — and re-qualifies it by its own store home, so the row lands in its own schema inside
    whatever transaction is open (a jobs repo's row, written inside an entry opened on the platform's handle, lands in
    `engine.jobs` on that entry's transaction). Nothing is handed between repos and nothing binds; a store's type is
    never read as a transaction boundary. The migrator is outside this rule: it replays plain SQL on its own handle
    and builds no repo.
11. **A repo declares no shape the shared types already hold.** What a repo answers and takes is the entity's
    row type or the DTO's, imported from the shared folder — never a local interface repeating their fields; a
    shape no entity or DTO holds yet gets its schema there first.

## Why

A repo that knows the business is a second place the rule lives, and the two drift. Every single-table read and
write is the same code with a different table, so it is written once: a repo that is only its table, its entity
and its scope cannot drift from the others, and the SQL a reader must check is only the SQL a table could not
answer. A field named as its column leaves nothing to map by hand, so no mapper can disagree with the schema;
field names checked against the columns and passed as identifiers mean no caller's string becomes SQL. One options
object for every read keeps the call sites alike — `{ lock }` reads the same on `query` and `allQuery`.

## How to apply

- A `get(id)`, `findBy…` or `fetch…` read becomes `query({ … })`; a `has…` / `is…` becomes `query(where) !== null`.
- A read followed by `if (!row) throw …` becomes `query(where, { error })`.
- A hand-written single-table select, insert, update or delete is deleted: the base's method does it.
- A `pageQuery` becomes `pageQuery`, its DTO `…PageQueryDto`; a whole bounded set is `allQuery`, a key → value
  read `mapQuery`, a filter's options `allQuery(where, { fields, distinct: true })`.
- A column and its field with different names: one is renamed. A hand mapper (`toUser`) becomes the entity's
  codecs.
- A repo method that decides a refusal or picks among rows is business that moves to the service.
- A handle typed with every store's tables, or a repo taking "any" store's handle, becomes the store's own type.
- A repo or a parameter that exists only to carry a transaction to another repo is removed: the repo takes the app's
  open transaction itself.
