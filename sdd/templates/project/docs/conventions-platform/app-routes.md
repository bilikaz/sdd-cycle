# App routes: `app/` maps URLs to screens

**Rule in one line:** a Next.js app's `app/` folder maps URLs to screens and frames them — a `page.tsx` is its
screen (it loads, wears the guard and lays out its cards and modals, each a file in `_components/` beside it), a `route.ts`
re-exports a module's server handler, a route group's layout composes its frame, and every screen path comes from one
route table.

## Rules

1. **A page is its screen, and its cards and modals live beside it.** Code one page uses lives in that page's folder:
   `page.tsx` reads its params, loads the data, wears the role guard around everything it renders — so the
   permissions read at the export — and lays out its cards; each card is a file in `_components/` beside it, owning
   its own state and actions and talking to the page by props — the data in, a callback out. A modal the page opens itself, from its head or
   from a row of a table it lays out, is a file in `_components/` too — each file named for its kind,
   `<name>Card.tsx` or `<name>Modal.tsx` ([screens](screens.md) rule 9). A card's actions sit where the card standard puts them: a row's control, the
   form's foot ([console-anatomy](console-anatomy.md)). The module keeps what pages share: its typed client and its BFF
   handlers. `src/components/` holds only what two or more pages or layouts reuse, and a
   layout's own part lives in its layout.
2. **A route file is a one-line re-export of its module's server handlers**:
   `export { GET, POST } from '@/modules/users/server/users';` — one export per method it
   serves, the handlers themselves in the module ([bff](bff.md)).
3. **Route groups give pages a frame and a guard without a URL segment.** Each group's layout composes the
   frame its pages share from the design system; a guard that covers a whole group wraps its layout. The root
   layout renders the design system's document layout with the app's skin and the app-wide providers.
4. **The BFF lives under `app/api/`**, its paths mirroring the module's handlers. A browser leg whose path
   is fixed from outside — a provider's return, at the path the API bakes into its `redirect_uri` — sits at
   that path instead, still a one-line re-export.
5. **One route table.** Every screen path is an entry of the app's route table — a constant, or a function of
   the ids it needs (`routes.user(userId)`); a nav entry, a link or a redirect reads it, never
   a literal path.

## Why

A screen one page uses has one home: its `page.tsx`, with its cards beside it, so a route's folder is the whole
screen and deleting the folder deletes the screen with nothing left behind. A server handler stays in its module
behind a one-line `route.ts`, so the BFF lives with the module that owns it, and one route table makes a moved
path one edit.

## How to apply

- A `page.tsx` loads, guards and lays out its cards; a card's state and actions move into its file in
  `_components/`.
- A `route.ts` with more than its re-export moves the rest into the module's handlers.
- A new screen adds its route table entry and its `page.tsx` with its `_components/` in the same change.
- A string path in a screen, a layout or a guard is replaced by its route table entry.
