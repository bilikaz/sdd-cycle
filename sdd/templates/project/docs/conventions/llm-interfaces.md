# Model-facing interfaces

**Rule.** Design the surfaces a language model consumes — tool schemas, tool outputs, prompts and the resubmitted
conversation — for what models actually do: echo what they see, miss subtleties, emit one tool call where you
hoped for five, and act on whatever text names an action. Schemas stay stable and data flows through results;
names are exact and short; every failure and every context edit says what to do next; prompts carry the method
once, state positive demands, and advertise only what is callable.

## Rules

1. **Schemas are stable; catalogs are data.** Advertised tool schemas are byte-identical across turns and
   sessions. A schema that embeds live data (a list of items, counts, names) invalidates the provider's prompt
   cache on every change and shifts the contract under an in-flight conversation. Expose the changing part through
   a list tool whose result is the catalog.
2. **Batch parameters, not parallel calls.** When N operations should run concurrently, accept an array in one
   call rather than relying on the model to emit N calls in one response. Process the batch per item: one bad
   entry reports inline and the rest proceed (see [error-handling](error-handling.md)). Accept the obvious
   degenerate shape leniently (a single item where an array was documented).
3. **Names are addresses: decorate nothing, normalize everything.** When the model selects items by name, the
   listing makes each name's boundaries unmistakable — quote it, and never glue markers onto it (`name [tag]` will
   be echoed back as the name). On input, normalize before matching: trim, strip surrounding quotes and trailing
   bracketed decoration, compare case-insensitively. Reject ambiguity instead of picking, and make every miss
   self-healing: the error carries the valid names.
4. **System-minted handles are short and model-holdable.** Expose a small per-scope counter (`1`, `2`, `img-3`),
   not an opaque UUID, and keep the opaque id internal. A fumbled long id cascades (a "no such window" leads the
   model to open a new one, and resources sprawl). When the aliased thing also has a filename-like display name,
   state that the alias is the handle and the name is display only.
5. **A failure names the recovery action.** A failed operation's result states the next call to make, and warns
   off the wrong one when the obvious recovery would re-fail ("connection lost — resume it"; "context exhausted —
   do not resume, start a new run").
6. **Announce every edit to the model's context.** Whatever the engine removes or withholds from the resubmitted
   conversation is announced in place: a stub naming what was there and how to get it back, a truncation marker
   with the dropped size, a summary labeled as a summary. A model that does not know something vanished reasons
   as if it were still there.
7. **State capabilities; never assume the model knows its environment.** Anything non-obvious about the execution
   environment — a virtual filesystem root, a sandbox boundary, which tool is the exception to a rule — goes into
   the system message when, and only when, the capability is present.
8. **Bound resubmitted payloads on every axis that can kill the request.** Anything heavy in the transcript rides
   every later request. Bound it by count (token cost) and by bytes (transport and proxy limits), newest first,
   and always deliver the newest item. Align per-item caps at the door with the window: what could never be
   resent does not enter the transcript.
9. **Context pressure shrinks the projection, never the source.** The stored conversation is the source of
   truth; a request sends a projection of it. Media windows, truncation and summarization belong in the
   projection. Rewriting the source loses the user's history and breaks every handle into it. A summary is an
   appended boundary that changes what the projection includes from that point back, not a replacement; its
   edits are announced per rule 6.
10. **Reflect a nameable near-miss; drop only garbage.** When a reply fails its contract, heal by whether the
    output is safe to re-send. Garbage — unparseable JSON, a tool call with invalid JSON arguments — is never
    reflected: drop the turn from the wire and retry with a content-free correction (a bare continue), because
    broken content can make the provider reject the whole request and anchors the model on its mess. A nameable
    near-miss — prose with the answer unwrapped, valid JSON with wrong or missing fields — is reflected: keep it on
    the wire and send a targeted correction ("return that as JSON", "fix field X"). Extract what is usable first
    (the JSON out of prose). A tool call that ran and errored is not a heal: feed its error result back. A reply
    that never satisfies its contract contributes nothing downstream, never its error text.
11. **Task = data, system prompt = method.** A task message composed by code carries only the run's data — paths,
    records, parameters, the mode name. The method — how to work, checklists, reference rules, the output
    contract — lives once in the agent's system prompt. Multi-duty agents get explicit modes in the system prompt;
    the task names the mode. Tasks carry no illustrative examples; in a system prompt, name the check rather than
    exampling it, and mark an unavoidable example as non-data.
12. **Prose advertises only what is callable.** A system-prompt block that names a tool appears only when that
    tool is in the session's advertised specs — gated on spec presence, derived from the same capability object
    the wire call uses, never on a proxy (connectivity, a feature flag). Split a block covering several tools so
    each part is gated by its own tool. Fill tool-name lists into prose dynamically ("use exactly these names:
    …"); never hardcode them.
13. **State the demand, not the rationale or audience.** An instruction states what to produce ("include every
    concrete detail: names, identifiers, amounts, caveats") — never why it matters, who consumes the output or
    what happens downstream. Purpose framing survives only where it defines the output property itself.
14. **State the positive contract; a prohibition names the action.** Don't forbid by naming ("do NOT save
    anything"); state what the final action is ("your final action is a plain reply containing only this JSON, no
    tool call"). The named action becomes a salient goal and the negation loses to it.
15. **One injection primitive for situational values.** Values enter an editable prompt through one placeholder
    primitive (see [one-door](one-door.md)), so a component contributes context without reshaping the base
    prompt: `{{key}}` replaced in place, `{{#if key}}…{{/if}}` kept only when the value is non-empty and dropped
    whole otherwise. A malformed template — an unbalanced block — fails loudly (see [fail-loudly](fail-loudly.md)).

## Why

The consumer is a probabilistic text-copier. It echoes decorations as names, fumbles long ids, guesses after a
bare error, reasons over context it does not know was removed, and fabricates calls to tools that prose merely
mentions — models emit tool calls as text, and nothing constrains them to the advertised list. Text about an
action, whether a prohibition, an illustrative example in a task or a rationale, reads as content and leaks into
output. Stable schemas and an append-only source keep caches warm and handles valid; a bounded projection keeps
every request deliverable.

## How to apply

```ts
// Rule 1: the catalog is a result, the schema never changes.
const listAgents = tool({ name: "ListAgents", input: z.object({}), run: () => agents.list() });
const runAgent = tool({
  name: "RunAgent",
  input: z.object({ runs: z.array(z.object({ agent: z.string(), task: z.string() })) }), // rule 2
  run: ({ runs }) => Promise.all(runs.map((r) => runOne(r).catch((e) => ({ agent: r.agent, error: String(e) })))),
});

// Rule 3: normalize, reject ambiguity, self-heal the miss.
function resolveAgent(raw: string): Agent {
  const name = raw.trim().replace(/^["']|["']$/g, "").replace(/\s*\[.*\]$/, "").toLowerCase();
  const hits = agents.all().filter((a) => a.name.toLowerCase() === name);
  if (hits.length === 1) return hits[0];
  const valid = agents.all().map((a) => `"${a.name}"`).join(", ");
  throw new ToolError(hits.length ? `"${raw}" is ambiguous` : `no agent "${raw}"; valid names: ${valid}`);
}

// Rule 12: prose gated on the same capability object the wire uses.
const tools = capabilities.toolsFor(session);
const memoryBlock = tools.has("SaveMemory") ? renderMemoryBlock([...tools.names()]) : "";
```

- Review every tool schema for embedded live data, every listing for decorated names, every error for a missing
  recovery action.
- A prompt block naming a tool without a spec-presence gate, a prohibition naming an action, or an example inside
  a task message is a finding.
- Context-pressure code that writes to the stored conversation is a finding.
