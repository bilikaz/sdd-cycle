# Source comments: the code shows itself; a comment says only what it cannot

**Rule.** A source file carries a comment only where the code cannot show what it says. Names, types and
structure show the rest, so everything else holds no comment at all. A comment that stays takes a form declared by its shared pack,
and a lint rule refuses any other.

## Rules

1. **A comment exists only where the code cannot show what it says** — a non-obvious constraint, a trade-off,
   why something that looks wrong is right. A comment that restates a name, a signature, the next block or the
   design is deleted, never softened.
2. **The one form is a `@why` block** above what it explains — a file, a function, any code:

   ```ts
   /* @why
   -----------
   <title: the special case — what it is and why it exists>
   -----------
   <the reasoning>
   */
   ```

3. **A `@why` block is at least 200 characters** from `/*` to `*/`. A reason that cannot fill it was not needed.
4. **`// @union <why>` is the default one-line form**, above a declared union of object shapes.
   A shared stack pack may define an additional form and enable it through the shared comment checker.
5. **No comment names a task, a review round, a report or a ledger row.** The record lives in `docs/tasks/`.
6. **A comment that has started to lie is removed.** The code is the truth; a stale comment is worse than none.

## Why

Source files are read whole, by people and by models, and every comment line spends attention the task needed.
Comments that narrate rot as the design moves and silently become lies, and they invite endless rewording. One
checked form, kept only for what the code cannot say, ends both.

## How to apply

Before writing a comment, ask whether a name, a type or a smaller function would say it. If one would, change the
code instead. If none can, write the `@why` block — its title names the special case, its body gives the reason.

## Additional shared rules

7. **Comments are in English.**
8. **No internal ids, no provenance.** No comment names a ticket, task, review round, report, ledger row or
   decision-record number, and none cites where a decision was argued: it states the rule, and the record lives in
   the task history. Shared vocabulary from the glossary or a published contract is not an internal id.
9. **No history.** What the code used to do, what changed it and what was rejected belong to version control and
   the task record.
10. **A published comment is contract text.** Where a comment becomes output others read — a JSDoc that generates
   an API description or a published type's documentation — it carries nothing internal, under rule 6 with no
   exception.
