#!/usr/bin/env bash
set -euo pipefail

# This script converts packages/sphinx-isoflow from an inline directory
# into a git submodule of bngoy/sphinx-isoflow.
#
# Prerequisites:
#   - git push access to https://github.com/bngoy/sphinx-isoflow
#   - Run from the isoflow repo root
#
# Usage: bash scripts/setup-sphinx-submodule.sh

BRANCH="claude/isoflow-viewer-embed-GX4Bj"
REMOTE_URL="https://github.com/bngoy/sphinx-isoflow.git"
SUBMODULE_PATH="packages/sphinx-isoflow"
TMPDIR=$(mktemp -d)

echo "==> Copying sphinx-isoflow content to temp dir..."
cp -r "${SUBMODULE_PATH}"/* "${TMPDIR}/"

echo "==> Initialising temp repo and pushing to ${REMOTE_URL} on branch ${BRANCH}..."
cd "${TMPDIR}"
git init
git checkout -b "${BRANCH}"
git add -A
git commit -m "feat: initial sphinx-isoflow extension

Sphinx directive for embedding interactive Isoflow diagrams in docs."
git remote add origin "${REMOTE_URL}"
git push -u origin "${BRANCH}"

COMMIT_SHA=$(git rev-parse HEAD)
cd - > /dev/null

echo "==> Removing inline directory from isoflow repo..."
git rm -rf "${SUBMODULE_PATH}"

echo "==> Adding submodule..."
git submodule add -b "${BRANCH}" "${REMOTE_URL}" "${SUBMODULE_PATH}"

echo "==> Committing submodule conversion..."
git add .gitmodules "${SUBMODULE_PATH}"
git commit -m "refactor: convert packages/sphinx-isoflow to git submodule

Points to bngoy/sphinx-isoflow @ ${COMMIT_SHA} (branch ${BRANCH})"

echo "==> Done. Submodule set up at ${SUBMODULE_PATH}"
echo "    Run 'git push' to update the isoflow remote."

rm -rf "${TMPDIR}"
