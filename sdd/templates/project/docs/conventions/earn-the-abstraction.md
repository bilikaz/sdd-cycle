# Earn the abstraction: generalize for consumers you can see, not for someday

**Rule.** Build a generic contract when a second consumer already exists — or is
concretely expected soon and you know roughly what it will need. Do **not** build one for
a hypothetical "maybe someday" consumer whose needs you would only be guessing; and
equally, do not over-cut a genuine abstraction down to one case just because only the
first consumer has landed yet. The trigger is the **visibility and confidence** of the
second consumer, not its physical existence.

## Rules

1. **Match the seam to how clearly you can see the second consumer.** Two honest cases:
   - **Known or imminent, shape roughly understood** — a second implementation exists, or
     is planned near-term and you can name what it needs → abstract now. A small clean
     seam beats retrofitting one under a consumer that's already arriving.
   - **Hypothetical / "someday" / shape unknown** — you can't name the consumer or you're
     inventing its requirements → stay concrete and note the seam. A contract grown to fit
     a guessed-at consumer bakes in the wrong assumptions and is wrong for the real one
     when it lands. This is a judgment call — make it honestly, not as a reflex either way.
2. **Every field on a shared contract has a reader.** Even when the abstraction is
   justified, carry only members some consumer reads *now*. A flag that is never exercised
   (e.g. a capability the only consumer that reads it can never see `false`) is dead weight
   whether or not the seam itself is earned — delete it.
3. **No parallel read-surface for one backend.** When work already flows through an
   injected object, don't introduce a second narrow interface over the same backend "to
   keep it abstract." One access path per capability; the consumer holds the concrete
   thing and calls it directly.
4. **Don't restate what a declaration already says.** A fallback/override flag that
   duplicates information already present in a declared list or type is a second source of
   truth that will drift — derive the behaviour from the existing declaration.
5. **A concern only one consumer has stays on that consumer.** Hoist it onto the shared
   contract only once it genuinely varies across consumers you can actually see — not on
   the guess that it might.
6. **No one-caller pass-through.** A function, factory or params object with a single caller that only forwards
   to another call — an object built to be handed straight on — is inlined at its caller. A step earns its own
   name when it is reused or hides real logic; packaging arguments is neither. A test does not count as a second
   caller: a test reaches the code through its real caller (a worker class's method, a service's method), handing
   in a stand-in where it needs one, never through a wrapper kept only so the test can call it.

## Why

There are two failure modes and the skill is telling which one you're in. Abstracting for
a consumer you're only imagining ships dead code the moment it's written and *leaks* the
guessed-at consumer's assumptions into the generic layer — so the abstraction is wrong for
the real second consumer when it finally arrives, and the cost is paid twice: carrying the
unused surface, then tearing it out. But cutting an abstraction too hard is also a cost: if
a second consumer is genuinely close and its shape is known, refusing the seam now forces a
disruptive retrofit later, under time pressure, touching the first consumer again. The
honest generalization comes from the *diff* between the consumers you can see — so the
question is always "can I actually see the second one, or am I inventing it?" When you can
see it, generalize from what it and the first both read; when you're inventing it, wait.

## How to apply

- Ask first: **is there a second consumer I can name or see coming soon, and do I know
  roughly what it needs?** Yes → build the seam now, carrying only what the visible
  consumers read. No / guessing → build concrete, leave a note where the seam would go.
- When you do abstract, lift only the members the consumers you can see actually read; let
  each keep its own extras. Don't pad the contract for the imagined third.
- Don't over-cut: if more consumers are genuinely imminent, a small clean seam now is
  cheaper than a retrofit under a live second consumer.
- Treat "we might need it someday" as a note, not a field. Someday is when it earns the
  line; soon-and-known is when the seam does.
- A concern that genuinely varies across the consumers you can see is carried on the shared
  contract and injected; one only a single consumer has stays on that consumer.
