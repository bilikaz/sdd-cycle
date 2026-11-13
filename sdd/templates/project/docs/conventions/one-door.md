# One door: a folder is entered by its index

**Rule.** A folder's `index` file is its one door: the outside imports only it, so the files behind it can split,
merge or move without touching a caller. The folder's own files import each other directly, never through their
own door, and a package never imports itself by its name.

## Rules

1. **The outside enters by the door.** Code outside a folder imports what the folder offers from its `index`
   (`@app/auth`, `../auth/index.ts`), never a file behind it (`@app/auth/realm`) — through the innermost door it
   is outside of: a nested folder with its own door is entered by that one. The door re-exports what the outside
   may use; what it does not re-export is the folder's own. A test reaches the unit it tests directly.
2. **Inside, siblings import siblings.** A file inside a folder imports the file it needs (`./realm.ts`,
   `../service.ts`) — never the `index` of a folder it lives in, its own or an ancestor's. The door re-exports the
   file, so entering it from behind is an import cycle, which breaks at load time in whatever order the runtime
   evaluates the files.
3. **A package never names itself.** Inside a package an import is a relative path; the package's name
   (`@app/core`, `@app/core/db`) is the outside's door, and the package's own files entering by it are rule 2's
   cycle one level up.
4. **A door holds no code its own files need.** A base class or helper that sits in a folder's `index` and that
   the files behind it extend or call moves to a file beside them, and the door re-exports it. A base class keeps
   its named file (`service.ts`, `provider.ts`); everything else the door and its files share is grouped by what it
   does into a few files (`runtime.ts`, `types.ts`), never a file per constant or helper
   ([file-granularity.md](file-granularity.md)). A scanned module whose `index` *is* the module (a feature's
   factory, a worker, a provider) holds its own code; nothing behind it imports it.
5. **A door decides; it never mirrors.** An `index` stands only where it holds code (rule 4's scanned module) or
   curates a surface outside consumers actually use — every re-exported name a chosen line. `export *` is unknown
   at a door: it re-exports a folder's contents, which is a mirror, not a decision. Inner folders whose files are
   only imported by their neighbours need no door, and a door that serves nobody is deleted. A folder that is a
   **catalog** — independent items of one kind, where the file *is* the item (a folder of entities) — has no
   index at all: the outside enters each item by its path, and a package hands a catalog over as a path wildcard
   in its `exports`, never as a mirror.
6. **A folder shared with a browser bundle keeps server-only code in a server half.** What only server code may
   use sits in `server.ts` beside `index.ts`, marked server-only, and the browser's door never re-exports it — it
   would fail every client import of the folder. The folder still has one door in rule 1's sense; `server.ts` is
   entered only by the alias the package or app publishes for it, never by a relative path.

Between packages, rule 1 holds by construction: a package's doors are its `package.json` `exports`, and a path not
exported does not resolve. Inside a package, rules 1–3 are enforced by a lint rule where the project wires one
(`import/no-cycle` from `eslint-plugin-import` catches rule 2's cycles); rule 5's `export *` ban is ESLint
`no-restricted-syntax` on `ExportAllDeclaration`.

## Why

A caller that names a file behind the door ties the folder's layout to every caller: splitting `realm.ts` in two
becomes an edit in each consumer. With one door, the layout is the folder's own business. The other half is the
cycle: a door re-exports its files, so a file importing its own door imports itself through one hop — the
language resolves it, but which file evaluates first decides whether a class is defined when it is extended, and
the failure shows only at load, far from the import that caused it. A mirror door hides a dead item; a dependency
taken by path is a dependency seen.

## How to apply

- An import of `…/x/realm` from outside `x` becomes an import of `x`'s door; a name the door lacks is added to it.
- `import … from "./index.ts"` or `"../index.ts"` inside the folder becomes the sibling file's own path.
- A package file importing its own package by name becomes a relative import.
- A base class living in a door that its own files extend moves to a file of its own, re-exported by the door.
- A door that only mirrors a folder is no door: the index goes, callers take the items by path, the package's
  `exports` carries the wildcard. A curating door's `export *` lines become chosen names.

```ts
// services/auth/realm.ts
import { Service } from "../index.ts"; // never: the door of a folder this file lives in
import { Service } from "../service.ts"; // always: the file itself

// services/auth/index.ts — a curated door
export { AuthRealm } from "./realm.ts";
export type { Session } from "./types.ts";
```
