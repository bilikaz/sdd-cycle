# Configuration

**Rule.** The environment is read in one place, by named readers that refuse garbage at boot. Everything
below that reads one typed config object, built once at the composition root and injected, with exported
defaults that are valid in every deployment and environment references for whatever varies between them.
Settings a person may edit are validated against the shape their owners declare, and every setting the
system relies on is an independent leaf that is always present.

## Rules

1. **One env read point.** `process.env` (or the platform equivalent) is read only by the env layer: the
   config loader and the boot readers of rule 3. Everything downstream consumes the typed config object or a
   reader's typed answer. A new setting is one typed field, one default and one read in that layer, never a
   scattered `process.env.X`. A value a process needs before its config exists (its port, its log level,
   a connection URL, an internal secret) is a **boot scalar**, read by the same readers at the entry point.
2. **Precedence is explicit:** CLI flag > environment > default, implemented once in the loader, never
   re-decided per call site.
3. **Named readers, not ad-hoc coercion.** One helper per answer type, each taking the variable's name and
   an optional fallback: `readEnvString`, `readEnvInt`, `readEnvBool`, `readEnvChoice(name, allowed,
   fallback)`, `readEnvUrl`. The empty string is the only absence; any other value must parse, or the
   process refuses to boot naming the variable. One definition of what counts as true serves every reader.
   A reader called without a fallback is the required case: an unset variable refuses. A connection URL is
   required — a process without its store cannot boot.
4. **Defaults are exported** so tests build their configs from the real defaults and override only what the
   test exercises. A test that retypes the default config stops matching production the day a default
   changes.
5. **Validate per selected mode, fail fast, say what to do.** Only the settings the chosen mode needs are
   required. Every section's and every unit's schema runs at boot; a value that does not parse stops the
   process with a message naming the setting and how to fix it. Fallbacks apply on absence only — a
   set-but-wrong value never silently becomes a default.
6. **Safety gates are environmental, not flags.** When a mode is dangerous unless sandboxed, detect the
   sandbox by an artifact the runtime creates (such as `/.dockerenv`), never by a variable any caller can
   export. Likewise derive identity ("who am I") from the credential itself, not from CI-shaped hints.
7. **Environment for bootstrap, config for tunables.** The environment carries infrastructure bootstrap:
   URLs, credentials, sandbox flavour. Anything a person might tune is a config setting with a default,
   changeable without a redeploy where the project has an editable settings layer. A tunable that only a
   redeploy can change is a design smell.
8. **Defaults are portable constants.** A committed default is valid in every deployment space. Anything
   that varies by space (public origins, endpoints, credentials) defaults to an environment *reference*
   that each space's deploy file supplies. A config value that names a secret is always such a reference,
   never the secret.
9. **One typed config, injected — never an ambient read.** Configuration reaches code as one typed object
   built at the [composition root](composition-root.md) and injected (`config: Config`). Below the root
   nothing reads a module-level accessor or looks a setting up by a path string (`config("ui.publicUrl")`);
   this is enforced by a lint rule where the project wires one. A branch that only holds settings is a
   **section**: one schema with its defaults and transforms, one file per section, the folder its registry,
   read as typed properties (`config.ui.publicUrl`) — never a service that exists to hold them. A unit with
   behaviour declares its own branch as one schema beside the behaviour it configures; a class registered
   twice keeps its per-instance defaults in its registration, judged by the same schema.
10. **Editable settings are validated by shape membership, not key arithmetic.** A stored settings layer
    keys every entry by one path shape — **tree · branch · leaf**, then any **keys**: the tree names the
    part of the system that owns it (a layer, never the process hosting it), the branch a registered owner
    inside it, the leaf a setting that owner declares, the keys a chain inside an object-valued leaf. A
    write is valid only if an owner claims the tree and branch, the rest exists in its declared default
    shape, and the value's type matches the default's. The declared shape is the settings inventory — "what
    can I set" is derived, never hand-listed. A stored path no current owner claims is dropped at boot (a
    removed feature never blocks a start); an unknown key under an owner that does claim it is refused. A
    nested owner that can be switched on and off may have its whole key written (`null` off, an object on).
    Keep this layer apart from live operational data.
11. **A leaf is an independent unit; its keys are optional.** A setting the system relies on is a leaf: it
    needs no sibling to mean something and is always present — its default guarantees it, even as an empty
    object. Inside an object-valued leaf a key may be present, `null` (switched off) or missing, and the
    system still works on what the leaf holds (`providers: {}` offers none). A reader reads the leaf and
    never assumes a key.
12. **A leaf is named after what it holds.** A leaf gathering same-kind owners takes their kind's name, the
    one their code's folder already carries (`providers`, not `services`), never a generic container word.
13. **One active choice is one leaf; its `type` picks, every key stays.** Where exactly one of several
    backends is in use, the setting is one leaf whose `type` names the backend
    ([pluggable-backends](pluggable-backends.md)) beside the keys the backends declare. Each backend reads
    the keys it needs; changing `type` keeps every key, so switching back loses nothing. Several backends on
    at once are a leaf of keys, one per backend, each switchable (rule 11).
14. **Derive, don't duplicate.** A value that follows from another setting is derived from it, never a
    second switch that can disagree: a session cookie is `Secure` exactly when the public origin is `https:`.
15. **Time limits: one mechanism per concern.** A long-running unit declares its own lifetime as a
    constant, not as a per-call setting two callers can read differently; separate settings bound each
    finer concern (one external call, one model completion, an attempt budget). A timeout is a first-class
    outcome, recorded as such — never disguised as an empty result.

**Tolerated exceptions.** Presentation concerns (TTY detection, `NO_COLOR`) may read the environment at the
presentation site, and a build-time tool config file may read a deploy-time value it needs before the
module graph exists. Neither is a runtime configuration read.

## Why

Scattered environment reads make the set of settings unknowable and let each call site coerce `"0"`,
`"false"` and `""` its own way. One loader with named readers makes every setting discoverable, typed and
refused at boot when wrong, which is where a misconfiguration is cheapest to find. Injecting one typed
object keeps units testable and makes a setting's consumers searchable. Exported, portable defaults keep
tests and every deployment honest against the same values, and validating stored settings against the
declared shape rejects meaningless writes that counting path segments would accept.

## How to apply

```ts
// env.ts — the only module that touches process.env
export function readEnvInt(name: string, fallback?: number): number {
  const raw = process.env[name] ?? '';
  if (raw === '') {
    if (fallback === undefined) throw new Error(`${name} is required: set it to an integer`);
    return fallback;
  }
  const value = Number(raw);
  if (!Number.isInteger(value)) throw new Error(`${name}=${raw} is not an integer`);
  return value;
}

// config/sections/http.ts — one section, one schema, defaults on every leaf
export const httpDefaults = { port: 8080, requestTimeoutMs: 10_000 } as const;
export const httpSchema = z.object({
  port: z.number().int().default(httpDefaults.port),
  requestTimeoutMs: z.number().int().positive().default(httpDefaults.requestTimeoutMs),
});

// a unit receives the typed object, never reads a path
export class Fetcher {
  constructor(private readonly config: Config) {}
  timeout(): number { return this.config.http.requestTimeoutMs; }
}

// a test starts from the real defaults
const config = buildConfig({ http: { ...httpDefaults, requestTimeoutMs: 50 } });
```

A space-varying default is a reference, resolved when the config is built:

```ts
export const uiDefaults = { publicUrl: 'ENV_PUBLIC_URL' }; // each deploy file sets PUBLIC_URL
```
