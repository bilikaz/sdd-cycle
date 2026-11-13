# Consolidation

**Rule.** Extract shared code only when the copies must stay identical for correctness, or when nearly every
site shares a stable concept; otherwise leave the copies with their owners. Code that began as a copy is the
exception that proves it: it is extracted the moment the second consumer appears, never pasted. One truth shown
and executed renders from one function, and a variant of an existing method extends that method instead of
standing beside it.

## Rules

1. **Essential duplication is extracted.** Copies that must stay in sync for correctness — where divergence is a
   bug, not an evolution — share one implementation: a log scope's join format every sink must produce, a
   predicate three call sites must agree on, a message envelope two stages must emit identically.
2. **Universal sharing is extracted.** A concept that all sites share (or all but justified exceptions), and
   that is stable, gets one home.
3. **Incidental duplication stays.** Code that looks alike today only because both copies are simple, with no
   requirement to stay alike, is not coupled. Two HTTP clients that differ only in an auth header owe each other
   nothing: pagination, rate limits and token refresh will diverge per service. A deliberately kept copy carries
   a comment at the site saying so, so a later cleanup does not re-couple it.
4. **Copy-paste is not a reuse strategy.** When a new consumer needs a *trunk* an existing implementation owns —
   the ordered steps that must evolve together (resolve → derive → adapt → call; validate → transform → persist)
   — the trunk is extracted **in the same change that adds the second consumer**, and the new consumer is built
   on it. Code that began as a copy is essential duplication by construction; rule 3 covers independently
   written code that merely converged, never a paste.
5. **Only the must-stay-identical steps move into the trunk.** Consumer-shaped work — argument validation, input
   assembly, naming, result text — stays with each consumer. A trunk that absorbs its consumers' schemas has
   overshot into option flags.
6. **What is shown renders from what runs.** Anything shown as "what the system does" — a prompt preview, a
   permissions view, a status badge — renders from the same function the system executes, never from a parallel
   reconstruction with its own inputs. A display that needs a variant passes a parameter to that function.
7. **A past execution is captured, not recomposed.** Where a display must show exactly what ran, the value is
   captured at the call site and the capture is rendered; recomposing is only the explicit "what it would be
   now" view.
8. **Extend the method that exists.** A variant of what a method already does is that method extended — a
   parameter, an option, a richer result — never a sibling (`createUser` returns an invitation token when called
   without a password; there is no `createInvitedUser`). A genuinely different operation — a different trunk,
   not a variant — is its own method, its name saying the difference.

## Why

A helper extracted from a minority of look-alike sites has two futures once one consumer changes: it grows an
option flag per variant, or the consumer forks away and leaves a "shared" module with one user. Both are worse
than the duplicated lines. The opposite failure is the paste: a copied trunk drifts at the first unrelated
commit — a fix or a parameter lands in one copy and silently not the other — and nothing pulls the copies back
together. The one cheap moment to extract is when the second consumer is born, while both call sites are known
and still identical. Two compositions of one displayed truth drift the same way, and the display always loses;
with one composer, a new part shows up in both places or in neither. Sibling methods multiply and drift, and a
reader no longer knows which one is the real one.

## How to apply

- Before extracting, ask: *must* these stay identical, or do they merely *happen* to be identical? Only the first
  justifies coupling. A third consumer with the same needs is the moment to re-ask — the count alone decides
  nothing.
- Types follow the same logic: shared by many is promoted, used by one stays local
  ([types-placement](types-placement.md)).
- Adding the second consumer of a nontrivial sequence: the extraction is part of that change. A
  `// TODO: unify later` on a pasted body is the failure, not a mitigation. In review, a diff that pastes a
  contiguous body from another module is a missing extraction, and the burden of proof is on keeping the copy.
- Extract the composition, not just its ingredients:

```ts
// one composer; the executor and the preview both call it
export function composeSystemPrompt(input: PromptInput): string {
  return [basePrompt(input), ...capabilityBlocks(input.capabilities)].join("\n\n");
}

const prompt = composeSystemPrompt(input); // executed
await model.run(prompt);
preview.render(composeSystemPrompt(input)); // shown — never rebuilt from basePrompt alone
```

- A caller that needs a method to do a little more adds the parameter or the result field to it:

```ts
// not: createInvitedUser(email)
async createUser(params: { email: string; password?: string }): Promise<{ user: User; inviteToken?: string }> {
  // ...
}
```
