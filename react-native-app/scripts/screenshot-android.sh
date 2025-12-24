#!/usr/bin/env bash
set -euo pipefail

out="${1:-}"
if [[ -z "${out}" ]]; then
  echo "Usage: $(basename "$0") <output.png>" >&2
  echo "Example: $(basename "$0") ../screenshots/react-native-android/setup.png" >&2
  exit 2
fi

mkdir -p "$(dirname "${out}")"

if ! command -v adb >/dev/null 2>&1; then
  echo "adb not found. Install Android platform-tools and ensure adb is on PATH." >&2
  exit 1
fi

# Capture the emulator/device screen as a PNG.
adb exec-out screencap -p > "${out}"
echo "Saved: ${out}"

