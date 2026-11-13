#!/usr/bin/env bash
# An unwired gate starter.
#
# Configure each repository's actual full gate in the outer workspace's sdd/workspace.md. If this script is that
# gate, wire the project's required checks here. It must exit non-zero on any failure and must not silently
# skip required checks; see sdd/instructions/implementation/testing.md in that workspace.
#
# It exits non-zero out of the box, on purpose: a gate that cannot fail is not a gate.
set -euo pipefail

echo "scripts/ci.sh: no tests wired yet — add them here." >&2
exit 1
