# Destructive actions

**Rule.** A delete affordance names exactly the thing that is destroyed — no more, no less — and an item
deleted from any historical enumeration in the UI leaves a visible tombstone, never a silent gap.

## Rules

1. **Name the actual loss, consistently.** Pick the noun for what is really destroyed and use it on every
   surface: the button, the confirmation and the tombstone ("Delete run log" → "Run log deleted"). If the
   honest noun sounds harmless, that is the point — it was harmless.
2. **Scope bulk claims with counts.** "Delete 15 run logs" promises exactly the blast radius.
3. **Leave a tombstone in history.** When a deleted item was enumerated somewhere (chips, rows, links),
   render an inert tombstone in its place — muted, unclickable, with a hint saying what survived and where
   ("Its result stays in the report"). Stable counts tell the user nothing else was lost.
4. **Never undersell.** If live work stops as a side effect (deleting a running task cancels it), the
   surrounding flow makes that consequence known; a safe-sounding label must not hide an unsafe effect.
5. **Live views are exempt.** A "what is active now" view is a snapshot, not a history; an item leaving it
   on close is expected. Split the two: the live panel drops the item, the durable log renders the
   tombstone. The test: would a user expect this list only ever to grow? If yes, it is a history.

## Why

Users infer data loss from the shape of the UI, not from the implementation. A label that oversells the
loss ("Delete agent" when only a transcript goes) makes a safe cleanup feel dangerous. A list of linked
items that shrinks as referenced items are deleted reads as corruption, even when nothing the system
depends on was lost.

## How to apply

```ts
type LinkedItem =
  | { kind: 'live'; id: string; title: string }
  | { kind: 'deleted'; id: string; survivedIn?: string };

function renderLink(item: LinkedItem): Chip {
  if (item.kind === 'deleted') {
    return { label: 'Run log deleted', muted: true, clickable: false, hint: item.survivedIn };
  }
  return { label: item.title, clickable: true, href: `/runs/${item.id}` };
}

const confirmText = (count: number) => `Delete ${count} run log${count === 1 ? '' : 's'}?`;
```
