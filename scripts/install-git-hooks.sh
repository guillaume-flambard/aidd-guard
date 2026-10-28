#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
[ -e .git ] || exit 0
[ "${CI:-}" = "true" ] && exit 0
current="$(git config --local --get core.hooksPath || true)"
if [ -n "$current" ] && [ "$current" != ".githooks" ]; then
  echo "git hooks: retaining custom core.hooksPath=$current"
  exit 0
fi
chmod +x .githooks/pre-commit
git config --local core.hooksPath .githooks
echo "git hooks: pre-commit enabled"
