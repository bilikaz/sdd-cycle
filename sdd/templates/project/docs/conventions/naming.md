# Naming: by role, not implementation

**Rule.** A name must answer the question a reader has at the *use site* — what role
does this thing play — not record how it happens to be implemented.

**The bells test.** If a name makes the reader ask a question it should have answered
("what's git-backed?", "is this the client or the transport?"), rename it before
merging. Both directions count: a name must not raise false expectations either
(`listen` implies subscription semantics; an awaited one-shot consumer is `receive`).

## Rules

1. **Ports are bare domain nouns** — `Provider`, `Logger`. No qualifier that names the
   technology behind them (a port named after its implementation can't absorb a second
   implementation).
2. **A shared base class is named for its role** — the port its adapters implement (`AuthProvider`,
   `Service`, `Repo`), or that port narrowed (`CodeFlowAuthProvider`) — never for what it shares (not
   `TokenExchangeProvider` — implementation rationale belongs in the class comment). It lives in its own file
   named for it beside the adapters (`provider.ts`, `service.ts`), never in the folder's door
   ([one-door](one-door.md) rule 4).
3. **Adapters are `<Impl><Port>`** — `GithubAuthProvider`, `SmtpMailTransport`, `PinoLogger`, `MemoryLogger`.
   No extra infixes; the test double follows the same pattern as real adapters.
4. **Within a subsystem, the consumer-facing API owns the `client` name**; wire
   plumbing is `transport`, with directional verbs `send` / `receive` (the canonical
   channel pair — never HTTP verbs like `postX`, never `listen` for an awaited
   one-shot). A reader opening `client.ts` must find the thing they call.
5. **`index.ts` is only ever a folder's public face** — a barrel or a registry. A barrel exists
   only at a LAYER's public face and exports the audited list of what outside consumers actually
   use — not everything the layer contains. Inner folders normally need no barrel (internals
   import each other directly); delete barrels that serve nobody. An `index.ts` that holds real
   content is content — give it a content name (`catalog.ts`), don't let it pose as a barrel.
6. **Error subclasses are `<X>Error`** (`LLMValidationError`), never sentence
   fragments (`<X>Failed`). One family is named the other way round, so its kinds
   sort together: the API's domain errors are `AppError` + its kind
   (`AppErrorConflict`, `AppErrorNotFound` — the glossary's **App error**).
7. **One-function consumer-facing modules fold into the client module** rather than
   existing as a file whose name must be guessed.
8. **File names match their primary export** where a file has one
   (`model.ts` ↔ `resolveModel`). A file that holds a **family of same-kind items** is
   named for the **kind**, *never after one member* — `types.ts` (not one type),
   `middleware.ts` (not one middleware), `repos.ts` (not one repo) — mirroring the `types.ts` naming. Naming a family container after one of its members (a `middleware.ts`
   called `owner.ts` because `owner` is the one you reach for) makes the file lie about
   what it holds. Reserve **role-naming** for a file whose several exports serve *one
   cohesive purpose* that isn't just "a bunch of the same kind of thing"; when the
   members simply *are* the same kind, the kind is the name.
9. **A time field names its representation.** A unix timestamp is `<verb>_timestamp` — `created_timestamp`,
   `deleted_timestamp`, in code `createdTimestamp`; a date-time is `<verb>_at` — `created_at`, `activated_at`, in
   code `createdAt`. Never a bare `at` or `timestamp`, never an unsuffixed noun (`created`). Which one new fields
   use is the project's preference ([canonical-shapes](canonical-shapes.md) rule 12).
10. **Stateful collaborators carry a role suffix that says how you use them.** An
   `<Area>Engine` is a long-lived object you *call to do work* and that owns a
   subsystem's behaviour (`SessionEngine`); an `<Area>Registry` is a *lookup* of
   instances resolved by key; an `<Area>Store` *holds reactive state* you read. The
   suffix answers, at the use site, whether to invoke it, resolve from it, or read it —
   so don't name three different roles all `Manager`/`Service`.
11. **A variable holding a class instance is named after its class, first letter lowercase — no exceptions.**
   `usersRepo: UsersRepo`, `ledgerService: LedgerService`, `authRealm: AuthRealm`, `context: Context`,
   `hono: Hono`; never a role name (`ledger: SessionsRepo` reads as the Ledger service), never an abbreviation
   (`c`, `r`), never the plural of the table (`users: UsersRepo`). A field, a parameter, a
   destructured dependency and a `const x = new X()` alike — the name alone tells what it is.
12. **A type's suffix says what it is handed to.** `<Class>Params` is what a class is constructed with
   (`UsersServiceParams`, `AuthRealmParams`, `LedgerRouterParams`), held as `params`; `<function>Params` what a
   function is handed as its input, named after the function (`createApp` → `CreateAppParams`, `authFeature` →
   `AuthFeatureParams`; a method takes its class's name before its own, a `run` on `JobService` →
   `JobRunParams`);
   `…Options` only the optional tuning beside a call's real arguments (`RouteOptions`, `QueryOptions`);
   `<Component>Props` a React component's; `…Input` what a form or a create takes in. Never `Deps` (it reads as a
   package's dependencies), never `Opts` (an abbreviation), never `Config` as a type suffix (the glossary's **Config**
   is the global config).
13. **No new word.** A thing is named with the word that already names it — the glossary's term, its table, its
   entity, its class (`users` → `user`, `email_templates` → `email_template`) — never a fresh synonym to dodge a
   clash or to read better (`account`, `actor`, `member`, `grant`, `Deps` were each one). A real collision, or a
   reason strong enough for a new word, is presented and debated first; the word lands in the glossary on the user's
   word, and only then in code. One thing, one word: drift is a second name for an entity that already has one.
14. **Full words, said plainly.** A name says what the thing is or does in whole words a reader takes at face value —
   never an abbreviation (`Opts`, `resolveEnvRef`, `tx`), never an idiom that reads as another word (`lockAtRest`: "at rest" read
   as *restart*). A word the glossary already holds is a whole word (`Repo`, `Dto`), and so is an SI unit symbol
   suffixing a quantity (`timeoutMs`, `ttlS`, `SMTP_TIMEOUT_MS`) and a term the industry says as it stands
   (`env`, `ttl`, `id`, `url`); anything else is spelled out.
15. **No qualifier the scope already says.** A name repeats nothing its file, class or folder already tells the
   reader: `wireParams` inside `providers/anthropic.ts`, never `anthropicWireParams`. A qualifier is added only where
   two same-named things can meet in one scope — `OPENAI_KNOBS` and `ANTHROPIC_KNOBS`, imported side by side.
16. **A private member is `private name`, never `#name`.** One way to write privacy, the one that pairs with
   `protected`. A backing field beside a public getter of the same idea takes its own name (`boundConfig` behind
   `config`, `mailTransport` behind `transport()`), never a `#` to dodge the clash. Lint refuses `#`
   (`no-restricted-syntax`, `PrivateIdentifier`).

17. **No word from another domain.** A name is the word this system already uses for the thing — its glossary's
   term, its table's column, its DTO's field — never a term borrowed from another discipline because it describes the
   same shape there. A word that carries its own field's meaning into ours makes every reader translate, and the
   translation is lossy: the borrowed word says what the thing resembles, not what it is here. When the thing this
   system has is a row of its own alongside a shared one, the name says that membership — the scope's own word plus
   the family's word — not a metaphor for the copying.

18. **A field that holds a thing's word is named for the thing, never `name`.** The typed word of a category is
   `category`, of a RAG `rag`, of a tag `tag` — never `name`, `title` or `label`. A generic field reads fine in
   its own table and loses its meaning everywhere it travels: a message, a log line, a form error or a join
   saying "name xyz" leaves the reader asking *the name of what?*; "category xyz" answers it. The same holds for
   the column, the entity field, the DTO field and the refusal code built from it (`category_in_use`, never
   `name_in_use`).

## Why

Import sites become role statements: `from "../llm/client.ts"` means "I call the
LLM"; `extends AuthProvider` means "I am an auth provider". Implementation-flavored names
rot the moment the implementation shifts, and mislead every reader until someone
pays to rename them.

## Additional shared rules

19. **Prefer the qualified name over an ambiguous bare word.** Where a common word means several things across
    the codebase, the concept's name is the qualified one — `traceId`, not `trace`; `publishedStatus`, not
    `status` — in prose, identifiers and the glossary alike. Rule 15 still drops what the local scope already says.
