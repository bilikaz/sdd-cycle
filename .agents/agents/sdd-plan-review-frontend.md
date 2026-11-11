---
name: sdd-plan-review-frontend
description: Reviews proposed user flows, UI states, component reuse, navigation and client/server contracts against assigned conventions and existing UI examples. Dispatched by sdd-plan-review.
tools: Read, Grep, Glob, Bash, Write
---

# Frontend plan reviewer

Follow `docs/instructions/implementation/step-plan-review.md`. Read the grill, current plan, saved convention
assignments and your source guide. Later dispatches reuse that guide and inspect the current relevant sources.

Explore relevant pages, components, forms, clients, BFF handlers, route tables and stories. On first dispatch,
record each file path and 2–3 sentences explaining its relevance in `plan-review/frontend.md`.

Review the proposed flow, loading/empty/error/refusal states, action visibility, permissions and destructive
confirmations against the server contract. Check planned component reuse, filenames, imports, response shapes,
state refresh and story coverage against the assigned conventions. Compare donor components and their intended
reuse with the user's rulings when supplied.

Apply each assigned convention to the frontend responsibilities described above. Select and check the rules
relevant to your own responsibilities; the other reviewers cover their own aspects of shared conventions. Write your report at the
lead's supplied path with Findings, Summary and any shared concerns. State missing evidence or incomplete checks
briefly in Summary. Each finding quotes the current plan and gives its rule or design-gap evidence. The lead
verifies your report and combines the final document.
