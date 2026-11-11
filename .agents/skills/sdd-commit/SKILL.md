---
name: sdd-commit
description: Runs `sdd step 5` — commits the whole working tree of both repos (the task's `harness/` branch and the workspace), records the task in `docs/tasks/INDEX.md`, merges the workspace's branch into `main` and pushes `main` and each branch to its private `origin` — no PR, never upstream. Use when the user says commit, deliver, push it, close it out, or invokes sdd-commit; or when a task rests with `sdd step 5` open and the user says continue. The invocation is the signal for the commit, the merge and the push. Not for the build (`sdd-implement`), the review (`sdd-qa`) or planning (`sdd-plan`).
---

# sdd-commit — `sdd step 5`

The delivery. The step's rules are `docs/instructions/implementation/step-5-commit.md`; this skill carries the
entry and the boundary.

## The step

- Check each repo is on the task's branch, never its base (`main`, `master`), before committing.
- Add the task's row to `docs/tasks/INDEX.md`, or bring it current on a further round (sdd.step5.8) — it rides the
  delivery commit.
- Commit **everything** each working tree holds, on the task's branch in each repo — in `harness/` the harness
  code and documents, in the workspace the platform code, documents and records (`progress.md`, QA files). The agent decides nothing about what belongs:
  the whole tree is the change.
- Merge the workspace's task branch into `main` (`git merge --no-ff`, the message naming the task), then push
  `main` and the branch to `origin` (sdd.step5.3); the harness's task branch is pushed, never merged into `master`.
  A repo with no push target stays local and the entry says so.
- Bring the dev space up from `main` and see it working (sdd.step5.9) in the environment selected by the
  development path under sdd.workspace.6: `up -d --build --wait` there (the
  harness image first when `harness/` or `apps/harness/` changed; when a `package.json` changed, first remove the
  `node_modules` volumes of the services mounting that package, never the stores'), then every service running, every
  health-checked one healthy — the entry records it.
- Close the step-5 entry; nothing closes the task — it rests delivered.

## Never

- Never pick and choose what to commit.
- Never open a PR — the merge into `main` is the delivery.
- Never leave the merge unpushed, or a delivered task out of `docs/tasks/INDEX.md`.
- Never close the step with the dev space down or unchecked — a service that will not come up is reported.
- Never commit to or merge into `harness/`'s `master`, never push to its `upstream`, and never open a PR against
  `deepseek-ai/deepseek-harness`.
