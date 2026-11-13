# Escalation and evolution

After settlement, changes arising in steps 3–5 are recorded in `evolution.md`.
The original plan stays frozen so later agents can distinguish the baseline from the approved adjustments.

## Escalation

- **sdd.escalation.1.** A finding whose remedy needs a user decision is escalated with the issue, options
  and what it blocks. Do not implement an unresolved decision.
- **sdd.escalation.2.** Resolve changes through evolution in the current task, or propose a new task when
  the work is better separated. Agents do not route back to step 2.
- **sdd.escalation.3.** Record the pending decision in the task's register and ask the user for the needed
  ruling. A register entry is not permission to proceed with the dependent work.

## Evolution

- **sdd.escalation.4.** Evolution records adjustments to the settled requirements or design, including
  scope changes approved by the user. Read approved evolution with the original plan; it governs the affected
  parts without editing `task.md` or `implementation.md`. Ordinary fixes that restore the agreed behavior
  need their finding disposition, not an evolution row for every code edit.
- **sdd.escalation.5.** Use the [evolution template](templates/evolution.md).
  Mark who initiated each change: **agent** or **person**. An agent proposal remains pending until the
  required ruling; refinements already authorized by the task cite that authority.
- **sdd.escalation.11.** Revise an evolution row to its current ruling under
  [current-truth.md](../documentation/current-truth.md). Keep its id; remove a row when none of it stands.
- **sdd.escalation.6.** Record user answers verbatim in `grill.md`; evolution links the ruling and records
  the change and its destination. Do not duplicate the discussion.
- **sdd.escalation.7.** Evolution states what changed and why, with enough detail to implement and review it.
  It supplements the original plan; it is not a replacement plan or a review report.
  Review leads report needed changes; the implementing agent records their approved evolution.

## Re-entering `sdd step 2`

- **sdd.escalation.8.** Only an explicit human instruction to re-settle the plan authorizes step-2 re-entry
  after implementation has begun. A finding or a scope change is not that signal.
  On that instruction, follow [step 2](step-2-settle.md) and obtain document confirmation before settlement.
- **sdd.escalation.9.** Propose a new task for work better handled independently. The user decides whether
  to open it; do not create or switch tasks automatically.

## Factual corrections

- **sdd.escalation.10.** A frozen plan's factual misstatement takes an evolution row marked correction,
  with the initiating agent/person and supporting evidence. It needs no new ruling when the intended answer
  is already settled. Keep the original documents frozen; there is no automatic step-2 reconciliation.
