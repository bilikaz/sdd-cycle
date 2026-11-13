# Entity docs — one table, one row, one line

The anatomy every `entity.md` section follows, so any reader (or implementation step) reads the table
the same way everywhere.

**Section anatomy:** an entity is an **H4** under its database section's `## Entities` group
([doc-structure.md](doc-structure.md)) — heading `#### <table> — <Entity>` → field table →
`**Used for:**` prose → `**writes:** … · **reads:** …` line declaring the actor set, per the project's
placement rule.

**The field-table rules:**

1. **One DB column = one table line.** Never two columns on one line — no "`x` / `y`" rows, not even
   `created_at` / `updated_at`. Two columns means two things a query can address separately; the doc
   line count mirrors that.
2. **`Type` is the DDL truth** — MySQL type + NULLness + PK mark, the exact form the migration copies.
3. **`Description` states the role of the column**, current tense, no migration scars; it says *what it
   is for*, not where it came from.
4. **Column naming law**: an id column names the thing it references — `user_id`,
   `config_version_id`, `organization_id`. The realm word is the table's own (`user_id` is *this
   * layer's* user); no invented account nouns. Unique constraints, defaults, and index notes ride below
   the table when they carry meaning.
5. **Junction tables are named bigger-then-smaller** — the scoping thing first, the member after:
   `organization_users`, `user_socials`. The name reads the hierarchy, never alphabetical order.
6. **A natural key IS the PK.** When a unique column set is the row's identity, it is declared the
   primary key and no invented `*_id` surrogate rides along un-referenced. A surrogate exists only
   where nothing natural identifies the row — the append-only event tables (`audit_events`,
   `llm_calls`, `capture_events`).
7. **No who-trail columns.** The account that performed an edit is a row in the layer's **Audit event**,
   not a `created_by_*` on every data row. A row's own when-state columns stay (`activated_at` is state,
   `activated_by` was trail).

**Mermaid rule:** one diagram per logical group, under `## Diagrams`, relations only that the owning
layer writes edges for; a reference to an entity in another store appears as a **ghost node labeled
with its Qualified name** (`users["platform.users"]` — glosary), never as an owned box. **Only real FK
columns get edges** — a polymorphic pointer (an audit `target_kind`/`target_id` pair) is described in
prose and drawn no edge.

**Every entity in a diagram gets a section.**

**The repeat-shape law:** when the same table shape exists in two stores — the realm trio, the mail
catalogs, the per-store audit copies — they are two **Entities** and each carries its own full
definition: its own field table, its own descriptions, its own `writes/reads` line. No copy refers to
another's section, no "same as", no delegating pointers — mapped twins make a divergence leave the
truth somewhere in the middle. Duplication is the price of independence, paid gladly: a shared
definition is two stores coupled by a doc.
