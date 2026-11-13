# Source comments: the code shows itself; a comment says only what it cannot

**Rule.** A source file carries a comment only where the code cannot show what it says. Names, types and
structure show the rest, so everything else holds no comment at all. A comment that stays is written in English,
takes one of the fixed forms below, and says what the rule is — never where it was decided or what the code used
to be.

## Rules

1. **A comment exists only where the code cannot show what it says** — a non-obvious constraint, a trade-off, why
   something that looks wrong is right. A comment that restates a name, a signature, the next block, the design or
   standard framework behaviour is deleted, never softened.
2. **The one block form is a `@why` block** above what it explains — a file, a function, any code:

   ```ts
   /* @why
   -----------
   <title: the special case — what it is and why it exists>
   -----------
   <the reasoning>
   */
   ```

3. **A `@why` block is at least 200 characters** from `/*` to `*/`. A reason that cannot fill it was not needed.
4. **`// @union <why>` is the one-line form**, one line above a declared union of object shapes
   ([canonical-shapes.md](canonical-shapes.md) rule 3). A project adds a one-line form only where one of its own
   conventions defines it.
5. **Comments are in English.**
6. **No internal ids, no provenance.** No comment names a ticket, task, review round, report, ledger row or
   decision-record number, and none cites where a decision was argued: it states the rule, and the record lives in
   the task history. Shared vocabulary from the glossary or a published contract is not an internal id.
7. **No history.** What the code used to do, what changed it and what was rejected belong to version control and
   the task record.
8. **A published comment is contract text.** Where a comment becomes output others read — a JSDoc that generates
   an API description or a published type's documentation — it carries nothing internal, under rule 6 with no
   exception.
9. **A comment that has started to lie is removed.** The code is the truth; a stale comment is worse than none.

Rules 2–4 are enforced by a lint rule where the project wires one; ESLint has no standard rule for them. Generated
files are exempt. Where the lint cannot reach (SQL, config files), review holds rules 5–7.

## Why

Source files are read whole, by people and by models, and every comment line spends attention the task needed.
Comments that narrate rot as the design moves and silently become lies; a file where every third line restates
the next trains the reader to skim past the one comment that carried a real warning. A citation of where a
decision was argued goes stale when that record moves and invites the reader to go and check instead of trusting
the code. One checked form, kept only for what the code cannot say, ends all of it.

## How to apply

Before writing a comment, ask whether a name, a type or a smaller function would say it. If one would, change the
code instead. If none can, write the `@why` block — its title names the special case, its body gives the reason.

```ts
// never: restates the name, cites a ticket
// Maximum items per page (see PROJ-412)
const MAX_PAGE_ITEMS = 100;

// always: says what the code cannot
/* @why
-----------
Oversized pages are refused, not truncated
-----------
A caller that asks for more than the cap receives a validation error instead of a silently shortened page,
because a truncated page looks complete to a client that pages by count and would end its walk early.
*/
const MAX_PAGE_ITEMS = 100;
```
