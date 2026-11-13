# One door: a folder is entered by its index

**Rule in one line:** a folder's `index` file is its one door — the outside imports only it, so the files behind it
can split, merge or move without touching a caller; the folder's own files import each other directly, never
through their own door, and a package never imports itself by its name.

## Rules

1. **The outside enters by the door.** Code outside a folder imports what the folder offers from its `index`
   (`@lib/auth`, `../auth/index.ts`), never a file behind it (`@lib/auth/realm`) — the innermost door it is
   outside of: a nested folder with its own door (`services/auth`) is entered by that one. The door re-exports what
   the outside may use; what it does not re-export is the folder's own. A test reaches the unit it tests directly.
2. **Inside, siblings import siblings.** A file inside a folder imports the file it needs (`./realm.ts`,
   `../service.ts`) — never the `index` of a folder it lives in, its own or an ancestor's: the door re-exports
   the file, so entering it from behind is an import cycle, which breaks at load time in the order the
   runtime happens to evaluate the files.
3. **A package never names itself.** Inside a package, an import is a relative path; the package's name
   (`@lib/core`, `@lib/core/db`) is the outside's door, and the package's own files entering by it are rule 2's
   cycle, one level up.
4. **A door holds no code its own files need.** Where a base class or a helper sits in a folder's `index` and the
   files behind it extend or call it, it moves to a file beside them and the door re-exports it — or the folder's
   own files would have to enter their door to reach it. A base class keeps its named file (`service.ts`,
   `provider.ts`); everything else the door and its files share is grouped by what the code does into a few files
   (a folder's `runtime.ts`, its `types.ts`), never a file per constant, helper or class of a few lines
   ([file-granularity](file-granularity.md)). A scanned module whose `index` *is* the module (a feature's factory,
   a worker, a provider) holds its own code; nothing behind it imports it.
5. **A door decides; it never mirrors.** An `index` stands only where it holds code (rule 4's scanned module) or
   *curates* a surface — every re-exported name a chosen line. `export *` is unknown at a door: it re-exports a
   folder's contents, which is a mirror, not a decision. A folder that is a **catalog** — independent items of one
   kind, where the file *is* the item (a folder of entities, of per-feature DTOs) — has no index at all: the
   outside enters each item by its path, and a package hands a catalog over as a path wildcard in its `exports`,
   never as a mirror of it. A dependency shown by path is a dependency seen; one dissolved into a mirror is the
   one that hides a dead item at the gate.

```ts
// services/auth/realm.ts
import { Service } from "../index.ts"; // never: the door of a folder this file lives in
import { Service } from "../service.ts"; // always: the file itself
```

## Why

A caller that names a file behind the door ties the folder's layout to every caller: splitting `realm.ts` in two
becomes an edit in each app. With one door, the folder's layout is its own business. The other half is the cycle:
a door re-exports its files, so a file importing its own door imports itself through one hop — the language
resolves it, but which file evaluates first decides whether a class is defined when it is extended, and the
failure shows only at load, far from the import that caused it.

## How to apply

- An import of `…/x/realm` from outside `x` becomes an import of `x`'s door; a name the door lacks is added to it.
- `import … from "./index.ts"` or `"../index.ts"` inside the folder becomes the sibling file's own path.
- A package file importing its own package by name becomes a relative import.
- A base class living in a door that its own files extend moves to a file of its own, re-exported by the door.
- A door that only mirrors a folder is no door: the index goes, callers take the items by path, the package's
  `exports` carries the wildcard. A curating door's `export *` lines become chosen names.

## Server-only entry

A folder entered by browser and server code may expose a separate `server.ts` entry for server-only
capabilities. The browser entry does not re-export that entry.
