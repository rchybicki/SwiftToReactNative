#!/usr/bin/env bash
set -euo pipefail

out="${1:-}"
if [[ -z "${out}" ]]; then
  echo "Usage: $(basename "$0") <output.png>" >&2
  echo "Example: $(basename "$0") ../screenshots/react-native-ios/setup.png" >&2
  exit 2
fi

mkdir -p "$(dirname "${out}")"

if ! command -v xcrun >/dev/null 2>&1; then
  echo "xcrun not found. Install Xcode Command Line Tools." >&2
  exit 1
fi

# Capture the currently booted simulator.
xcrun simctl io booted screenshot "${out}"
echo "Saved: ${out}"

