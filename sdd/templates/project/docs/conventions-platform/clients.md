# Clients: one class per module, mirroring its API service

**Rule in one line:** a console module's browser client is one class mirroring the API service it calls —
one method per operation, named exactly like the operation and typed by the route's shared DTO and answer —
with one instance, exported and named after its class.

## Rules

1. **One class per module.** A module's client is a single class named after the service it fronts plus
   `Api` — `UsersApi`, `ConfigApi`, `AuthApi`; a module whose screen calls more than one service
   (the account page) names the class after the module (`AccountApi`). No free-standing call functions beside
   it ([base-classes](base-classes.md) rule 6).
2. **A method is named exactly like the operation it calls** — the route's DTO name less `Dto` and less the
   service's own entity ([services](services.md) rule 7): `userUpdateDto` → `usersApi.update(…)`,
   `configBranchUpdateDto` → `configApi.branchUpdate(…)`,
   `DELETE /auth/sessions/others` (no input, its operation `sessionOthersDelete`) → `accountApi.sessionOthersDelete()`. Never a verb-first name of the screen's own
   (`changeUserRole`, `saveBranch`): the client, the route and the service read as one word. The `…InTransaction`
   suffix a service entry carries ([services](services.md) rule 9) is not part of that word, and a client never
   carries it: the wire and the browser have no notion of a transaction.
3. **A method is typed by the route's own contract, never a copy** — it takes the route's DTO (the path params,
   the query and the body in one object, the same fields the route validates — [dtos](dtos.md) rule 1) and
   answers what the route answers (its entity, the list envelope over one, or its response DTO), each imported
   from the shared packages ([dtos](dtos.md) rule 6): `usersApi.update({ userId,
   role })`. A route with no input takes no DTO. A type the client declares for itself is a hand copy.
   An ordinary client method may take one optional final `abortSignal?: AbortSignal` as local transport
   control, passed only to the fetch wrapper's signal option. It is not part of the path, query, body,
   shared DTO or decoded answer. The client retains no controller or signal state.
4. **One instance, named after its class** ([naming](naming.md) rule 11):
   `export const usersApi = new UsersApi()`. A screen calls the instance; it never constructs
   one.
5. **A method knows its URL and nothing else.** It builds the path and the query, calls the app's fetch
   wrapper and returns its answer — no state, no retry, no refusal handling: a refusal is thrown and the
   screen reads it ([screens](screens.md) rule 5).
6. **A client calls only what its own module serves.** A screen that needs another service's operation gets
   it on its own module's client, named like that operation (`accountApi.ownershipTransfer` fronts the users
   service's); it never imports another module's client ([screens](screens.md) rule 7).

## Why

A verb-first function per call names the same operation three ways — the screen's word, the route's and the
service's — and each new call site coins another. A class mirroring the service makes the client a map of the
API: find the operation on the server and the client method has its name, with the same fields in; a single
instance keeps the call sites uniform and the one place to swap in a test double.

## How to apply

- A call function outside a module's client class moves into it, renamed after the operation it calls.
- A method whose name differs from its server operation's is renamed to it; one taking positional arguments
  takes the DTO's object instead.
- A screen importing another module's client gets the operation on its own module's client instead.
- A new route's operation gets its method in the same change, named like the route's DTO and typed by it.
- An interface in a module's `types.ts` that mirrors what an API sends or answers is deleted; the method
  imports the shared DTO, entity or response DTO instead.
