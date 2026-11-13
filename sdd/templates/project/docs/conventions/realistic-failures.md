# Realistic failures: handle what operation reaches, not what a coincidence could

**Rule.** Design, test and review for the failures ordinary operation reaches. A scenario that needs an unlikely
coincidence to happen is not validated and not acted against: it gets no code, no test, and a review does not
raise it as a defect.

## Rules

1. **The test is reach.** Would ordinary use, an ordinary retry, a routine restart or normal timing between two
   independent actors reach the scenario? Then it is real — handle it. Does it need a crash timed to the instant
   between two lines, several independent faults lining up, a call hanging to its timeout exactly while another
   run fills the window, or an interleaving only a deploy or a lost write could produce? Then it is not.
2. **Weigh it against the code's own odds.** A guard is code, and code written for a case has its own chance of
   being wrong. A scenario less likely than a defect in the code that would handle it is not worth that code — the
   guard's own bugs are the likelier failure. A defect in what is built is ordinary: it is what the gate and the
   reviews exist for.
3. **Real timing is not a coincidence.** Two actors that run concurrently will meet in every order the platform
   allows — an event sent before a listener registers, two workers claiming from one queue, a retry after a step
   failed, a row changed by a request while a worker holds its earlier read. Those are reached by normal
   operation, and they are handled.
4. **No code for the unrealistic case.** No guard, no lock, no recovery path, no reconciliation job and no test
   whose only reason is such a scenario. Code written for one is dead weight that still has to be read, kept and
   reviewed ([no-dead-code](no-dead-code.md)). Validation follows the same reach: what boot needs is checked,
   and what a platform or a loud first use already refuses is not ([error-handling](error-handling.md) rule 4).
5. **A review names the reach or drops the finding.** A finding states how ordinary operation reaches its
   scenario. One that rests on an unrealistic coincidence is not a finding: the reviewer leaves it out, a verifier
   voids it, and the step disposing of it rejects it citing this rule.
6. **Accepting a risk is a decision, recorded once.** When a scenario is judged unrealistic in a design
   discussion, the record says so where the design lives — one line in the task's register or the code's
   `@why`, never a mechanism.
7. **What fails safe needs no guard.** A scenario whose worst outcome is a stale or leftover record that the next
   ordinary run replaces, or that a read already filters out, is accepted as it is — the next run is its
   recovery.
8. **A person's console action is the strongest case.** Two admins' clicks meeting on the same rows are never a
   race to design for — the application transaction rules hold the detail. Races in
   auth and security writes, workers, jobs and sweeps, anything gained by racing on purpose — are designed for
   their realistic reach under this rule, not every interleaving.

## Why

Every failure path that is handled costs code, tests and review time, and makes the normal path harder to read.
Reviews that hunt for interleavings without asking how they are reached keep finding narrower ones, and each fix
opens a further window to probe: the design grows a recovery for its recovery while the failures users meet
stay the same. Spending that effort on what operation actually reaches keeps the system small enough to be
correct where it matters.

## How to apply

Handle a resource changing between a worker's read and write, a transient dependency failure within a
settled retry budget, and work left by an ordinary restart. Do not add a guard for a value whose first
use already refuses loudly, or for leftover state the normal read excludes and the next run repairs.

## Additional shared rules

9. **Every write path leaves a valid state valid.** Taking what is stored as valid, an edit, a recalculation, a
   transition, a scheduled run or an ingestion never walks the system into an inconsistent state. What is derived
   changes with what it derives from, in the same write.
10. **Consistency is judged against the system as planned.** Where the missing piece of a guard belongs to a
   feature not yet built, and a settled plan assigns it there, the gap is that feature's to close — not a defect
   of the change that leaves it open.
11. **Failure scenarios do not invent delivery guarantees.** An operation follows its settled durable or
   fire-and-forget contract ([durable-execution](durable-execution.md)). An unavailable dependency alone does not
   justify retries, delivery tracking or recovery for an operation allowed to end without delivery.
