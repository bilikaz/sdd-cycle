# sdd step 3 — Implementing

Step 3 interleaves building, testing and documentation. It implements settled scope and disposes of
QA or built-code review findings. Its entry point is
[sdd-implement](../../../.agents/skills/sdd-implement/SKILL.md); an explicitly delegated loop uses
[sdd-implementer](../../../.agents/skills/sdd-implementer/SKILL.md).

## Entry

- **sdd.step3.1.** Read progress, grill rulings, settled task and implementation documents, approved evolution
  and the applicable [standing documents](../../workspace.md#standing-documents).
- **sdd.step3.2.** Require the landed step-2 settlement commit for required documents, honoring recorded waivers
  under [sdd.step2.9](step-2-settle.md#the-confirmation-and-the-commit). A missing prerequisite is reported;
  build nothing and start no planning step. A refactor walk uses its recorded waiver and evolution instead.
  Select the named task, otherwise the branch-matching task, otherwise the sole task with step 3 current;
  ask if absent or ambiguous. Open or resume its progress entry under
  [the cycle's progress rules](cycle.md#progressmd), unless the delegating coordinator owns it.
- **sdd.step3.3.** On re-entry, read the QA or review report that returned the task to implementation before
  acting. Resolve an ambiguous report selection rather than guessing from lexical filename order.
- **sdd.step3.22.** Verify the task branches initialized by [step 0](step-0-new-task.md) in every participating
  root. A missing or mismatched branch is a prerequisite gap: report it and stop, without creating or switching
  branches. New roots need step-0 setup and Git context in progress before edits. Use those recorded
  initial commits in the [change map](changes.md); later review rounds retain them.
- **sdd.step3.4.** For a testable bug, establish a failing regression test for the stated defect before fixing it.
  Choose cases under [sdd.testing.37](testing.md#the-checks), not a test for every equivalent value.

## Build

- **sdd.step3.5.** Build to the settled documents, approved evolution and applicable standing rules.
- **sdd.step3.6.** A deviation not authorized by that context is an implementation defect; fix it.
- **sdd.step3.7.** Record needed plan or scope adjustments under [escalation.md](escalation.md), with their
  agent/person origin. Obtain required rulings before dependent work. Keep the original plan frozen.
- **sdd.step3.8.** Reference assets inform behavior; reading a mockup, spike or reference implementation
  does not authorize copying its files.

## Disposing of a QA round or a review

- **sdd.step3.9.** Give every finding in the returning report one disposition:
  **fixed** within settled scope; **escalated** when a decision is needed; **rejected** only when it is not
  a defect; or **registered** for an unanswered question entered in `open-questions.md`.
- **sdd.step3.10.** A real defect is never rejected; escalate it if it cannot be fixed within the settled scope.
- **sdd.step3.11.** The fixer checks current source before acting, under
  [sdd.cycle.6](cycle.md#finding-verification). The coordinator does not repeat this investigation.
- **sdd.step3.12.** Append [Dispositions from the report template](templates/report.md#dispositions) to the originating report.
  Preserve the reviewer's findings.

## Test

- **sdd.step3.13.** Run the configured full gate for every changed root under [testing.md](testing.md).
  Record command, execution environment, exit code and any unrun checks. A required gate that fails or
  cannot run prevents successful completion. If nothing is testable, state why.
- **sdd.step3.14.** A done-when that was not verified is recorded unverified, never claimed.

## Documents

- **sdd.step3.15.** Bring affected standing documents to current truth using their owning repository's
  standard. Regenerate generated documents rather than editing them by hand.
- **sdd.step3.16.** A new rule binding future work needs user approval before promotion to its standing home.
  Factual register entries need no separate approval; follow
  [single-source rule 5](../documentation/single-source.md).
- **sdd.step3.17.** Link existing facts instead of restating them. Update documents still describing removed behavior.

## The close report

- **sdd.step3.18.** Produce the implementation tables in the
  [progress template](templates/progress.md#parts), following their local COMMENTS guidance.
- **sdd.step3.19.** Keep that record current as work lands; do not invent verification from memory at close.

## Closing

- **sdd.step3.20.** Complete the step when the build is done, required verification passes and affected
  documents are current. Otherwise report the incomplete work and its cause.
- **sdd.step3.21.** Close the progress entry with those implementation tables. The reply states the
  outcome, material limits and next step briefly. Under delegated routing, return the result to the
  coordinator that owns progress.
