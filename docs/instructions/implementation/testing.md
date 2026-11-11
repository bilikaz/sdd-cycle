# Testing — what to run and what to record

Verification belongs to the implementation cycle: `sdd step 3` closes only on an executed gate. This file owns
how verification is run and what is recorded; each rule is an abstraction, written to apply to any task.

## The gate

- **sdd.testing.1.** **One entry point per side: its gate.** Verification runs one way for each repo the task
  changed, in the environment selected by the development path ([workspace.md](../workspace.md),
  sdd.workspace.6) — the platform's `bash scripts/ci.sh` from that checkout, the harness's
  `pnpm run check:all` from its `harness/` — never as a list of tools assembled
  by hand. A task that changed both runs both. It exits non-zero on any failure and has no path that runs a subset silently.
- **sdd.testing.2.** **The gate is mandatory.** No `sdd step 3` closes without an executed gate for every side it changed;
  the invocation and its exit code are recorded in the close report's **Verification** table
  ([step-3-implement.md](step-3-implement.md)). Two absences count, each stated there as the headline rather than
  a footnote: the gate's own non-zero exit, or a task that produced nothing testable.
- **sdd.testing.3.** **Run the gate; never improvise a check.** Where the gate does not cover what is needed,
  extend it in the same change — a gate is added to the harness's `scripts/run-gates.ts` aggregate, or the
  missing test to the package that owns the behaviour.
- **sdd.testing.4.** **The gate needs its selected environment.** It runs in the corresponding platform or
  Harness checkout, with the workspace installed (`pnpm install`). Resolve the host and prerequisites under
  sdd.workspace.6–7 at the block, never inherit another environment's readiness from an earlier step or session.
  Where unavailable, record the missing prerequisite and wait for that environment to be made available rather
  than switching hosts or closing unverified.
- **sdd.testing.5.** **A gate that has never been executed is not a gate.** Running the constituent tools by
  hand is evidence about the code and none at all about the gate.
- **sdd.testing.34.** **Real-API behaviour needs its own lane.** `check:all` is keyless. A change that reaches a
  model provider or an agent's real behaviour also runs the owning `pnpm run test:e2e` target with
  `DEEPSEEK_API_KEY` set, recorded beside the gate; without a key it is recorded *not run* and why
  (sdd.testing.17). Secrets are never printed.

- **sdd.testing.36.** **The platform's e2e runs only through `scripts/ci.sh`; never invoke an e2e file directly.**
  An e2e file writes accounts, mail and keys into whatever stack its addresses reach, and the host publishes the
  live dev space's ports. `pnpm test` and a plain `vitest run` run the unit files only; the e2e files join only
  under `E2E=1`, which the gate's `tests` container alone sets, and every e2e run first checks that every address
  it reaches is set — no e2e file has a default (`scripts/e2e-environment.ts`) — and asks the platform's health which space
  it is, aborting unless it is `test` (`scripts/e2e-guard.ts`). An agent never sets `E2E=1`
  itself, never points an e2e file at a space, and runs an e2e lane only as the gate — or its partial run,
  `bash scripts/ci.sh --only <lane>` (sdd.testing.1).

### What the platform gate runs

`scripts/ci.sh` is the platform's hermetic gate: the host is only a Docker host, and the
test space (`docker/test/`) owns its compose, image and values. In outline — the script is the inventory —
format, suppressions, the docs check, knip, typecheck, lint, the unit suites, the catalog with its story tests,
then the stack's e2e (`E2E=1`, behind the guard), and at its end — green or red — the harness containers and
networks the run made, all but the bootstrap accounts', removed. Its partial-run flags (`--only <lanes>`, `--no-<area>`) print `PARTIAL RUN — NOT A GATE`
and exit 3, so they can never close a step.

### What the harness gate runs

`pnpm run check:all` is the harness's comprehensive local aggregate (`scripts/run-gates.ts`, mode `check-all`) —
the script, not this file, is its inventory. In outline: the runtime-closure, Cordis-config, client-domain-graph
and module-graph verifications; the unit tests (`test`); the approval and issue-management policy tests;
duplication; the keyless recorded-session snapshots and the expected-output lane; the build and the web build;
the hygiene gates (publint, workspace, package and dependency checks) on the built output; and the
documentation gates (`doc-sync`). It does not run lint or the coverage gate of CI — see sdd.testing.35.

- **sdd.testing.35.** **Lint and coverage close beside the harness gate.** A harness change also runs `pnpm run lint` and the
  coverage of the packages the change touches (`pnpm exec vitest run <owning tests> --coverage
  --coverage.include='<the touched src>'`, the harness's per-file 100% threshold applying). Each is a row of
  the Verification table, with its exit code.

## Partial runs — fast feedback, never the gate

While building, verification is the **smallest check that would fail for the change's regression** — the
selection the harness's [dsh-pre-push-checks](../../../harness/.agents/skills/dsh-pre-push-checks/SKILL.md)
skill describes: the owning Vitest file or test name, `vitest related` for a changed module, `doc-sync` for
documentation, the focused snapshot for model- or user-visible output, `build` plus hygiene for manifests and
exports. A partial run is evidence about the iteration, never about the step.

- **sdd.testing.32.** **The agent decides what a change touches, and leaves out only what it cannot.** A change
  in a shared package (`packages/core`, `packages/util`, `vendor/`) reaches everything that depends on it; the
  root configs, `scripts/` and the lockfile reach everything. Narrow a run only where the change cannot reach
  what is left out.
- **sdd.testing.33.** **A partial run is for iterating; the close is always the full gate.** Iterate with the
  smallest run that covers the change, and close the step on the full gate of every side it changed (exit 0),
  with sdd.testing.35's rows for the harness — never on a partial run's passing checks.

## The checks

- **sdd.testing.7.** **Assert the effect, not the plumbing.** Assert what the system did — the state changed,
  the row landed — never that a function was called or a string matched.
- **sdd.testing.8.** **Mock at the port, not the internals.** A double implements the real adapter's interface
  and records what was written; the assertion reads the record. Never stub a private method.
- **sdd.testing.37.** **Test a shared mechanism once, not once per value it carries.** When many values undergo
  the same procedure — config keys read through one config reader, repository fields through one mapper,
  routes behind one guard — test the mechanism with a representative value. A test per key, field or route
  re-proves the same logic and adds only upkeep. Test a value on its own only where its own logic lives:
  its validation, its default, the code that uses it. Distinct branches and failure modes of the shared
  mechanism still need their own coverage.

## The record

- **sdd.testing.16.** **A failing test is a finding; the test file is never the fix.** Either the code is wrong
  or the expectation was — name which. Never a weakened assertion, a skipped test or a trimmed fixture. A wrong
  expectation carries a decision and is settled before it is applied ([escalation.md](escalation.md)).
- **sdd.testing.17.** **State what ran and what did not.** An unverified done-when is recorded unverified,
  never claimed; silence is not a record.

## The traps

- **sdd.testing.26.** **A unit-lane red that goes green on a re-run in the same environment was an environment
  problem: re-run the whole gate fresh before believing it.** A flake changes answer; a real failure does not.
