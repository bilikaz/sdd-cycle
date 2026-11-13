# Fail loudly

**Rule.** A path that cannot know the answer refuses; it never substitutes a plausible one. A guard that cannot
see its subject fails rather than passes.

## Rules

1. **An unreachable-by-construction path throws and names the invariant.** A function that only ever receives
   values of one shape throws on anything else, rather than returning a result it would have to invent.
2. **A value the code was given is parsed or refused, never defaulted.** A malformed option is answered with the
   shape it expects, not silently replaced by a default — not by the current time, not by `0`, not by `""`.
3. **A check proves its subject exists before it reads it.** A scan of a directory that is not there finds no
   hits; a check over an empty table finds every row clean. The check refuses when its subject is missing.
4. **A check fails closed on its own error.** A tool that reports "nothing found" and "could not read" through
   the same signal is read so that the read failure is fatal, never taken as a pass.
5. **An emptiness claim proves its set was populated.** An assertion that a set is empty is green whether the
   rule held or the data was never there. Where a test populates its own data, the proof belongs in that setup;
   where a fixture already did, a companion assertion carries it.
6. **The exceptional path is entered only on its trigger.** An escape hatch taken pre-emptively hides whether the
   ordinary path would have failed — a substituted answer of its own. The ordinary path runs first; the fallback
   runs only on the failure it exists for.
7. **What this does not license:**
   - **It does not forbid containing a failure.** A boundary that must not break its caller — a log or metrics
     write — catches, logs and continues ([logging](logging.md)). The rule is against substituting a *value* for
     a failure, not against isolating one.
   - **It is not a licence to throw where the contract wants a result.** A refusal the caller is told about in
     the response is a result; whether it travels as an error or a value is the contract's decision.
   - **It does not demand a guard on every read.** The rule binds where the guard's subject is the claim being
     made — a residue check, an emptiness assertion. A test comparing two values needs no such guard.

## Why

A substituted value is indistinguishable from a correct one where it is consumed. A response that pins a detail
it had to guess tells the consumer something false on a field it is entitled to act on — worse than telling it
nothing. A guard that cannot see its subject is the same failure wearing safety: the code reports success for
work it did not do, and that report is the only evidence there is.

## How to apply

```ts
// rule 1: name the invariant, don't invent a result
function statusOf(failure: AppFailure): number {
  if (!isPublishedFailure(failure)) {
    throw new Error(`Failure ${failure.name} reached the published-failure renderer without a code.`);
  }
  return failure.status;
}
```

```ts
// rule 2: parse or refuse — never `new Date(raw ?? Date.now())`
function parseSince(raw: string): Date {
  const since = new Date(raw);
  if (Number.isNaN(since.getTime())) {
    throw new Error(`Option --since "${raw}" is not an ISO-8601 date-time.`);
  }
  return since;
}
```

```ts
// rules 3 and 5: the check proves its subject before trusting an empty result
const files = await readdir(sourceDir); // throws when the directory is missing — no silent "no hits"
expect(files.length).toBeGreaterThan(0);
expect(files.filter(usesForbiddenImport)).toEqual([]);
```
