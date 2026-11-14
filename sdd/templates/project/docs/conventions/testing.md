# Testing

**Rules.**

1. **Mock at the port, record side effects.** The test double implements the same
   port as real adapters and records every write (`postedInline`, `verdicts`, …) for
   assertions. Don't stub internals; swap the adapter.
2. **Use the real engine where one exists.** Don't reimplement diff/rename logic (or
   any engine) in the mock — drive the real tool against fixture data (e.g. build a
   throwaway git repo from `old/` + `new/` trees and let `git -M` do rename
   detection). The mock fakes the *destination*, not the *mechanics*.
3. **Structural assertions over text matching.** Assert facts the pipeline
   guarantees (file landed in the right bucket, every blocker was posted inline, the
   thread was resolved) rather than regexing free-form output. With LLMs in the loop
   this is mandatory: assert on what the system *did* with the output, not the
   output's wording.
4. **Deterministic paths get deterministic tests.** Where a pipeline has
   deterministic short-circuits, test those without the expensive/flaky dependency;
   reserve end-to-end-with-model tests for genuinely model-dependent judgments, and
   keep their assertions tolerant of model variance.
5. **Test configs come from production defaults** — spread the exported defaults and
   override the field under test.
6. **Fixtures are data, not code** — scenario folders with declarative config; adding
   a case means adding files, not test logic.
7. **Gate the artifact you ship, not just the source.** Tests import and run *source*;
   they go green while the *deployable artifact* is broken, because packaging exercises
   paths the test path never touches — a module evaluated at **build** time, a route
   collected during a static export, a stricter production compiler. So if production
   runs a build step that dev/test skip (`next build`, an image build, an AOT compile,
   a static export), run **that exact build** in CI. A build no gate exercises **rots
   silently** — everything else is green, so nothing is red, and the break surfaces on
   deploy day, the worst time to find it. Corollary: resolve runtime-only inputs (env,
   secrets, a live service) **lazily at the use-site**, never eagerly at module load, so
   the build can load every module without a live environment. And delete any comment or
   doc claiming a build is gated unless the CI script demonstrably runs it — false
   assurance about a gate is its own defect.
8. **Test application behavior, not infrastructure mechanics.** Verify that our workers
   are registered, invoked and produce the expected application state and output. Do not
   re-test infrastructure mechanics such as Inngest scheduling, queue retry timing,
   balancing or database locking. Do not demand an exact work split between parallel
   workers. Concurrent tests protect invariants owned by
   our application, such as data isolation or preventing duplicate publication.
   A test that throws after a write to prove the
   rollback undid it — the row, the trail, "leaves neither … committed" — proves the
   store's transaction, not the code, and every such test slows the gate for nothing. It
   is not written, and a plan never asks for one. What a refusal answers (its status, its
   code) is behaviour and is tested by its answer.
9. **Keep functional tests small and bounded, including in `scripts/ci.sh`.** Use the
   fewest records, files, requests and concurrent actors needed to prove the behaviour.
   A race normally needs two actors; a nesting case needs a small representative tree.
   Exercise limits through a small configurable boundary, a controlled clock or a narrow
   test at the owning boundary, rather than filling the production quota, allocating
   maximum-size payloads or waiting through production-length deadlines. Keep the real
   behaviour and assertions intact. Routine unit, integration and end-to-end suites are
   functional checks, not load, stress, soak, throughput or capacity tests. Those tests
   require an explicit user request and a separate opt-in run; they never join the default
   suite or `scripts/ci.sh`. An unexpectedly expensive test is corrected at its owning
   boundary, not hidden by weaker assertions or a larger machine.

## Additional shared rules

10. **Assert by canary, never by model prose.** Plant a distinctive value in the fixture — a record id, a made-up
   phrase — and assert it surfaces in the observable output (the answer, the cited source id). A grounded answer
   echoes the canary; a hallucination doesn't. Ride the same fixture for checks off recorded truth: was the tool
   called, which id was retrieved, is a score in its expected band.
11. **A fixture varies the fields it is meant to distinguish.** A fixture that sets two related fields equal, or
   leaves one at zero, cannot catch the code swapping, summing or confusing them. Give each field a value that
   appears nowhere else in the fixture, and prefer realistic uneven numbers over `1, 2, 3`.
12. **Test a shared mechanism once, not once per value it carries.** When many values ride one mechanism (config
   keys through one reader, routes behind one guard, fields through one mapper), one representative value proves
   it. Test a value on its own only where its own logic lives: its validation, its default, its use.
13. **Test model-dependent behaviour on the real model.** End-to-end tests run against the real model, so the
    suite catches a model regression and exposes a weak prompt as a failing assertion. Fake only what has no test
    value — the outbound transport (post to a recording stub). Mechanics that depend on determinism (content-hash
    dedup of model-written text) run on a deterministic test-double backend (see
    [pluggable-backends](pluggable-backends.md)).
14. **Give the model the full menu.** When behaviour is a classification or selection, the test seed enables every
    option, including ones a deployment ships off. A correct result is then a genuine choice, and every existing
    test becomes a durability check: a new option must not pull other cases sideways. Never trim the menu to make
    a test green; fix the prompt.
15. **End-to-end runs on an isolated, disposable, self-seeding environment — never dev or prod.** Its own project
    name, ports and volumes; disposable storage so every boot seeds fresh from the migrations (persist only
    expensive-to-fetch assets). Wait on observables with a bounded coarse poll that returns the moment the
    condition holds — never one long sleep.
16. **Missing data? Write a seed that is itself a test.** Seed through the real write path and assert the write
    worked, so the seed is a test of that path and the fixture later tests consume. Order suites so setup runs
    first (a preflight that proves the environment is up, then the seed). Shared given-state lands in the one seed
    suite; later tests consume it and never re-seed their own copy. A test keeps in-suite only its own
    create→assert→cleanup subject that nobody else consumes. When a new shared given would collide with an
    existing one (two records on one topic make ranking nondeterministic), give it a distinct topic.
17. **Reload boot-cached state after seeding.** State a running service loads at boot does not see rows seeded
    after it started. The seed triggers the service's own reload seam (the one the application uses after a
    settings write) — never a migration that plants the data, since a migration ships to production (see
    [no-dead-code](no-dead-code.md)).
18. **Verify with the caller's privileges, not yours.** A migration checked as a superuser proves the SQL is
    correct, not that the application's database user may run it. Reproduce production grants and run the check
    as the application user; a migration that legitimately needs more declares it and is verified both ways —
    denied as the application user, applied with elevation. A check that runs with wider authority than
    production is not a check.
