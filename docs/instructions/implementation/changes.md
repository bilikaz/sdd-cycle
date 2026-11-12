# The task's change map

`changes.md` is the shared file and line inventory used by QA and built-code review. Each specialist uses
it with the task records to select relevant material before opening source or a targeted diff.

## Generate

Run from the workspace with Git and Python 3 available:

```bash
bash scripts/changes.sh taskN --base <starting-commit>
```

The task argument accepts a numeric ID (`1`), a task name (`task1`) or a task-folder path
(`docs/tasks/task1`). IDs resolve under the current repository's `docs/tasks/`; the default Git root is the
current repository. `--base` accepts the starting Git commit hash or a ref, resolved to a fixed hash in the report.
Run `bash scripts/changes.sh --help` for argument descriptions and examples.

For multiple Git roots, repeat `--root <path> --base <starting-commit>` for every root the task changes.
Paths are resolved from the invocation directory. The task folder must already exist; the script prints
the resulting `<task-folder>/changes.md` path.

- **sdd.changes.1.** Use each root's initial starting commit from `progress.md` Git context under the
  [progress template](templates/progress.md#git-context). Step 0 records it when the task branch is created;
  a newly participating root records its start before its first edit. Retain these hashes through every round.
  A later checkpoint, re-settlement or current HEAD never silently replaces a starting commit.
- **sdd.changes.2.** Before each QA or built-code review round, its lead refreshes the map with all changed
  Git roots and their original starting commits from progress. Later rounds retain those hashes in the Roots table.
  When a task first changes another root, add that root and its starting commit. Preparation does not change
  Git's index, working files or history. The report is replaced only after all roots are collected successfully.
- **sdd.changes.3.** Each root covers its entire tree except `docs/tasks/`, including committed, staged,
  unstaged and nonignored untracked changes. A nested independent repository needs its own root and starting
  commit. An ignored untracked file is outside the map; tracked files remain in scope even if now ignored.
  The output folder, when inside a scanned root, must be under that root's `docs/tasks/`.

## The report

- **sdd.changes.4.** The Roots table records each absolute Git root, resolved starting commit, current HEAD
  and a fingerprint of the collected changes. Each root has a separate table of relative paths: a readable
  Change label (New, Deleted, Updated, Moved, Copied or Type changed), additions, deletions, their sum and
  original/current changed line ranges. Moved and Copied labels include Git's similarity code, such as
  `Moved (R100)`. Git's detection determines these labels. New includes nonignored untracked files.
- **sdd.changes.5.** Line ranges use zero-context hunk coordinates. `after N` marks the empty side of an
  insertion or deletion; binary files have no line counts or ranges. Mode-only changes and empty files can
  have zero changed lines. Root and combined totals count files, additions, deletions and binary files.
  Counts describe the net change from the starting commit, not how many edits were made along the way.
  Paths are JSON-quoted so unusual filenames remain one table cell.
- **sdd.changes.6.** Each reviewer selects relevant files and ranges from the map and task records according
  to its responsibilities; the lead assigns no files. Open current source and targeted diffs to establish
  behavior, following relevant dependencies outside the map where necessary.
  A changed-line range does not limit what can cause a defect. The lead checks snapshot identity against
  the map, which owns its fingerprints; a source change during a round requires a refreshed map and a new read of affected work
  before the round can be called complete.
- **sdd.changes.7.** Each generated report explains its purpose, comparison scope, change labels, count and
  coordinate conventions, and snapshot identity. It is readable without opening the script or these
  instructions. Counts measure edit size; intent, correctness and risk require the task context and source.
