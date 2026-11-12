#!/usr/bin/env bash
# Write <task-folder>/changes.md: paths, Git statuses, line counts and changed ranges.
# Compare a fixed starting commit to current files, including committed, staged,
# unstaged and nonignored untracked changes. Exclude docs/tasks/ in every root.
# Reviewers use the map and task records to choose relevant source; assess behavior in the code.
# Requires Git and Python 3. Run with --help for task IDs, starting commits and examples.
set -euo pipefail
exec python3 - "$@" <<'PY'
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile


def git(root, *args, allowed=(0,)):
    result = subprocess.run(
        ['git', '-C', str(root), *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    if result.returncode not in allowed:
        raise ValueError(result.stderr.decode('utf-8', 'replace').strip() or 'Git failed')
    return result.stdout


def cell(value):
    # JSON quoting keeps unusual filenames on one Markdown table row.
    return json.dumps(str(value), ensure_ascii=True).replace('|', '\\u007c').replace('`', '\\u0060')


def ranges(hunks, side):
    result = []
    for hunk in hunks:
        start, count = hunk[side * 2:side * 2 + 2]
        if count:
            result.append(str(start) if count == 1 else f'{start}-{start + count - 1}')
        else:
            result.append(f'after {start}')
    return ', '.join(result) or '—'


def excluded(path):
    return path == 'docs/tasks' or path.startswith('docs/tasks/')


def change_kind(status):
    if status.startswith(('R', 'C')):
        return f'{"Moved" if status[0] == "R" else "Copied"} ({status})'
    return {'?': 'New', 'A': 'New', 'D': 'Deleted', 'M': 'Updated',
            'T': 'Type changed'}.get(status[0], 'Other')


def inspect_root(root_arg, base_arg):
    root = Path(os.fsdecode(git(Path(root_arg).resolve(), 'rev-parse', '--show-toplevel')).strip())
    base = git(root, 'rev-parse', '--verify', '--end-of-options', base_arg + '^{commit}').decode().strip()
    head = git(root, 'rev-parse', 'HEAD').decode().strip()
    options = ['--no-ext-diff', '--no-textconv', '--no-color', '--find-renames', '--ignore-submodules=all']
    scope = ['--', '.', ':(top,exclude)docs/tasks']
    names = git(root, 'diff', *options, '--name-status', '-z', base, *scope).split(b'\0')
    entries = []
    index = 0
    while index < len(names) and names[index]:
        status = names[index].decode('ascii')
        path = os.fsdecode(names[index + 1])
        index += 2
        old_path = path
        if status.startswith(('R', 'C')):
            path = os.fsdecode(names[index])
            index += 1
        entries.append((status, old_path, path))
    # Keep Git's own file/patch pairing, including renames whose old path is reused.
    tracked_diff = git(root, 'diff', *options, '--patch', '--unified=0', '--inter-hunk-context=0', base, *scope)
    patches = [b'diff --git ' + patch for patch in re.split(rb'^diff --git ', tracked_diff, flags=re.MULTILINE)[1:]]
    if len(entries) != len(patches):
        raise ValueError('Changed files moved while collecting the map; retry with a stable working tree.')
    entries = [(*entry, patch) for entry, patch in zip(entries, patches)]
    untracked = git(root, 'ls-files', '--others', '--exclude-standard', '-z', *scope)
    entries.extend(('?', os.fsdecode(path), os.fsdecode(path), None) for path in untracked.split(b'\0') if path)
    rows = []
    digest = hashlib.sha256()
    for status, old_path, path, diff in sorted(entries, key=lambda item: item[2]):
        if excluded(path) and excluded(old_path):
            continue
        if status == '?':
            diff = git(root, 'diff', *options, '--no-index', '--unified=0', '--inter-hunk-context=0',
                       '--', '/dev/null', str(root / path), allowed=(0, 1))
        digest.update(status.encode() + b'\0' + os.fsencode(old_path) + b'\0' + os.fsencode(path) + b'\0' + diff)
        hunks = []
        for match in re.finditer(rb'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', diff, re.MULTILINE):
            a, ac, b, bc = match.groups()
            hunks.append((int(a), int(ac) if ac is not None else 1, int(b), int(bc) if bc is not None else 1))
        binary = b'\nBinary files ' in diff or b'\nGIT binary patch\n' in diff
        added = sum(hunk[3] for hunk in hunks)
        removed = sum(hunk[1] for hunk in hunks)
        rows.append((status, old_path, path, binary, added, removed, ranges(hunks, 0), ranges(hunks, 1)))
    return root, base, head, digest.hexdigest(), rows


def main():
    parser = argparse.ArgumentParser(
        prog='scripts/changes.sh',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description='Write a task change map from a starting Git commit to the current working tree.',
        epilog='''Includes committed changes since the starting commit, staged and unstaged changes,
and nonignored untracked files. Excludes docs/tasks/ in every root.
Reports the net change: paths, additions, deletions and changed line ranges, without patch text.
Writes docs/tasks/task<ID>/changes.md for a task ID, or <task-folder>/changes.md for a path.
The task folder must already exist. Requires Git and Python 3.

Examples (run from your workspace):
  bash scripts/changes.sh task1 --base abc1234
  bash scripts/changes.sh 1 --base abc1234
  bash scripts/changes.sh docs/tasks/task1 --root . --base abc1234
  bash scripts/changes.sh task1 --root . --base abc1234 --root ./other --base def5678

Use the task's original starting commit again on later runs; do not move the baseline to HEAD.'''
    )
    parser.add_argument('task_folder', metavar='TASK', help='Task ID (1 or task1) or an existing task-folder path')
    parser.add_argument('--root', action='append', metavar='PATH', help='Git root (default: current repository); repeat with one --base per root')
    parser.add_argument('--base', action='append', required=True, metavar='COMMIT', help='Starting Git commit hash or ref; one per root, in the same order')
    args = parser.parse_args()
    args.root = args.root or ['.']
    if len(args.root) != len(args.base):
        parser.error('Supply exactly one --base for each --root, in the same order.')
    task_id = re.fullmatch(r'(?:task)?([0-9]+)', args.task_folder)
    if task_id:
        workspace = Path(os.fsdecode(git(Path.cwd(), 'rev-parse', '--show-toplevel')).strip())
        task = workspace / 'docs/tasks' / ('task' + task_id.group(1))
    else:
        task = Path(args.task_folder).resolve()
    if not task.is_dir():
        parser.error('The named task folder must already exist.')
    results = [inspect_root(root, base) for root, base in zip(args.root, args.base)]
    if len({result[0] for result in results}) != len(results):
        parser.error('Each Git root must be listed only once.')
    for root, *_ in results:
        try:
            relative = (task / 'changes.md').relative_to(root).as_posix()
        except ValueError:
            continue
        if not excluded(relative):
            parser.error('Within a scanned root, the output task folder must be under docs/tasks/.')
    now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
    report = ['# Changes', '', f'Generated: {now}', '', f'Task folder: {cell(task)}', '',
              'Each reviewer uses this map and the task records to choose relevant source and check coverage.',
              'Counts measure edit size; determine intent, correctness and risk from the task documents,',
              'current source and targeted diffs. Follow relevant dependencies beyond the listed ranges.', '',
              'Comparison: the net difference from each fixed starting commit to its current working tree,',
              'including committed, staged, unstaged and nonignored untracked changes. Edits later undone',
              'cancel out. Each root excludes `docs/tasks/`; nested independent repositories need their own root.', '',
              '## How to read the file tables', '',
              'Paths are JSON-quoted and relative to the root named above each table.',
              'Change labels each file as New, Deleted, Updated, Moved, Copied or Type changed.',
              'The label describes the overall change across committed and uncommitted work.', '',
              '| Change | Meaning |',
              '|---|---|',
              '| Updated | File modified, including content or permissions. |',
              '| New | File added, including nonignored untracked files. |',
              '| Deleted | File deleted since the starting commit. |',
              '| Moved (`R<n>`) | Renamed; the number is Git\'s similarity percentage (`R100` = identical content). |',
              '| Copied (`C<n>`) | Copied, if detected by Git; the number is the similarity percentage. |',
              '| Type changed | File type changed, such as a regular file becoming a symlink. |', '',
              'Added and Removed count lines relative to the starting commit. Changed is their sum:',
              'replacing one line counts as one addition and one removal, or two changed lines.',
              'Binary counts are `—`; binary files still count toward the file total.',
              'Empty files, pure renames and permission-only changes can have zero changed lines.', '',
              'Original lines refer to the file at the starting commit; Current lines refer to the file on disk.',
              'Line numbers start at 1 and ranges are inclusive (`5-8` means lines 5 through 8).',
              '`after N` marks an insertion/deletion anchor with no lines on that side; `after 0` means',
              'before the first line. `—` means no changed range; `binary` means ranges are unavailable.', '',
              '## Snapshot identity', '',
              'Starting commit is the fixed comparison baseline. Snapshot HEAD is the checked-out commit',
              'when the map was generated; uncommitted edits can change while HEAD stays the same.',
              'Content fingerprint is a SHA-256 of the collected paths, statuses and Git diff data.',
              'To check freshness, regenerate with the same roots and starting commits and compare HEAD',
              'and fingerprints with those recorded for the review round.', '',
              '## Roots', '', '| Root | Starting commit | Snapshot HEAD | Content fingerprint |',
              '|---|---|---|---|']
    for root, base, head, fingerprint, _ in results:
        report.append(f'| {cell(root)} | {base} | {head} | {fingerprint} |')
    total_files = total_added = total_removed = total_binary = 0
    for root, _, _, _, rows in results:
        report.extend(['', f'## Root {cell(root)}', '',
                       '| Path | Change | Added | Removed | Changed | Original lines | Current lines |',
                       '|---|---|---:|---:|---:|---|---|'])
        added_sum = removed_sum = binary_sum = 0
        for status, old, path, binary, added, removed, old_lines, new_lines in rows:
            counts = ('—', '—', '—') if binary else (str(added), str(removed), str(added + removed))
            if binary:
                old_lines = new_lines = 'binary'
            report.append(f'| {cell(path)} | {change_kind(status)} | {counts[0]} | {counts[1]} | {counts[2]} | {old_lines} | {new_lines} |')
            added_sum += added
            removed_sum += removed
            binary_sum += binary
        if not rows:
            report.append('| — | no changes | 0 | 0 | 0 | — | — |')
        report.extend(['', f'{len(rows)} files changed, {added_sum} insertions(+), {removed_sum} deletions(-); {binary_sum} binary files.'])
        total_files += len(rows)
        total_added += added_sum
        total_removed += removed_sum
        total_binary += binary_sum
    report.extend(['', '## Total', '',
                   f'{total_files} files changed, {total_added} insertions(+), {total_removed} deletions(-); {total_binary} binary files.', ''])
    # Collect every root successfully before replacing the shared map.
    output = task / 'changes.md'
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=task, delete=False) as stream:
            temporary = Path(stream.name)
            stream.write('\n'.join(report))
        temporary.replace(output)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    print(output)


try:
    main()
except (ValueError, OSError) as error:
    print(f'changes.sh: {error}', file=sys.stderr)
    sys.exit(1)
PY
