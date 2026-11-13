# Testing

**Rule.** Tests swap adapters at the port and drive real engines, assert structural facts rather than wording,
and keep fixtures as small, declarative data. Model-dependent behaviour is tested against the real model and
judged by planted canaries over several runs. The gate exercises the artifact that ships, runs fast by default
and fully at milestones, and verifies with production's privileges.

## Rules

1. **Mock at the port, record side effects.** A test double implements the same port as the real adapters and
   records every write for assertions. Don't stub internals; swap the adapter.
2. **Use the real engine where one exists.** Don't reimplement an engine (diffing, rename detection, parsing) in a
   mock — drive the real tool against fixture data. The mock fakes the destination, not the mechanics.
3. **Structural assertions over text matching.** Assert facts the pipeline guarantees (the item landed in the
   right bucket, every blocker was posted, the thread was resolved) rather than matching free-form output. With a
   model in the loop this is mandatory: assert what the system did with the output, not its wording.
4. **Assert by canary, never by model prose.** Plant a distinctive value in the fixture — a record id, a made-up
   phrase — and assert it surfaces in the observable output (the answer, the cited source id). A grounded answer
   echoes the canary; a hallucination doesn't. Ride the same fixture for checks off recorded truth: was the tool
   called, which id was retrieved, is a score in its expected band.
5. **Test configs come from production defaults** — spread the exported defaults and override the field under
   test (see [configuration](configuration.md)).
6. **Fixtures are data, not code** — scenario folders with declarative config; adding a case means adding files,
   not test logic.
7. **A fixture varies the fields it is meant to distinguish.** A fixture that sets two related fields equal, or
   leaves one at zero, cannot catch the code swapping, summing or confusing them. Give each field a value that
   appears nowhere else in the fixture, and prefer realistic uneven numbers over `1, 2, 3`.
8. **Test a shared mechanism once, not once per value it carries.** When many values ride one mechanism (config
   keys through one reader, routes behind one guard, fields through one mapper), one representative value proves
   it. Test a value on its own only where its own logic lives: its validation, its default, its use.
9. **Deterministic paths get deterministic tests.** Test a pipeline's deterministic short-circuits without the
   expensive or flaky dependency; reserve model-backed end-to-end tests for genuinely model-dependent judgments,
   with assertions tolerant of model variance.
10. **Test model-dependent behaviour on the real model.** End-to-end tests run against the real model, so the
    suite catches a model regression and exposes a weak prompt as a failing assertion. Fake only what has no test
    value — the outbound transport (post to a recording stub). Mechanics that depend on determinism (content-hash
    dedup of model-written text) run on a deterministic test-double backend (see
    [pluggable-backends](pluggable-backends.md)).
11. **A model-dependent outcome is judged over runs; a red the environment caused gets one fresh re-run.** A test
    whose outcome rides a real model's answer is not deterministic — a model or a prompt drifts — and a red the
    environment caused (the host's clock, a container snapshot, an unreachable model host) is not the code's. When
    such a red falls in a run whose every other test passed, re-run the whole suite fresh on the same tree: an
    environment red closes on a green re-run, and red again is a finding. A real-model test counts green when it
    passed in 1 of 2 runs or in 2 of 3; every such miss is recorded — the test, what the model answered, the runs —
    as a candidate for hardening. A test of the change's own code, or any test that does not ride a model's answer,
    never takes this rule: one failure is a finding.
12. **Give the model the full menu.** When behaviour is a classification or selection, the test seed enables every
    option, including ones a deployment ships off. A correct result is then a genuine choice, and every existing
    test becomes a durability check: a new option must not pull other cases sideways. Never trim the menu to make
    a test green; fix the prompt.
13. **Gate the artifact you ship, not just the source.** Tests run source and go green while the deployable
    artifact is broken — packaging exercises paths tests never touch (a module evaluated at build time, a route
    collected during a static export, a stricter production compiler). If production runs a build step that dev
    and test skip, the gate runs that exact build. Resolve runtime-only inputs (env, secrets, a live service)
    lazily at the use site, never at module load, so the build loads every module without a live environment.
    A comment or doc claiming a build is gated when the gate does not run it is a defect.
14. **Two-speed gate.** The default gate is fast (lint, typecheck, unit tests, static config validation) and is the
    while-building loop. The full gate (an explicit flag) adds the heavy end-to-end tests and runs at milestones —
    a task's done-when, final verification, before a commit — never after every edit.
15. **Keep functional tests small and bounded.** Use the fewest records, files, requests and concurrent actors
    that prove the behaviour: a race needs two actors, a nesting case a small representative tree. Exercise limits
    through a small configurable boundary or a controlled clock, not by filling the
    production quota or waiting out production deadlines. Load, stress, soak and capacity tests need an explicit
    request and a separate opt-in run; they never join the default suite. An unexpectedly expensive test is fixed
    at its owning boundary, not hidden by weaker assertions or a larger machine.
16. **No test of the transaction itself.** A test that throws after a write to prove the rollback undid it proves
    the store's transaction, not the code. It is not written, and a plan never asks for one. What a refusal answers
    (its status, its code) is behaviour and is tested by that answer.
17. **End-to-end runs on an isolated, disposable, self-seeding environment — never dev or prod.** Its own project
    name, ports and volumes; disposable storage so every boot seeds fresh from the migrations (persist only
    expensive-to-fetch assets). Wait on observables with a bounded coarse poll that returns the moment the
    condition holds — never one long sleep.
18. **Missing data? Write a seed that is itself a test.** Seed through the real write path and assert the write
    worked, so the seed is a test of that path and the fixture later tests consume. Order suites so setup runs
    first (a preflight that proves the environment is up, then the seed). Shared given-state lands in the one seed
    suite; later tests consume it and never re-seed their own copy. A test keeps in-suite only its own
    create→assert→cleanup subject that nobody else consumes. When a new shared given would collide with an
    existing one (two records on one topic make ranking nondeterministic), give it a distinct topic.
19. **Reload boot-cached state after seeding.** State a running service loads at boot does not see rows seeded
    after it started. The seed triggers the service's own reload seam (the one the application uses after a
    settings write) — never a migration that plants the data, since a migration ships to production (see
    [no-dead-code](no-dead-code.md)).
20. **Verify with the caller's privileges, not yours.** A migration checked as a superuser proves the SQL is
    correct, not that the application's database user may run it. Reproduce production grants and run the check
    as the application user; a migration that legitimately needs more declares it and is verified both ways —
    denied as the application user, applied with elevation. A check that runs with wider authority than
    production is not a check.

## Why

Swapping adapters at the port and driving real engines keeps the test on the code that ships. Assertions on
structure and canaries survive model wording changes and still detect hallucination. Bounded, deterministic tests
keep the default gate fast enough that nobody skips it; the full gate and the real model catch what fakes cannot —
a broken build artifact, a model regression, a prompt that only worked because it had one choice. A single
model-backed run is a sample, so one red or green proves little either way. Checks run with wider authority, or
fixtures whose fields coincide, pass while the defect stands.

## How to apply

```ts
// Rule 5: test config from production defaults.
const config = { ...DEFAULT_CONFIG, maxItems: 2 };

// Rule 1: the double implements the port and records writes.
class RecordingNotifier implements Notifier {
  readonly sent: Notification[] = [];
  async send(n: Notification): Promise<void> {
    this.sent.push(n);
  }
}

// Rule 4: a canary planted by the seed, asserted in the answer.
const CANARY = "GreyCat-7f3";
await seedDocument({ title: "Vault policy", body: `The vault passphrase is ${CANARY}.` });
const answer = await ask("What is the vault passphrase?");
expect(answer.text).toContain(CANARY);
expect(answer.sourceIds).toContain(seededDocId);

// Rule 7: fields that must not be confused get distinct values.
const usage = { inputTokens: 1_337, cachedReadTokens: 48_211, outputTokens: 92 };
```

- Before adding a test, name the port it swaps and the structural fact it asserts.
- A test that asserts model wording, a fixture with coinciding fields, or a seed planted by migration is a finding.
- A real-model red is reported with its runs and, when retried, the environmental cause that justified the retry.
