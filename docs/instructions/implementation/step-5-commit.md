# sdd step 5 — Commit

Step 5 makes the task's delivery: it commits the task's branch in each repo it changed, records the task in the
tasks index, merges the workspace's branch into `main`, and pushes. No PR is opened — the user is the only
developer, so a delivered branch lands on `main` at once. The invocation of the step is the signal for the whole
delivery. The repos, the branch and the push targets are [workspace.md](../workspace.md)'s.

## The step

- **sdd.step5.1.** Commit everything each working tree holds, on the task's branch in each repo it changed — in
  `harness/` the harness code and documents; in the workspace the platform code, its documents, `progress.md`, the
  QA files and every other record the step-2 commit did not already carry. The agent decides nothing about what
  belongs: the whole tree is the change.
- **sdd.step5.2.** Push in the same act, each branch to its repo's `origin` (sdd.workspace.3). A record only the
  author's disk holds has not been delivered.
- **sdd.step5.3.** Merge the workspace's task branch into `main` (`git merge --no-ff`, the message naming the
  task) and push `main` to `origin` in the same act. The harness's task branch is pushed and never merged: its
  `master` is upstream's and never committed to (sdd.workspace.2). No PR is opened, on either repo, and never one
  against `deepseek-ai/deepseek-harness` (sdd.workspace.3).
- **sdd.step5.4.** The step checks the branch before it commits: in each repo, the task's branch
  (sdd.workspace.2), never `main` or `master`.
- **sdd.step5.5.** The commit message names the task and what it delivered, in both repos.
- **sdd.step5.8.** The delivery commit adds the task's row to the [tasks index](../../tasks/INDEX.md), or brings
  it current on a further round: the task folder, its goal in a line, and where it landed (merged to `main`, its
  QA rounds, its open questions). A delivered task missing from the index has not been recorded.
- **sdd.step5.9.** After the push, the dev space is brought up from `main` in the execution environment
  selected by the development path (sdd.workspace.6) and seen working there. Delivery never authorizes copying
  to or operating another checkout or host. In the selected environment:
  workspace back on `main`; each **Shared service** seen running first (`docker inspect -f '{{.State.Running}}'
  deepseek-shared-<service>`) — one that is not is started by hand with
  `docker compose -f docker/shared/docker-compose.yml up -d --no-build --no-recreate <service>`, never rebuilt by the
  delivery (sdd.workspace.12); then `docker compose -f docker/dev/docker-compose.yml up -d --build --wait --remove-orphans`
  — a service a task removed from the compose file leaves with it, its containers only, never a volume — (with
  `--profile image build harness` first when `harness/` or `apps/harness/` changed; and when a `package.json`
  changed, the `node_modules` named volumes of every service mounting that package removed with their containers
  first — a rebuild never refreshes them, and the stores' volumes are never touched), then every service of
  `docker compose … ps -a` running and every health-checked one healthy. The entry records the command and what
  `ps` showed; a service that will not come up is reported with its log tail — the delivery stands, the dev
  space is the user's to rule on.

## Closing

- **sdd.step5.6.** Close the step-5 entry; the commits, the merge and the pushes are the record of the delivery.
- **sdd.step5.7.** Nothing closes the task. It rests delivered; later work on it is a further round through
  these steps, in the same folder.
