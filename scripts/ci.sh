#!/usr/bin/env bash
# An unwired gate starter.
#
# Configure each repository's actual full gate in docs/instructions/workspace.md. If this script is that
# gate, wire the project's required checks here. It must exit non-zero on any failure and must not silently
# skip required checks; see docs/instructions/implementation/testing.md.
#
# It exits non-zero out of the box, on purpose: a gate that cannot fail is not a gate.
set -euo pipefail

echo "scripts/ci.sh: no tests wired yet — add them here." >&2
exit 1
