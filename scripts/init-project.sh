#!/usr/bin/env bash
# Initialize this workspace: its local map (sdd/workspace.md) and project checkout, copying missing starter files.
# Existing project files, Git history and configuration are preserved. No commits or remotes are created.
set -euo pipefail
SDD_WORKSPACE_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
exec python3 - "$SDD_WORKSPACE_ROOT" "$@" <<'PY'
from pathlib import Path
import shutil
import subprocess
import sys

if len(sys.argv) != 2:
    print('Usage: bash scripts/init-project.sh', file=sys.stderr)
    sys.exit(2)
workspace = Path(sys.argv[1])
workspace_map = workspace / 'sdd/workspace.md'
if not workspace_map.exists():
    shutil.copyfile(workspace / 'sdd/templates/workspace.md', workspace_map)
    print(f'Workspace map created: {workspace_map}')
project = workspace / 'project'
project.mkdir(exist_ok=True)
if not (project / '.git').exists():
    subprocess.run(['git', '-C', str(project), 'init'], check=True)
actual = subprocess.check_output(['git', '-C', str(project), 'rev-parse', '--show-toplevel'], text=True).strip()
if Path(actual).resolve() != project.resolve():
    sys.exit('init-project.sh: project/ must own its Git repository.')
starter = workspace / 'sdd/templates/project'
for source in sorted(starter.rglob('*')):
    if not source.is_file():
        continue
    if source.is_relative_to(starter / 'docs/conventions-platform'):
        continue
    target = project / source.relative_to(starter)
    if target.exists() or target.is_symlink():
        continue
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('xb') as output:
        output.write(source.read_bytes())
    shutil.copymode(source, target)
print(f'Project ready: {project}')
PY
