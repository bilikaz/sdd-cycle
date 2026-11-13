#!/usr/bin/env bash
# Run the application gate in this workspace's independent project checkout.
# Configure its checks and prerequisites in sdd/workspace.md.
set -euo pipefail
SDD_WORKSPACE_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
SDD_PROJECT_ROOT="$SDD_WORKSPACE_ROOT/project"
if ! SDD_GIT_ROOT="$(git -C "$SDD_PROJECT_ROOT" rev-parse --show-toplevel 2>/dev/null)"; then
  echo "scripts/ci.sh: project/ must be an independent Git checkout." >&2
  exit 1
fi
if [[ "$(cd -- "$SDD_GIT_ROOT" && pwd -P)" != "$(cd -- "$SDD_PROJECT_ROOT" && pwd -P)" ]]; then
  echo "scripts/ci.sh: project/ resolves to another Git root; initialize it or clone the project there." >&2
  exit 1
fi
if [[ ! -f "$SDD_PROJECT_ROOT/scripts/ci.sh" ]]; then
  echo "scripts/ci.sh: no project/scripts/ci.sh gate; configure the project's full gate in sdd/workspace.md." >&2
  exit 1
fi
cd -- "$SDD_PROJECT_ROOT"
exec bash scripts/ci.sh "$@"
