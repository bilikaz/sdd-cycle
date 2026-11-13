# Data-model naming

**Rule.** Tables are plural and self-explanatory: a root entity is a bare plural, and a sub-entity owned by one
root carries that root's name as a prefix. Every table has a single-column generated primary key named
`<singular_table>_id`, spelled identically as the primary key and as every foreign key that points at it — no bare
`id`. A natural key is a unique constraint, never the primary key. Status columns are plain strings, guarded by a
string-union type in code.

## Rules

1. **Root entity → bare plural:** `jobs`, `users`, `sessions`. A table that belongs to no single root stays bare
   (`events`).
2. **Sub-entity → `<root>_<plural>`:** a table whose rows belong to exactly one parent is prefixed with it —
   `user_logins`, `user_socials`. Never mix a qualified table with an unqualified sibling.
3. **Id columns → `<singular_table>_id`,** the same name as primary key and as every foreign key to it:
   `users.user_id`, `user_logins.user_login_id` (+ `user_logins.user_id`).
4. **A self-reference → `<role>_<singular_table>_id`:** the key's whole name with its role in front, since the
   plain name is the row's own key — a tree's row carries its parent as `parent_<singular_table>_id`.
5. **Every table has a single-column generated primary key.** Ids come from the project's one id generator —
   random, not guessable-sequential. The one exception is a slug id: a key entered by a person or derived from the
   row's stable name.
6. **A natural key is a unique constraint plus index, never the primary key.** A multi-column natural key
   (`(provider, external_id)`) gets a `UNIQUE` constraint and the index its read path needs. A row may be looked up
   by its natural key and still keeps its generated primary key as its identity. A generated key is not permission
   to leave a natural key unconstrained: a natural key without a unique constraint is only an intention.
7. **Status and state columns are plain strings, never a SQL `ENUM`.** Adding a state is a code change, not an
   `ALTER TABLE`. Each status column has one string-union type, and every write goes through it.
8. **Scope:** this governs the persistence model (tables and columns). Application payloads and DTOs keep their own
   camelCase vocabulary (`jobId`, `userLoginId`).

## Why

A column named `job_id` tells you both the table it keys and what a foreign key references. One spelling per id
removes the `id`-here, `job_id`-there drift that forks joins. An unqualified sub-entity (`attempts`) is ambiguous;
`job_attempts` answers "of what?" in the name.

A composite primary key propagates: every foreign key carries all its columns, every join widens, and a change to
the natural key becomes a migration across every referencing table. A single generated key keeps identity one
column wide and lets the natural key be what it is — a uniqueness rule that can change without touching identity.

A SQL `ENUM` is weaker than it reads: it orders and compares by position, and some modes coerce an invalid value
instead of erroring. A string-union type fails an invalid literal at typecheck, earlier and louder.

## How to apply

```ts
// Schema: root + sub-entity; every id is <singular_table>_id, primary and foreign key alike.
// jobs        (job_id PK, user_id FK, status VARCHAR, ...)
// user_logins (user_login_id PK, user_id FK, provider VARCHAR, external_id VARCHAR,
//              UNIQUE (provider, external_id))

type JobStatus = "queued" | "running" | "finished" | "failed";

interface JobRow {
  job_id: string;
  user_id: string | null;
  status: JobStatus; // every write goes through the union
}

const row: JobRow = { job_id: newId(), user_id: userId, status: "queued" };
```

- Smell test: a join that reads `ON a.id = b.a_id` has two names for one identity — rename the primary key to
  `a_id`.
- If a table name does not say what it belongs to, it is a root; if it belongs to a parent, prefix it.
- For every natural key, name its unique constraint and the index the read path uses.
