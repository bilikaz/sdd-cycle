# Configuration

**Rules.**

1. **One env read point — the env layer.** `process.env` (or the platform
   equivalent) is read only by the env layer: the leaf builders' resolution and
   rule 4's boot readers. Everything downstream consumes a typed config object or
   a reader's typed answer. A new setting = one typed field + a default + one read
   in the layer — never a scattered `process.env.X`.
2. **Precedence is explicit:** CLI flag > environment > default, implemented once in
   the loader, not re-decided per call site.
3. **Defaults are exported** so tests build their configs from the real defaults and
   override only what the test exercises. A test that hand-retypes the default
   config silently stops matching production the day a default changes.
4. **Named readers, not ad-hoc coercion** — one helper per answer type, each taking
   the variable's `ENV_`-prefixed name and one fallback: `resolveEnvString(name, fallback)`,
   `resolveEnvInt(name, fallback)`, `resolveEnvBool(name, fallback)`,
   `resolveEnvChoice(name, allowed, fallback)`. `""` is the only absence — any other
   value must parse or the process refuses to boot, naming the variable — and one
   definition of what counts as true stands for every reader. A reader with no
   fallback is the required case: an unset variable refuses.
5. **Validate per selected mode.** Only the credentials/settings the chosen mode
   needs are required; validation messages say exactly what to set and how.
6. **Safety gates are environmental, not flags.** When a mode is dangerous unless
   sandboxed, detect the sandbox by artifacts the runtime creates (e.g.
   `/.dockerenv`), never by an env variable any caller can export. Same principle
   for identity: derive "who am I" from the credential (`GET /user`), not from
   CI-shaped environment hints.
7. **User-editable settings are validated by shape membership, not key arithmetic.**
   A DB-backed settings layer keys every entry by one path shape — **tree · branch · leaf**, then any **keys**: the
   tree names the part of the system that owns it (a layer, never the process hosting it), the branch a registered
   owner inside it, the leaf a setting that owner declares, the keys a chain inside an object-valued leaf. A write is
   valid iff some owner claims the tree and branch, the rest exists in its declared default shape, and the value's
   type matches the declared default's. Fixed segment counting is the anti-pattern it replaced: it can't follow
   nested owners and rejects nothing semantic. The declared shape doubles as the settings inventory ("what can I set"
   is derivable, never hand-listed). Keep this layer distinct from live operational data. One exception, where a
   nested owner can be switched on and off: its whole key may be written (`null` off, an object on).
8. **Defaults are portable constants.** A committed default must be valid in every
   deployment space; anything space-varying (public origins, credentials, endpoints)
   defaults to an environment *reference* the space supplies, and each space's
   deploy file defines its values. A stored setting may override any default — an
   explicit operator choice; but a *garbage* value never silently becomes a default
   (default only on absence, fail loudly on nonsense).

9. **One typed config, injected — never an ambient read.** Configuration reaches code as ONE typed
   object built at the composition root and injected (`config: Config`); below the root nothing reads a
   module-level accessor or looks a setting up by a path string (`config("platform.ui.publicUrl")`). A branch
   that only holds settings is a **section** of that object — one schema with its defaults and
   transforms, one file per section, the folder the registry, read as typed properties
   (`config.platform.ui.publicUrl`) — never a service that exists to hold them. A unit with behaviour
   declares its own branch as one schema on its class, beside the behaviour it configures; one class
   registered twice keeps its per-instance defaults in its registration, judged by the same schema.
10. **A leaf is an independent unit; its keys are optional.** A setting the system relies on is a **leaf**: it
   stands alone, needs no sibling to mean something, and is always present — its default guarantees it, even as an
   empty object. Inside an object-valued leaf the **keys** are optional: one may be present, `null` (switched off) or
   missing, and the system still works on what the leaf holds (`providers: {}` offers none). So a reader reads the
   leaf, never assumes a key, and a write that removes a key never leaves a reader without its leaf.
11. **A leaf is named after what it holds.** A leaf gathering several same-kind owners takes their kind's name —
   the name their code's folder already carries (`providers`, not `services`) — never a generic container word, so
   a path reads as what it configures.
12. **One active choice is one leaf; its `type` picks, every key stays.** Where exactly one of several backends is
   in use, the setting is one leaf whose `type` names the backend ([pluggable-backends](pluggable-backends.md)
   rule 1) beside the keys the backends declare; each backend reads the keys it needs and ignores the rest, and a
   change of `type` keeps every key — switching back loses nothing. Several backends on at once are a leaf of
   keys, one per backend, each switchable (rule 10).

**Tolerated exceptions:** presentation concerns (TTY detection, `NO_COLOR`) may read
the environment directly at the presentation site — they are output formatting, not
configuration; and a build-time config file (`next.config.ts`) may read a deploy-time param it needs before the
module graph exists. Neither is a configuration read, and neither is a runtime one.

## Additional shared rules

13. **Derive, don't duplicate.** A value that follows from another setting is derived from it, never a
    second switch that can disagree: a session cookie is `Secure` exactly when the public origin is `https:`.
14. **Time limits: one mechanism per concern.** A long-running unit declares its own lifetime as a
    constant, not as a per-call setting two callers can read differently; separate settings bound each
    finer concern (one external call, one model completion, an attempt budget). A timeout is a first-class
    outcome, recorded as such — never disguised as an empty result.

**Tolerated exceptions.** Presentation concerns (TTY detection, `NO_COLOR`) may read the environment at the
presentation site, and a build-time tool config file may read a deploy-time value it needs before the
module graph exists. Neither is a runtime configuration read.
