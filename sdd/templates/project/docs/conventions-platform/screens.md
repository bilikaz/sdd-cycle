# Screens: state and composition, a page with its cards beside it

**Rule in one line:** a console screen holds one route's state — its data, its BFF calls, its
redirects — and composes its face from the design system, reading refusals through the one form reader and
keeping a list's state in the URL.

## Rules

1. **A screen is state plus composition.** It loads and writes through its module's typed client, keeps the
   state, redirects, and renders either a shared view from the design system or — for a screen that may drift
   between layers or screens — its whole face composed from the package's pieces
   ([ui-components](ui-components.md) rule 15; the two halves, the glossary's UI screen).
   It renders no HTML element and passes no `className` or `style` ([ui-components](ui-components.md) rules 1
   and 8).
2. **A form is composed inline unless it is shared** ([ui-components](ui-components.md) rules 14–15): a
   one-screen form lives in its screen, a shared one is a design-system piece the screen feeds.
3. **A screen one page uses is that page; its cards are files beside it.** The page holds the screen's state,
   load and guard and lays out its cards; each card is a file in the route's `_components/`, exporting its card by
   name and holding the blocks only it uses (its inline form, its modals) as top-level functions of that file
   ([react](react.md) rule 8, [app-routes](app-routes.md) rule 1); the file's name carries its kind (rule 9).
4. **A screen reads its own route.** Its params and its query come from the router's hooks, never from the
   page's props; a screen that reads the query sits behind a `Suspense` boundary so the static prerender passes.
5. **A refusal is read, never guessed.** A refused submit is laid out on the form through the one form
   reader — the API's field details under the form's fields, a domain code optionally under a field, the rest
   in the form's error area ([console-anatomy](console-anatomy.md) rule 5). A refusal the screen words itself
   branches on the error's `code`, never on its status or its message text.
6. **A list's state lives in the URL.** Its page, its search and its filters are query parameters: the screen
   reads them, loads from them and writes them back (a filter change returns to the first page), so a list
   survives a reload and a shared link opens the same view.
7. **A role-gated screen wraps itself in the role guard.** A screen only some roles may see renders inside
   the guard naming them; the guard hides, the API refuses — a hidden screen is never the check.
   The guard and the signed-in user come from the auth module. A module registered as an app-wide provider in
   the root layout — the auth module is one — is the one kind every other may import: its hooks and guards read
   the app's context, not another feature's internals. Any other cross-module import is a defect.
8. **A screen is not storied** ([story-catalog](story-catalog.md) rule 7): its view is, when it has a shared
   one.
9. **A `_components/` file carries its kind at the end of its name**, so the name says what it is. A file whose
   root is a card is `<name>Card.tsx` — a card that opens modals inside it is still a card; a modal or confirm, with
   the trigger that opens it when it carries one, is `<name>Modal.tsx`; the export is the same name in PascalCase. Card and Modal are the two
   kinds; a third is the user's to add, raised before one is built.

In this repo, the app-wide providers' modules are `auth` (`AuthProvider`: `useAuth`, `RequireAuth`, `RequireRole`) and
`config` (`PublicConfigProvider`: `useCopy`, `useLanguages`, `useUploadMaxMegabytes` — every screen's words and
languages, and the library upload's cap).
Screens: `apps/platform/src/app/**/page.tsx`, a `'use client'` file whose default export is the screen
(`export default function <Name>Page()`), with its cards and modals in `_components/` beside it, each exporting its card or modal by name
(`_components/userCard.tsx` → `UserCard`, `_components/addUserModal.tsx` → `AddUserModal`). The page and its cards call their module's client instance in `api.ts` ([clients](clients.md)), link and redirect through
`routes` from `@/config`, read `useParams` / `useSearchParams` from `next/navigation`, and write the list's
query back with `router.replace`. A form's schema is its module's `schemas.ts`, the DTO it submits to — extended only by a field no route
takes ([dtos](dtos.md) rule 9). The form reader is `formErrors(error, fallback, { fields, codes })` from
`@template/bff/client`, answering `{ fields, general }`; a screen's own wording keys on `ApiError.code`. The
role guard is the auth module's `RequireRole roles={['owner', 'admin']}`. The composition check is the app's
ESLint config (`apps/platform/eslint.config.mjs`), in the gate.

Checked by the gate (lint, `local/module-boundary` in `eslint-rules/`): a module's files import no other
module — by `@/modules/‹b›` or a relative path out of it — but an app-wide provider's module (rule 7); and the tier
check (`apps/platform/scripts/check-ui-tiers.sh`): every file under `src/app/**/_components/` ends in `Card.tsx` or
`Modal.tsx` (rule 9).

## Why

A screen is where state, calls and navigation meet, so it is kept to exactly those: the look is the design
system's, the rule is the API's, and the refusal's words are the API's too unless the screen deliberately
rewords a code. URL state costs one read and one write and buys reload, back-button and link-sharing for
free.

## How to apply

- A screen that holds markup, a stylesheet or a `className` composes a design-system piece instead.
- A `catch` that shows `error.message` for a form submit goes through the form reader.
- A list whose page or filter lives only in component state moves it into the query.
- A screen shown to fewer roles than its section wraps itself in the role guard; its API still answers 403.
