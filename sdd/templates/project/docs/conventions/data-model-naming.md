# Data-model naming

**Rule.** Tables are plural and self-explanatory: a root entity is a bare plural, and a sub-entity owned by one
root carries that root's name as a prefix. Choose keys in order: unique indexes for join tables, suitable
natural keys such as slugs, UUIDs where independent identity is needed, then auto-increment surrogates for the
remaining internal cases. An id column is named `<singular_table>_id`, spelled identically wherever it is
referenced — no bare `id`. Status columns are plain strings, guarded by a string-union type in code.

## Rules

1. **Root entity → bare plural:** `jobs`, `users`, `sessions`. A table that belongs to no single root stays bare
   (`events`).
2. **Sub-entity → `<root>_<plural>`:** a table whose rows belong to exactly one parent is prefixed with it —
   `user_logins`, `user_socials`. Never mix a qualified table with an unqualified sibling.
3. **Id columns → `<singular_table>_id`,** the same name as primary key and as every foreign key to it:
   `users.user_id`, `user_logins.user_login_id` (+ `user_logins.user_id`).
4. **A self-reference → `<role>_<singular_table>_id`:** the key's whole name with its role in front, since the
   plain name is the row's own key — a tree's row carries its parent as `parent_<singular_table>_id`.
5. **Choose identity in this preference order.**
   - For a join table, prefer a unique index over the fields identifying the relationship. A composite primary
     key may enforce that same identity; do not add an independent id unless a consumer needs one.
   - Prefer a suitable natural key, such as a `slugId` entered by a person or derived from a stable name.
   - Prefer a UUID when an independently generated identity is needed: for a user-facing identifier without a
     suitable natural key, or an id reused in a filename, related work or another reference before the row exists.
     Use the project's shared UUID generator.
   - Use `AUTO_INCREMENT` as the default internal surrogate in the remaining cases. It follows the choices above;
     it is not the first choice for every table.
6. **Enforce uniqueness independently of the surrogate choice.** When a row has a surrogate primary key,
   constrain its natural keys and relationship combinations separately with `UNIQUE` indexes. A table does not
   need a generated id merely because it is a table. Choose indexes and column order for the actual read paths.
7. **Status and state columns are plain strings, never a SQL `ENUM`.** Adding a state is a code change, not an
   `ALTER TABLE`. Each status column has one string-union type, and every write goes through it.
8. **Scope:** this governs the persistence model (tables and columns). Application payloads and DTOs keep their own
   camelCase vocabulary (`jobId`, `userLoginId`).

## Why

A column named `job_id` tells you both the table it keys and what a foreign key references. One spelling per id
removes the `id`-here, `job_id`-there drift that forks joins. An unqualified sub-entity (`attempts`) is ambiguous;
`job_attempts` answers "of what?" in the name.

A unique index expresses a relationship's identity directly. A suitable natural key keeps an existing stable
identifier useful. A UUID can be minted before insertion and reused independently of the database. An internal
row that needs none of those properties can use an auto-increment surrogate. A referenced composite key carries
all its columns into foreign keys, so choose its fields as the stable identity being referenced.

A SQL `ENUM` is weaker than it reads: it orders and compares by position, and some modes coerce an invalid value
instead of erroring. A string-union type fails an invalid literal at typecheck, earlier and louder.

## How to apply

```ts
// Schema: root + sub-entity; every id is <singular_table>_id, primary and foreign key alike.
// jobs        (job_id PK, user_id FK, status VARCHAR, ...)
// user_logins (user_login_id PK, user_id FK, provider VARCHAR, external_id VARCHAR,
//              UNIQUE (provider, external_id))
// user_roles  (user_id FK, role_id FK, UNIQUE (user_id, role_id))

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
