#!/usr/bin/env bash
set -euo pipefail

platform="${1:-}"
if [[ "${platform}" != "ios" && "${platform}" != "android" ]]; then
  echo "Usage: $(basename "$0") <ios|android>" >&2
  exit 2
fi

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
repo_root="$(cd "${project_dir}/.." && pwd)"

source_dir="${project_dir}/.maestro-output/screenshots"
dest_dir="${repo_root}/screenshots/react-native-${platform}"

if [[ ! -d "${source_dir}" ]]; then
  echo "No Maestro screenshots found at: ${source_dir}" >&2
  echo "Run: maestro test maestro/verify-screens.yaml" >&2
  exit 1
fi

mkdir -p "${dest_dir}"

shopt -s nullglob
pngs=("${source_dir}"/*.png)
shopt -u nullglob

if [[ ${#pngs[@]} -eq 0 ]]; then
  echo "No PNGs found in: ${source_dir}" >&2
  exit 1
fi

cp -f "${source_dir}"/*.png "${dest_dir}/"
echo "Exported ${#pngs[@]} screenshot(s) -> ${dest_dir}"

