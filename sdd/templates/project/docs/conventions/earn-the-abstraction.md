# Earn the abstraction

**Rule.** Build a generic contract when a second consumer already exists, or is concretely expected soon and you
know roughly what it will need. Do not build one for a hypothetical "someday" consumer whose needs you would be
guessing — and do not cut a genuine abstraction down to one case just because only the first consumer has landed.
The trigger is how clearly you can see the second consumer, not whether it physically exists yet.

## Rules

1. **Match the seam to how clearly you can see the second consumer.**
   - **Known or imminent, shape roughly understood** — a second implementation exists, or is planned near-term
     and you can name what it needs → abstract now. A small clean seam beats retrofitting one under a consumer
     that is already arriving.
   - **Hypothetical, shape unknown** — you cannot name the consumer, or you are inventing its requirements →
     stay concrete and note where the seam would go. A contract fitted to a guessed consumer is wrong for the
     real one when it lands.
2. **Every member of a shared contract has a reader.** Even when the seam is earned, it carries only what some
   consumer reads now. A flag never exercised — a capability the only consumer reading it can never see
   `false` — is dead weight; delete it ([no-dead-code](no-dead-code.md)).
3. **No parallel read-surface for one backend.** When work already flows through an injected object, do not add a
   second narrow interface over the same backend "to keep it abstract". One access path per capability; the
   consumer holds the object and calls it.
4. **Don't restate what a declaration already says.** A fallback or override flag that repeats what a declared
   list or type already holds is a second source of truth that drifts; derive the behaviour from the declaration.
5. **A concern only one consumer has stays on that consumer.** It moves onto the shared contract — carried and
   injected there ([capability-injection](capability-injection.md)) — only once it genuinely varies across
   consumers you can see.
6. **No one-caller pass-through.** A function, factory or params object with a single caller that only forwards
   to another call — an object built to be handed straight on — is inlined at its caller. A step earns its own
   name when it is reused or hides real logic; packaging arguments is neither. A test is not a second caller: it
   reaches the code through its real caller, handing in a stand-in where it needs one, never through a wrapper
   kept so the test can call it.

## Why

There are two failure modes, and the skill is telling which one you are in. Abstracting for an imagined consumer
ships dead code the day it is written and leaks the guessed consumer's assumptions into the generic layer, so the
cost is paid twice: carrying the unused surface, then tearing it out when the real consumer differs. Cutting too
hard costs too: refusing a seam whose second consumer is close and known forces a retrofit later, under pressure,
touching the first consumer again. The honest generalization comes from the difference between consumers you can
see.

## How to apply

- Ask first: is there a second consumer I can name or see coming soon, and do I know roughly what it needs? Yes →
  build the seam, carrying only what the visible consumers read. No → build concrete and leave a note.
- When you abstract, lift only the members the visible consumers read; each keeps its own extras. Do not pad the
  contract for an imagined third.
- "We might need it someday" is a note, not a field.

```ts
// not: a single-caller wrapper that only repackages arguments
function buildSendParams(user: User, body: string): SendParams {
  return { to: user.email, body };
}
await mailer.send(buildSendParams(user, body));

// inlined at its one caller
await mailer.send({ to: user.email, body });
```
