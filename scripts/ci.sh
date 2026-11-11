#!/usr/bin/env bash
# The gate.
#
# This is the one entry point `sdd step 3` runs (docs/instructions/implementation/testing.md) and the one
# CI runs — never a hand-assembled list of tools. Put your whole check here: lint, typecheck, unit, e2e,
# whatever proves the work. It must exit non-zero on any failure and must have no path that runs a subset
# silently.
#
# It exits non-zero out of the box, on purpose: a gate that cannot fail is not a gate.
set -euo pipefail

echo "scripts/ci.sh: no tests wired yet — add them here." >&2
exit 1
