# Naming: by role, not implementation

**Rule.** A name answers the question a reader has at the use site — what role this thing plays — not how it
happens to be implemented. The bells test: if a name makes the reader ask a question it should have answered
("what's git-backed?", "is this the client or the transport?"), rename it before merging. Both directions count:
a name must not raise false expectations either (`listen` implies a subscription; an awaited one-shot consumer is
`receive`).

## Rules

1. **Ports are bare domain nouns** — `Provider`, `Logger`. No qualifier names the technology behind them; a port
   named after its implementation cannot absorb a second one.
2. **A shared base class is named for its role** — the port its adapters implement (`AuthProvider`, `Service`,
   `Repo`) or that port narrowed (`CodeFlowAuthProvider`) — never for what it shares (not
   `TokenExchangeProvider`; the implementation rationale belongs in its comment). It lives in its own file named
   for it beside the adapters (`provider.ts`, `service.ts`), never in the folder's door
   ([one-door.md](one-door.md) rule 4).
3. **Adapters are `<Impl><Port>`** — `GithubAuthProvider`, `SmtpMailTransport`, `PinoLogger`, `MemoryLogger`. No
   extra infixes; a test double follows the same pattern as the real adapters.
4. **Within a subsystem, the consumer-facing API owns the name `client`.** Wire plumbing is `transport`, with the
   directional verbs `send` / `receive` — never HTTP verbs (`postX`), never `listen` for an awaited one-shot. A
   reader opening `client.ts` finds the thing they call.
5. **`index.ts` is only ever a folder's door** — a curated public surface or a registry, under
   [one-door.md](one-door.md). An `index.ts` that holds other real content is content: give it a content name
   (`catalog.ts`).
6. **Error subclasses are `<X>Error`** (`ValidationError`), never sentence fragments (`<X>Failed`). A family whose
   kinds should sort together may lead with the family name instead (`AppErrorConflict`, `AppErrorNotFound`) —
   one such family, chosen once.
7. **A one-function consumer-facing module folds into the client module** rather than existing as a file whose
   name must be guessed.
8. **A file is named for its primary export** where it has one (`model.ts` ↔ `resolveModel`). A file holding a
   family of same-kind items is named for the kind — `types.ts`, `middleware.ts`, `repos.ts` — never after one
   member. Role naming is for a file whose several exports serve one cohesive purpose; when the members simply are
   the same kind, the kind is the name.
9. **A time field names its representation.** A unix timestamp is `<verb>_timestamp` — `created_timestamp`,
   `deleted_timestamp`, in code `createdTimestamp`; a date-time is `<verb>_at` — `created_at`, `activated_at`, in
   code `createdAt`. Never a bare `at` or `timestamp`, never an unsuffixed noun (`created`). Which one new fields
   use is the project's preference ([canonical-shapes](canonical-shapes.md) rule 12).
10. **Stateful collaborators carry a suffix that says how you use them.** An `<Area>Engine` is a long-lived object
    you call to do work and that owns a subsystem's behaviour; an `<Area>Registry` is a lookup of instances by key;
    an `<Area>Store` holds reactive state you read. Three roles are never all `Manager` or `Service`.
11. **A variable holding a class instance is named after its class, first letter lowercase — no exceptions.**
    `usersRepo: UsersRepo`, `ledgerService: LedgerService`, `context: Context`; never a role name
    (`ledger: SessionsRepo`), never an abbreviation (`c`, `r`), never the table's plural (`users: UsersRepo`). This
    holds for a field, a parameter, a destructured dependency and a `const x = new X()` alike.
12. **A type's suffix says what it is handed to.** `<Class>Params` is what a class is constructed with, held as
    `params`; `<function>Params` is a function's input, named after the function (`createApp` → `CreateAppParams`;
    a method takes its class's name first: `JobService.run` → `JobRunParams`); `…Options` is only the optional
    tuning beside a call's real arguments; `<Component>Props` a UI component's; `…Input` what a form or a create
    takes in. Never `Deps` (reads as a package's dependencies), never `Opts`, never `Config` as a suffix where the
    project's glossary gives *Config* its own meaning.
13. **No new word.** A thing is named with the word that already names it — the glossary term, its table, its
    entity, its class (`users` → `user`, `email_templates` → `email_template`) — never a fresh synonym to dodge a
    clash or read better (`account`, `actor`, `member`). A real collision, or a reason strong enough for a new
    word, is debated first; the word enters the glossary on the owner's decision, and only then the code. One
    thing, one word.
14. **Full words, said plainly.** Never an abbreviation (`Opts`, `resolveEnvRef`, `tx`), never an idiom that reads
    as another word (`lockAtRest` read as "restart"). Whole words also include a word the glossary holds (`Repo`,
    `Dto`), an SI unit suffix on a quantity (`timeoutMs`, `ttlS`, `SMTP_TIMEOUT_MS`) and a term the industry says
    as it stands (`env`, `ttl`, `id`, `url`).
15. **No qualifier the scope already says.** A name repeats nothing its file, class or folder already tells the
    reader: `timeoutMs` inside `transports/smtp.ts`, never `smtpTimeoutMs`. A qualifier is added only where two
    same-named things meet in one scope.
16. **Prefer the qualified name over an ambiguous bare word.** Where a common word means several things across
    the codebase, the concept's name is the qualified one — `traceId`, not `trace`; `publishedStatus`, not
    `status` — in prose, identifiers and the glossary alike. Rule 15 still drops what the local scope already says.
17. **A private member is `private name`, never `#name`.** One way to write privacy, the one that pairs with
    `protected`. A backing field beside a public getter takes its own name (`boundConfig` behind `config`), never a
    `#` to dodge the clash. Enforced by ESLint `no-restricted-syntax` on `PrivateIdentifier` where the project
    wires it.
18. **No word from another domain.** A name is the word this system already uses for the thing — its glossary
    term, column or field — never a term borrowed from another discipline because it describes the same shape
    there. A system's own row beside a shared one is named by membership: the scope's word plus the family's word,
    not a metaphor for the copying.
19. **A field holding a thing's word is named for the thing, never a generic.** The word of a template is
    `template`, of a branch `branch`, of a role `role` — never a bare `name`. A generic reads fine in its own table
    and loses meaning wherever it travels: a message, a log line or a form error saying "name xyz" leaves the
    reader asking *the name of what?* The same holds for columns, fields and the error codes built from them
    (`role_in_use`, never `name_in_use`). A display word is `label`, and a word that is genuinely the thing's own
    kind keeps it (a page's `title`) — the rule bans generics, not display words.

## Why

Import sites become role statements: `from "../llm/client.ts"` means "I call the LLM"; `extends AuthProvider`
means "I am an auth provider". Implementation-flavoured names rot the moment the implementation shifts, and
mislead every reader until someone pays to rename them. Synonyms, abbreviations and generic words each make the
reader translate, and every translation is a chance to read the wrong thing.

## How to apply

```ts
// never
class GitBackedStorage {}                  // port named for its implementation
const r = new UsersRepo(db);               // abbreviation
type MailerDeps = { opts: SendOpts };      // Deps, Opts
interface SentEmail {
  name: string;                            // the name of what?
}

// always
class Storage {}                           // the port
class GitStorage extends Storage {}        // <Impl><Port>
const usersRepo = new UsersRepo(db);
type MailerParams = { options: SendOptions };
interface SentEmail {
  template: string;                        // the template it was rendered from
}
```
