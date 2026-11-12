---
name: sdd-qa
description: Runs sdd step 4 through a fresh QA lead and three specialists using the shared change map. Use for independent QA of built task work. Returns verified findings for step 3.
---

# sdd-qa

Read [the QA protocol](../../../docs/instructions/implementation/step-4-qa.md).
Resolve task and built-work prerequisites under
[Lead and inputs](../../../docs/instructions/implementation/step-4-qa.md#lead-and-inputs).
Without built work, name step 3 and stop.

Follow [review independence](../../../docs/instructions/implementation/cycle.md#independent-reviews):
if this session built the work, delegate the whole lead role to a fresh context.
If unavailable, report the limitation instead of reviewing your own work.
One round per authorized invocation, always with fresh review context.

1. Read progress and the protocol's current task inputs. Refresh the shared map with each root's original
   starting commit under [the changes protocol](../../../docs/instructions/implementation/changes.md).
2. Select the round and exact paths under the protocol's Outputs. Prepare or reuse assignments;
   dispatch all three lanes with the full sdd.step4.15 payload. Specialists select relevant material from
   the map and task records themselves; assign no files. Follow sdd.step4.3 for recovery.
3. Verify findings and coverage. If a specialist is unavailable, still write a final report naming incomplete
   coverage; never impersonate it.
4. Produce specialist/final output from the
   [report template](../../../docs/instructions/implementation/templates/report.md), following its COMMENTS.
   Current discovery precedes the previous verdict.
5. Return final path, summary, coverage status and cleanliness under
   [sdd.cycle.5](../../../docs/instructions/implementation/cycle.md#review-cleanliness).
   Standalone, open/resume and close step-4 progress under the protocol; with
   **progress owner: coordinator**, write no progress entry.

Never fix, dispose findings, commit, push or start the next step from this round.
