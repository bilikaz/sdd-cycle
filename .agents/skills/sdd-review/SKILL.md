---
name: sdd-review
description: Reviews built work through a fresh lead and applicable specialists using the shared change map and reusable guides. Use for sdd step review, sdd-review or deep code review. Returns verified findings for step 3; proposed-design review belongs to sdd-plan-review.
---

# sdd-review

Read [the built-code protocol](../../../docs/instructions/implementation/step-review.md).
Resolve task and prerequisites under
[Lead and inputs](../../../docs/instructions/implementation/step-review.md#lead-and-inputs).
Without built work, name step 3 and stop.

Follow [review independence](../../../docs/instructions/implementation/cycle.md#independent-reviews):
if this session built or planned the work, delegate the whole lead role to a fresh context.
If unavailable, report the limitation instead of reviewing your own work.
One round per authorized invocation, always with fresh review context.

1. Read progress and current task/standing documents under the protocol.
   Refresh the map with every changed root's original starting commit.
2. Select the round and exact paths under Outputs. Create or reuse `review/assignments.md`.
   Dispatch applicable fresh specialists with the full sdd.review.18 payload. They select relevant files
   from changes.md and task records themselves; assign no files.
3. Verify their findings and applicable coverage. Obtain missing evidence under the protocol's recovery rules;
   unavailable reviewers leave a final report with explicit incomplete coverage, never fabricated reports.
4. Produce reports from the
   [shared template](../../../docs/instructions/implementation/templates/report.md), following its COMMENTS.
   Discover current findings before consulting previous verdicts.
5. Return the final path, summary, coverage status and cleanliness under
   [sdd.cycle.5](../../../docs/instructions/implementation/cycle.md#review-cleanliness).

Under delegated implementation, require the supplied QA report reference and its lead's clean, complete status.
Standalone review does not impose that gate.
Write no progress entry, fix or disposition; never commit, push or route to another step.
