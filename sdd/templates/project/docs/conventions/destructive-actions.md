# Destructive actions: name the loss, leave tombstones

**Rule:** A delete affordance names exactly the thing that is destroyed — no
more, no less — and a deleted item in any enumerated UI leaves a visible
tombstone, never a silent gap.

## Why

Users infer data loss from UI shape, not from implementation. Two failure
modes, both observed in real work:

- **Overselling the loss.** A button labeled "Delete run" (or worse, "Delete
  agent") when only the run's *transcript* is destroyed — its answer survives
  elsewhere — makes a safe cleanup feel dangerous, so users avoid it or fear
  they broke something.
- **Silent shrink.** A list of five linked items becoming four, then three, as
  referenced items are deleted reads as corruption ("where did my context
  go?") even when nothing the system depends on was lost.

## How to apply

- Pick the noun for what is actually destroyed and keep it consistent across
  every surface: the action button, the confirmation text, and the tombstone
  ("Delete run log" → "Run log deleted"). If the honest noun sounds harmless,
  that's the point — it was harmless.
- Scope claims with counts where bulk applies: "Delete 15 run logs" promises
  exactly the blast radius.
- When a deleted item was enumerated somewhere (chips, rows, links), render an
  inert tombstone in its place — muted, unclickable, with a hint saying what
  survived and where ("Its answer stays in the tool result"). Counts staying
  stable is what tells the user nothing else was lost.
- Conversely, never *undersell*: if live work is killed as a side effect
  (deleting a streaming task stops it), the surrounding flow must make that
  consequence knowable — a safe-sounding label must not hide an unsafe effect.
- **Live "what's active now" views are exempt from the tombstone rule** — they
  are a snapshot of current state, not a history, so an item leaving on close is
  expected, not a silent shrink (a running-processes list shrinks when a process
  exits; nobody reads corruption into it). The tombstone obligation falls on the
  **historical** enumeration instead. Split the two: the live panel drops the
  item; the durable log (transcript, audit list) renders the inert tombstone. The
  test for which surface is which: would a user expect this list to only ever
  grow? If yes it's a history (tombstone); if it tracks "right now" it may drop.
  (Example: closing a browser window removes it from the all-windows panel, while
  the tool-call that opened it keeps an alive-link-or-tombstone in the transcript.)
