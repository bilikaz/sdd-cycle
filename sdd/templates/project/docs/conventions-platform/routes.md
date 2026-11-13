# Routes: one registration per route, no request context

**Rule in one line:** a feature's `routes.ts` is one router per resource whose every route is one
registration — the verb, its path, its one DTO, its answer and an inline handler that calls one service
operation — and the router, not the handler, validates, guards and answers through the declared answer.

## Rules

1. **One router per resource, one registration per route.** The router extends the core's feature router
   base. A route is `this.<verb>(path, Dto, ResponseDto, (usersService, dto) => usersService.pageQuery(dto))`
   — the verb, its path, its one DTO ([dtos](dtos.md)), the answer it gives (an entity, the list envelope over
   one, or a response DTO — [dtos](dtos.md) rule 7), and an inline handler that calls **one operation** on the
   request's service, the parameter named after its class ([naming](naming.md) rule 11). A handler that does
   more than call one operation is logic that belongs in the service ([services](services.md)).
2. **Every registration is laid out the same way**, one part per line — the verb and its path, the DTO, the
   answer, the handler, the options when there are any, the closing `);` — and no formatter collapses it. A
   route with no input names `null` for its DTO; a route that answers nothing names `null` for its answer:

   ```ts
   this.get("/",
     userPageQueryDto,
     paginated(platformUserEntity),
     (usersService, dto) => usersService.pageQuery(dto)
   );
   this.post("/",
     userCreateDto,
     platformUserEntity,
     (usersService, dto) => usersService.create(dto),
     {
       status: 201,
     }
   );
   this.get("/me",
     null,
     meQueryResponseDto,
     (authFeatureService) => authFeatureService.meQuery()
   );
   ```
3. **No request context reaches a handler.** The router validates the request against the DTO and hands the
   handler the request's service and the parsed DTO — nothing else. A request value a handler needs that its
   DTO does not carry is a field missing from the DTO.
4. **The router answers, through the declared answer.** **200 by default, for every verb**, with the returned
   object encoded through the route's answer schema — a field the schema does not declare never leaves the API,
   and a codec'd field (a timestamp) goes out as its wire form; a create names `201`; an accepted background
   operation names `202` under [durable execution](durable-execution.md) rule 9; an operation that answers
   nothing names no answer and is a `204` — no body, and no stand-in object saying it went well; no route names
   `200`. A refusal is thrown by the service and answered by the app's one error handler
   ([services](services.md) rule 5) — never mapped in the route.
5. **Guarded by default.** The realm's auth applies to every route — the guard, the two-factor enroll gate,
   and the role check against the router's `roles`. A route escapes it only where the router declares it: an
   unguarded route in the public hook, a guarded route the enroll gate lets through (the enrolment itself) in
   the enroll hook. One route may narrow the router's roles with its own `roles`; it never widens them.
6. **A custom action says its intent in its URL.** Anything that is not plain CRUD on the resource is a verb
   on a path naming what it does — `POST /users/ownership-transfer`,
   `POST /auth/reset` — not a bare noun (`/ownership`) that leaves the reader to guess the verb. Its DTO and its
   operation take the same intent ([dtos](dtos.md) rule 3, [services](services.md) rule 7).
7. **A plain framework handler only where a verb cannot serve.** The rare route that must answer with the request
   itself — a redirect, a leniently read body — is registered on the framework's own app. Every other route is a
   verb.

## Why

Validating, reading the request and answering are the same for every route, so they are written once, in
the router: a route cannot answer differently from its siblings or reach past its DTO. Naming the answer
makes it a contract rather than whatever the row happens to hold: a column added to a table does not reach
the browser until someone declares it. The handler stays
inline after its path, so the DTO types its `dto` without a cast, and one layout per registration makes a
route file read as a table of routes.

## How to apply

- A new route is one verb call in the hook its guard needs; a new unguarded route is a deliberate entry in
  `publicRoutes()`, never a skipped check.
- A handler with a statement, a condition or a second call moves that work into the service.
- A route that names the status `200` drops it; a create without the status `201` gains it.
- A `this.hono` handler without a comment saying why it cannot be a verb is a defect.
