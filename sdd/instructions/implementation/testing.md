# Testing — what to run and what to record

The project owns its gates; this file governs their use at the end of implementation.

## Scope

- **sdd.testing.39.** This procedure applies only at the end of `sdd step 3`, before implementation is
  handed back. Its testing and verification requirements do not apply to any other step. Other steps use
  the recorded step-3 results; this procedure does not require or authorize rerunning tests, lint, builds,
  coverage or gates there.

## The gate

- **sdd.testing.1.** At the end of `sdd step 3`, run the full gate configured for each changed repository in
  [workspace.md](../../workspace.md#verification-gates), in its selected environment. The gate reports failures
  with a nonzero exit and does not silently skip required checks.
- **sdd.testing.2.** Step 3 requires an executed, passing gate for each changed root. Record its command,
  environment and exit code under [step-3 verification](step-3-implement.md#test).
  If nothing is testable, state why. A failed or unavailable required gate is incomplete verification,
  except for the evidenced live-model observations classified under sdd.testing.40.
  An unconfigured gate is a missing prerequisite, not evidence that nothing is testable; resolve it before
  successful completion rather than guessing a command.
- **sdd.testing.3.** Add missing regression coverage to the owning tests and configured gate.
  Ad hoc checks do not replace the project's full entry point.
- **sdd.testing.4.** Resolve the execution environment and prerequisites under sdd.workspace.6–7.
  Missing dependencies or services do not authorize switching hosts or closing unverified.
- **sdd.testing.5.** Executing constituent tools alone does not prove that the gate itself works.
- **sdd.testing.34.** Where changed behavior needs live integration verification, use the project's configured
  integration lane and credentials. Record unavailable credentials as a missing prerequisite. Never print secrets.
- **sdd.testing.36.** Run stateful end-to-end checks only through the project's configured test entry point,
  against its identified test environment. Check target identity before writes. Follow the
  [Docker convention](../../../project/docs/conventions/docker.md) where Docker is used; dev and shared data are not disposable
  test state.
- **sdd.testing.38.** Verification never starts, rebuilds, recreates or stops the dev stack; an agent does that
  only when the user asks, because a rebuild is a long cycle and the dev stack is the user's working state. Tests
  run on the test stack alone. The test stack is recreated at the start of a run and left running after it —
  never stopped as teardown — so its containers, logs and data stay open to inspection.
- **sdd.testing.35.** Run the project's required lint, coverage and other supplemental checks where the full
  gate does not include them. Use its configured thresholds; this cycle supplies no universal coverage percentage.

The gate script or configuration owns its check inventory. Do not duplicate that inventory here.

## Partial runs — fast feedback, never the gate

- **sdd.testing.32.** Choose focused checks by the behavior and dependencies a change reaches.
  Shared code, root configuration and dependency changes may require broader verification.
- **sdd.testing.33.** Use the smallest meaningful check while iterating. Successful completion still requires
  the full gate for each changed root and any configured supplemental checks.

## The checks

- **sdd.testing.40.** Live models can deviate from requested wording, formatting or selections. When the
  retained model response establishes that such a deviation alone caused an assertion to fail, log it as
  **potential prompt hardening needed**, with the test, expected contract, actual response and affected
  follow-up checks. It is a non-blocking model observation, not an implementation defect or a reason to
  fail verification or stop review. Preserve the actual runner exit and this classification when an
  existing runner reported it as a failure; never relabel that historical run as passing. Do not retry
  until the model happens to comply. Deterministic application behavior remains subject to its normal
  assertions; missing data, failed tools, transport errors and incorrect parsing of valid model output
  remain failures. Record any follow-up checks prevented by the observation as unrun, and complete
  independently required application checks before claiming their coverage.
- **sdd.testing.7.** Assert observable behavior and results rather than incidental implementation details.
- **sdd.testing.8.** Mock at external boundaries through their real interfaces, not private methods.
- **sdd.testing.37.** **Test a shared mechanism once, not once per value it carries.** When many values undergo
  the same procedure — config keys read through one config reader, repository fields through one mapper,
  routes behind one guard — test the mechanism with a representative value. A test per key, field or route
  re-proves the same logic and adds only upkeep. Test a value on its own only where its own logic lives:
  its validation, its default, the code that uses it. Distinct branches and failure modes of the shared
  mechanism still need their own coverage.
- **sdd.testing.41.** Write no test for a migration.

## The record

- **sdd.testing.16.** Investigate a failing test to distinguish an implementation or expectation defect
  from a live-model observation under sdd.testing.40.
  Do not weaken assertions, skip cases or trim fixtures merely to pass. A change to settled behavior follows
  [escalation.md](escalation.md).
- **sdd.testing.17.** State what ran and what did not. Unverified behavior remains unverified.
- **sdd.testing.26.** A failure that disappears on rerun is still unexplained. Investigate the inconsistency
  rather than declaring an environment problem from a passing retry. Classify evidenced model variation
  under sdd.testing.40. After addressing an implementation or expectation defect, rerun the full gate.
