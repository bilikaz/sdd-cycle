# DTOs: one request shape per route, one contract both sides import

**Rule in one line:** what crosses between an API and its console is declared once, in a browser-safe shared
folder both sides import — one request DTO per route (its path, query and body in one object, named object +
action + `Dto`), the entities it answers with, and a response DTO only where an answer is a view of them;
behaviour never lives there.

## Rules

1. **One DTO per route, the whole request in one object.** A route's DTO describes its path params, its
   query fields and its body together; the router validates it against the request's merged input, a path
   param winning its key ([routes](routes.md) rule 3). A route with no input has none.
2. **Named object first, then the action, then `Dto`** — `userCreateDto`, `configBranchUpdateDto`. A
   sub-entity follows its parent (`configBranch…`), so a resource's DTOs sort together.
3. **The action comes from the route.**
   - A CRUD route takes its verb's word: `POST` → `Create`, `PUT` / `PATCH` → `Update`, `DELETE` → `Delete`,
     `GET` one → `Query`, `GET` a list → `PageQuery` (the path and the query string are both the request's
     addressing, so one word covers them).
   - A **custom action** takes the intent its URL says ([routes](routes.md) rule 6):
     `POST /users/ownership-transfer` → `userOwnershipTransferDto`,
     `POST /auth/reset` → `passwordResetDto`.

   A route, its DTO and its operation ([services](services.md) rule 7) read as one group:

   | Route | DTO | Method (on `UsersService`, `ConfigService` for the branch rows, the auth service for the last row) |
   |---|---|---|
   | `GET /users` | `userPageQueryDto` | `pageQuery` |
   | `GET /users/:userId` | `userQueryDto` | `query` |
   | `POST /users` | `userCreateDto` | `createInTransaction` |
   | `PATCH /users/:userId` | `userUpdateDto` | `updateInTransaction` |
   | `POST /users/ownership-transfer` | `userOwnershipTransferDto` | `ownershipTransferInTransaction` |
   | `GET /config/branches/:path` | `configBranchQueryDto` | `branchQuery` |
   | `PATCH /config/branches/:path` | `configBranchUpdateDto` | `branchUpdateInTransaction` |
   | `DELETE /sessions/:sessionId` | `sessionDeleteDto` | `sessionDelete` |
4. **The schema is a camelCase value; its types are the same name in PascalCase** — the parsed value, and
   that plus `Json` for what the wire carries:
   `export type UserCreateDto = z.output<typeof userCreateDto>` ·
   `export type UserCreateDtoJson = z.input<typeof userCreateDto>`.
5. **A route answers an entity, the list envelope over one, or a response DTO — never a hand-written shape**
   (rule 7) — and names it ([routes](routes.md) rule 1). A `dto.ts` holds its feature's DTOs, requests and
   responses: behaviour never lives there.
6. **The contract lives in a shared folder, browser-safe.** A layer-agnostic contract (the entities, the auth
   routes' DTOs) is the core package's; a layer's routes' DTOs and answer views are that layer's shared
   package's — one folder per kind (`entities/` · `dtos/<feature>/dto.ts`), room left for other kinds beside
   them. A shared folder imports nothing but the schema library, the core's
   shared entry and its own files, so a browser may import any of it; the API and the console both import it,
   and neither copies it.
7. **An entity is one schema; a response DTO is a view of entities.** An entity describes one product thing
   (the glossary's **Entity**) once, for every layer: its schema, its row type (`z.output` — what a repo reads
   and writes) and its JSON type (`z.input` — what the wire carries); a field whose value differs between the
   two (a timestamp) is a codec. The schema is the repo's read shape — derived columns and joined rows ride
   with it — and carries only what is stored, never a request's rules (those are the fields the DTOs read). The
   repo takes its row type from it. A **response DTO** exists only where an answer is not a bare entity — about
   an entity, built from it (`.pick` · `.extend` · a join of two), never a fresh shape; about no entity (a token
   pair, a secret, a BFF's own answer), its own shape — named after the route it answers plus `ResponseDto`
   (`meQueryResponseDto`), or after its object where several routes share it (`sessionTokensResponseDto`). A list answers the
   one envelope over its item — an entity, or a response DTO where the item is a view — never a list shape of
   its own; the one exception is a whole tree, answered unpaged under its own name (the library's
   `libraryCategoryTreeResponseDto`, `{ categories, rags, categoryRags }`), since a tree is read whole or not at all. Both are DTOs, and the name says the side: `…Dto` is what a route takes, `…ResponseDto` what it
   answers — the same word from the API and from the console.
8. **Each kind carries its suffix** — `…Entity`, `…Dto` (a request) or `…ResponseDto` — and a file of a kind exports only that
   kind's schemas and their derived types (rule 4).
9. **The DTO carries the words a form shows.** A rule's user-facing message is written on the DTO's field, so
   a console form that validates with the DTO and the API's field refusal say the same thing. A form with a
   field no route takes (a password typed twice) extends the DTO it submits to; only that field and its
   message are the console's.

## Why

One DTO per route makes the request's whole contract one readable object, and the router can validate it
before any code runs. Naming it after the route, and the operation after the DTO, lets a reader go from a URL
to its shape to its logic without a lookup — three names that differ only by a suffix and the service's own
entity.

A console that copies the API's shapes compiles against its copy, so a renamed field or a changed rule breaks
only at runtime, and only where a test happens to look. One contract both sides import turns that drift into a
typecheck failure in the same gate run; keeping it browser-safe is what lets the console import it at all, and
putting the messages on the DTO keeps the form and the API's refusal saying the same words.

## How to apply

- A new route gets its DTO in the same change, named by rule 3; a second DTO for the same route (one for the
  path, one for the body) merges into one.
- A DTO named after its HTTP verb (`userPostDto`) or its handler (`userSaveDto`) is renamed to
  its action.
- A refinement that reads a repo or a service is logic: it moves to the service, which throws the App error.
- A type a console declares for what an API sends or answers is a copy: it is replaced by the shared DTO,
  entity or response DTO, and a rule the console restates moves onto the DTO's field.
- A new field is added once, on the entity or the DTO; both sides see it at the next typecheck.
