# Realistic failures

**Rule.** Design, test and review for the failures ordinary operation reaches. A scenario that needs an unlikely
coincidence is not validated and not acted against: it gets no code, no test, and a review does not raise it.
Taking the data already stored as valid, no natural use of the system may lead it into an inconsistent state.

## Rules

1. **The test is reach.** Would ordinary use, an ordinary retry, a routine restart or normal timing between two
   independent actors reach the scenario? Then it is real — handle it. Does it need a crash timed to the instant
   between two lines, several independent faults lining up, a call hanging to its timeout exactly while another
   run fills the window, or an interleaving only a deploy or a lost write could produce? Then it is not.
2. **Weigh it against the code's own odds.** A guard is code with its own chance of being wrong. A scenario less
   likely than a defect in the code that would handle it is not worth that code. A defect in what is built is
   ordinary; it is what the gates and reviews exist for.
3. **Real timing is not a coincidence.** Concurrent actors meet in every order the platform allows — an event
   sent before a listener registers, two workers claiming from one queue, a retry after a step failed, a row
   changed by a request while a worker holds its earlier read. Those are reached by normal operation and handled.
4. **No code for the unrealistic case.** No guard, lock, recovery path, reconciliation job or test whose only
   reason is such a scenario; it is dead weight that still has to be read, kept and reviewed
   ([no-dead-code](no-dead-code.md)).
5. **Input that fails loudly needs no guard.** A typo, a malformed cron, a wrong API key fails on first use, at
   once and visibly — an error, a refused registration, a 401. That failure is the guard; no validator or test is
   written for it. A guard exists only where wrong input would be accepted and fail silently — an unlisted
   default that never applies, a value that quietly does the opposite of its intent
   ([error-handling](error-handling.md) rule 4).
6. **What fails safe needs no guard.** A scenario whose worst outcome is a stale or leftover record that the next
   ordinary run replaces, or that a read already filters out, is accepted as it is — the next run is its recovery.
7. **Every write path leaves a valid state valid.** Taking what is stored as valid, an edit, a recalculation, a
   transition, a scheduled run or an ingestion never walks the system into an inconsistent state. What is derived
   changes with what it derives from, in the same write.
8. **Consistency is judged against the system as planned.** Where the missing piece of a guard belongs to a
   feature not yet built, and a settled plan assigns it there, the gap is that feature's to close — not a defect
   of the change that leaves it open.
9. **Failure scenarios do not invent delivery guarantees.** An operation follows its settled durable or
   fire-and-forget contract ([durable-execution](durable-execution.md)). An unavailable dependency alone does not
   justify retries, delivery tracking or recovery for an operation allowed to end without delivery.
10. **Two people's console actions are no race to design for.** Two admins acting on the same rows in the same
    moment are not locked, retried or tested for; the rare loser takes whatever error the store raises, and
    correctness for one person acting is the bar. The races that are designed for — auth and security writes,
    workers, jobs and sweeps, anything gained by racing on purpose — are designed for their realistic reach under
    rule 1, not every interleaving.
11. **A review names the reach or drops the finding.** A finding states how ordinary operation reaches its
    scenario. One that rests on an unrealistic coincidence is not a finding: the reviewer leaves it out, a
    verifier voids it, and whoever disposes of it rejects it citing this rule.
12. **Accepting a risk is a decision, recorded once.** When a scenario is judged unrealistic in a design
    discussion, one line says so where the design lives — the task record or a comment at the site
    ([source-comments](source-comments.md)) — never a mechanism.

## Why

Every handled failure path costs code, tests and review time, and makes the normal path harder to read. Reviews
that hunt for interleavings without asking how they are reached keep finding narrower ones, and each fix opens a
further window to probe: the design grows a recovery for its recovery while the failures users meet stay the
same. A state ordinary use can walk into, by contrast, will be walked into — in production, where the data is
then worth keeping. Spending the effort on what operation actually reaches keeps the system small enough to be
correct where it matters.

## How to apply

| Scenario | Verdict |
|---|---|
| A cancel arrives while a worker is mid-step | Handled — ordinary timing |
| A wake-up is sent before the waiting side starts listening | Handled — ordinary timing |
| A step is retried after a transient error | Handled — ordinary retry |
| A request changes a row a worker read a moment earlier | Handled — ordinary concurrency |
| A process restarted mid-run leaves work its next run must pick up | Handled — routine restart |
| The process dies in the exact instant between committing a row and sending the event after it | Not handled — coincidence; one line records it |
| A request is mid-wait during a deploy and gets a reply just before the cleanup job closes it | Not handled — coincidence |
| A cleanup call hangs to its timeout exactly while another run rewrites what it cleans | Not handled — coincidence |
| Two admins save the same row in the same moment | Not handled — rule 10 |
| An operator mistypes a cron, an id or an API key | Not guarded — its first use fails loudly (rule 5) |
| A config map loses its `*` default, so unlisted entries silently never expire | Guarded — fails silently (rule 5) |

```ts
// rule 7: the derived value moves with its source in one write
await store.transaction(async (tx) => {
  await tx.prices.replaceForBundle(bundleId, newPrices);
  await tx.bundles.setPricingMode(bundleId, newPricingMode);
});
```
