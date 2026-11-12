# Format — diagrams and tables

The shape of anything drawn or tabulated in a document. It exists because these forms are read in many
environments — platform renderers, IDEs, narrow panes — and a form that depends on line width or parser luck
either stops rendering or becomes unreadable exactly where it matters.

## Diagrams

- **Mermaid, never ASCII art.** Diagrams render on the platform and in IDEs and survive edits; ASCII art does
  neither.
- Quote a node label containing `?`, `/` or `<br/>` — the flowchart parser traps on them.
- Never put a `;` in a sequence-diagram message or a `Note`: it terminates the statement and the remainder
  fails to parse. Use a comma or *and*. Avoid `;` in flowchart labels too.

## Tables

- **Detail belongs in tables, not annotated trees.** A code-block tree with trailing `# comments` depends on
  line width: in a narrow viewer the lines wrap and the alignment — the only thing carrying the meaning —
  collapses. Tables reflow per cell and survive any column width.
- A tree is for **shallow shape** only — short names, no annotations. The moment per-item explanation appears,
  it is a two-column table: `item | what it is`.
- **One record per row.** A row names exactly one thing; entries joined by `+` or `·` are different things and
  each takes its own row, even when several share a description — repeat it per row. Readers cite rows; a row
  naming two things cites two claims.

## Paths in tables

- **One path base per table.** The section heading names the root (`apps/ui`) and every row is `./`-relative to
  it; mixed bases in one table make "what is where" unguessable.
- A different root is a different section with its own table.
- A file inventory has **three columns — `path | files | what`**: the folder once, its files as short names,
  and never a brace-expansion path (`{a,b}.ts` wraps badly and reads worse).

## Templates

Keep only basic file-wide guidance in the top COMMENTS block. Put field-specific instructions and examples
in a COMMENTS block beside their field or section.

## Reports

Use the [shared report template](../implementation/templates/report.md).
Its section COMMENTS blocks own report structure, field guidance and examples.
