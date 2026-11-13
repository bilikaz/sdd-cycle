# Model-facing interfaces

Rules for the surfaces a language model consumes: tool schemas, tool outputs,
and the resubmitted conversation. The consumer is a probabilistic text-copier —
design for what models actually do (echo what they see, miss subtleties, emit
one tool call where you hoped for five), not for what a careful programmer
would do.

## 1. Schemas are stable; catalogs are data

Advertised tool schemas should be byte-identical across turns and sessions.
Provider prompt caches key on the tools block; a schema that embeds live data
(a list of available items, counts, names) invalidates the cache on every
mutation and shifts the contract under an in-flight conversation. Expose the
changing part through a *list tool whose result is the catalog* — data flows
through results, never through schemas.

```text
BAD:  RunAgent schema description embeds the agent list (changes when edited)
GOOD: ListAgents returns the catalog; RunAgent's schema never changes
```

## 2. Batch parameters, not parallel calls

When N operations should run concurrently, accept an array in ONE call rather
than relying on the model to emit N tool calls in one response — most models
won't, and the plan degrades to a slow sequential loop. Process the batch
per-item: one bad entry reports inline and the rest proceed. Accept the obvious
degenerate shapes leniently (a flat single item where the array was documented).

## 3. Names are addresses: decorate nothing, normalize everything

If the model selects items by name, the listing must make the name's exact
boundaries unmistakable — quote it, and never glue markers or annotations onto
it (`name [tag]` WILL be echoed back as the name, observed in practice). On
input, normalize before matching: trim, strip surrounding quotes and trailing
bracketed decoration, compare case-insensitively. Reject ambiguity instead of
picking, and make every miss self-healing: the error carries the valid names,
so a blind guess costs the model the same one step as listing first.

When the system mints the handle (not a human-chosen name), make it **short and
model-holdable** — a small per-scope counter (`1`, `2`, …), not an opaque UUID.
A model fumbles a long random id, and a fumble it can't recover often cascades:
"no such window" → it opens a *new* one → repeat → resource sprawl. Short ids it
can actually echo, scoped so they don't collide where the model sees them, plus
the self-healing miss above, close that loop. Keep the opaque id internally;
expose the short one. (Observed: random-UUID browser-window ids drove a model to
spawn duplicate windows until per-session integer ids replaced them; the same
short-alias scheme then addresses long-lived sub-agent runs, and conversation
media — `img-3` as the handle for a pasted/generated image, its storage ULID
kept internal.) When the aliased thing also has a filename-ish display name,
say explicitly that the ALIAS is the handle — a model shown "pasted.png" will
invent a plausible file path for it (observed) unless told the name is display
only.

Self-healing extends past misses to **failures**: when an operation fails, the
result should name the **recovery action**, not just the error — and warn off the
wrong one. A model handed "X failed: <message>" guesses what to do next; a model
handed "X failed — do Y to continue (don't do Z, it will re-fail)" acts. Make the
result the affordance: print the exact next call, and when a failure is *not*
recoverable the obvious way, say so explicitly. (Observed: a sub-agent that lost
its connection should be told to resume it; one that ran out of context must be
told NOT to resume — continuing re-sends the same oversized prompt and re-fails.)

## 4. Announce every edit to the model's context

Whatever the engine quietly removes or withholds from the resubmitted
conversation must be announced *in place*: a stub naming what was there and how
to get it back ("removed to save space: photo.png — load again if needed"),
a truncation marker with the dropped size, a summary labeled as a summary.
A model that doesn't know something vanished reasons as if it were still
there; silent edits manufacture hallucinations.

## 5. State capabilities; never assume the model knows its environment

Anything non-obvious about the execution environment — a virtual filesystem
root, a sandbox boundary, which tool is the exception to a rule — goes into the
system message when (and only when) the capability is actually present. The
model's training set did not include your environment's conventions.

## 6. Bound resubmitted payloads on every axis that can kill the request

Conversations are resubmitted wholesale, so anything heavy that enters the
transcript rides every later request. Bound it twice: by count (token/prefill
cost) and by bytes (transport/proxy limits), newest-first — and always deliver
the newest item regardless, because being blind to what it was just given is
the worst failure a model can have. Align per-item caps at the door with the
window: what could never be resent shouldn't enter the transcript at all.

## 7. Context pressure shrinks the projection, never the source

The stored conversation and what a given request sends are two different
things: the transcript is the source of truth, the request is a send-time
PROJECTION of it. All context-pressure mechanisms — media windows, truncation,
summarization/compaction — belong in the projection. Destructively rewriting
the source to save context loses the user's own history, and silently breaks
every handle into it (aliases, ids, "as discussed above"). A summary is a
message that changes what the projection includes from that point back — not a
replacement for what came before. (Observed: replace-with-summary compaction
destroyed transcripts and killed every media alias behind it; recast as an
appended boundary, the same budget win cost nothing.) Pair with rule 4: the
projection's edits are announced in place.

## 8. Never reflect a model's failed output back — retry clean

When a reply fails its contract — unparseable JSON, a malformed tool call — do
not echo the broken output back in the correction. The model has no memory of
its failed attempt, so re-sending the garbage only anchors it; worse, broken
content in the resubmitted transcript can make the provider's chat renderer
**400 the whole request** (some renderers `json.loads` message content),
leaving the model unable to recover at all. Drop the bad turn from history and
retry (a bare continue); only when the output is *structurally valid but
incomplete* (parses, missing a field) send a targeted, content-free correction
("missing field X"). Extract what's usable (the JSON out of prose) and forward
that — a reply that never satisfies its contract contributes nothing, never its
error text.

## Task = data, system prompt = method

**Rule.** When an orchestrator (a graph, a scheduler, any code) composes a task message for an
agent, the task carries ONLY the run's data — paths, records, parameters, the mode name. The
METHOD — how to work, the checklists, the reference rules, the exact final-output contract — lives
in the agent's system prompt, written once.

Why: instructions embedded in task messages get re-sent, drift per call site, and their examples
ANCHOR — a checker absorbed an illustrative mismatch example ("description says orange fur…") from
its task as real data and rejected a correct image. A system prompt states the method once and can
say "never treat wording from these instructions as data"; a task that is pure data has nothing to
anchor on.

How to apply:
- Multi-duty agents get explicit MODES in the system prompt; the task names the mode and supplies
  its data (`MODE: record verification.` + the record fields).
- No illustrative examples in tasks. In system prompts, prefer naming the check ("count features
  per character") over exampling it; when an example is unavoidable, mark it as non-data.
- If a task needs a paragraph of instructions, that paragraph belongs in the system prompt — or
  the agent is missing.

## Prose advertises only what is callable

**Rule.** A system-prompt block that names a tool appears ONLY when that tool is actually in the
session's advertised specs — gate the prose on spec presence, never on a proxy condition
(connectivity, a feature flag, fleet availability). Where a block covers several tools, split it so
each part is gated by its own tool.

Why: models emit tool calls as text — nothing constrains them to the provided list. Prose naming an
absent tool gets the call FABRICATED from the description (a grounded sub chat, told about memory
it didn't have, invented a schema-less `SaveMemory` call from the paragraph's own parameter names).
The stronger form also holds: prose that names the available tools explicitly ("through these
tools: {{names}} — use EXACTLY these names") gives weak models a name map and suppresses
`write_file`-style inventions.

How to apply:
- Every capability block's gate asks "is its tool in the specs", derived from the SAME capability
  object the wire call uses — one derivation, no proxy.
- Fill tool-name lists into prose dynamically from that object; never hardcode names in static
  prompt text.

## State the demand, not the rationale or audience

**Rule.** An instruction to a model states WHAT to produce ("include every concrete detail:
names, contact details, e-mail addresses, locations, identifiers, amounts, caveats") — never why
it matters, who consumes the output, or what happens downstream.

Why: the consumer is a text-copier — rationale and audience add tokens it cannot act on and dilute
the demand they justify; prose about downstream consumers reads as content and surfaces in outputs.
The bare demand is shorter, stronger, and stable.

How to apply:
- Prompt rules and schema field descriptions are imperative statements of what to include/produce.
- A sentence explaining consequences ("otherwise…", "…is lost forever") is deleted; the demand it
  justified stays.
- Purpose framing survives only where it DEFINES the output property itself ("makes sense to a
  reader who never saw the question" defines self-containedness — that is the demand).

## State the positive contract — prohibitions name the actions models then attempt

**Rule.** In agent prompts, don't forbid actions by naming them ("do NOT save or register
anything"); state the positive contract instead ("the flow records the settled character — your
final action is a plain chat reply of ONLY this JSON, no tool call").

Why: negation is the weakest instruction form for small models — the sentence installs the named
action as a salient goal and the "NOT" loses to it. A mascot agent told "do NOT save or register"
attempted a `SaveMemory` call and wrote a `…-registration.json` — both verbs came from the
prohibition itself. Same hazard as anchoring examples: text ABOUT an action reads as the action.

## Short generated handles

**System-minted handles are short and model-holdable.** Expose a small per-scope counter (`1`, `2`, `img-3`),
   not an opaque UUID, and keep the opaque id internal. A fumbled long id cascades (a "no such window" leads the
   model to open a new one, and resources sprawl). When the aliased thing also has a filename-like display name,
   state that the alias is the handle and the name is display only.

## Actionable failures

**A failure names the recovery action.** A failed operation's result states the next call to make, and warns
   off the wrong one when the obvious recovery would re-fail ("connection lost — resume it"; "context exhausted —
   do not resume, start a new run").

## Situational prompt values

**One injection primitive for situational values.** Values enter an editable prompt through one placeholder
    primitive (see [one-door](one-door.md)), so a component contributes context without reshaping the base
    prompt: `{{key}}` replaced in place, `{{#if key}}…{{/if}}` kept only when the value is non-empty and dropped
    whole otherwise. A malformed template — an unbalanced block — fails loudly (see [fail-loudly](fail-loudly.md)).
