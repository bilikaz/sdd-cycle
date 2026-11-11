# Instructions

**How we do things** — the work rules, binding on every change made through this workspace. Distinct from the
project's [standing documents](./workspace.md#standing-documents) (what exists, what it is called, why it was
chosen): an instruction commands, a map fact sits, an Agent Note argues. A topic that spans the workspace lives
**here as one file**; a topic family gets a folder with flat files — no per-folder `INDEX.md`, this page is the
only index. [workspace.md](./workspace.md) is where things are; [documentation/](./documentation/) groups the
laws about the workspace's own documents; [implementation/](./implementation/) is the task cycle — how one task
runs from interview to delivery.

| Folder | Instruction in one line |
|---|---|
| [workspace.md](./workspace.md) | Project setup template — agents collect repository, execution, document and gate details during grilling and populate them during planning |
| [documentation/single-source.md](./documentation/single-source.md) | Every rule, name, and table lives in exactly one place; anything else **links**, never restates — and indexes route to folders, not files; an accepted ruling lands in its home the moment it is accepted, in any step |
| [documentation/current-truth.md](./documentation/current-truth.md) | Every document says only what stands: a dropped answer, option, feature or design is deleted everywhere, never kept and labelled — git keeps the history |
| [documentation/doc-structure.md](./documentation/doc-structure.md) | Fixed heading anatomy: H1 title, H2 logical cuts, members below; a description rides directly behind its thing |
| [documentation/format.md](./documentation/format.md) | Diagrams are Mermaid; detail lives in tables, not annotated trees; one record per row; one path base per table; three-column file inventories |
| [documentation/implementation-guide.md](./documentation/implementation-guide.md) | The fixed anatomy of `implementation.md`: per-root overview · flows · contract tables · data shapes · touch-lists · logic sketches · verification plan |
| [implementation/cycle.md](./implementation/cycle.md) | The implementation cycle: the five user-driven steps, the task folder, ids, `progress.md`, the two commit moments |
| [implementation/step-1-grilling.md](./implementation/step-1-grilling.md) | `sdd step 1` — the interview, its two doors (grill · citation), and `grill.md`, the answer ledger |
| [implementation/step-2-settle.md](./implementation/step-2-settle.md) | `sdd step 2` — `task.md` and `implementation.md`, their anatomy, the confirmation and the settlement commit |
| [implementation/step-3-implement.md](./implementation/step-3-implement.md) | `sdd step 3` — build, test and documents interleaved; disposing of a QA round's findings; the closing report tables |
| [implementation/step-4-qa.md](./implementation/step-4-qa.md) | a QA lead assigns built changes to code-review, conventions and drift agents, verifies their reports and writes `qa<y>.md` for step 3 |
| [implementation/step-review.md](./implementation/step-review.md) | a lead assigns built changes and conventions to six specialists, verifies their reports and writes `review<x>.md` for step 3 |
| [implementation/step-plan-review.md](./implementation/step-plan-review.md) | a lead coordinates six proposed-design reviewers with one-time convention assignments and source guides, verifies their reports and writes `plan-review<x>.md` for step 2 |
| [implementation/step-5-commit.md](./implementation/step-5-commit.md) | `sdd step 5` — commit both repos, record the task in the tasks index, merge the workspace's branch into `main`, push each to its private `origin` |
| [implementation/escalation.md](./implementation/escalation.md) | Escalation and evolution — the one fork a change to a settled task takes |
| [implementation/changes.md](./implementation/changes.md) | the shared task change map: fixed starting commits, all Git roots, file counts and original/current line ranges for QA and built-code review |
| [implementation/testing.md](./implementation/testing.md) | What to run (each changed side's gate in the selected environment — `scripts/ci.sh`, `pnpm run check:all` — mandatory) and what to record; the learned verification rules |
