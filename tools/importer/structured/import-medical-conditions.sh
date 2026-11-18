#!/bin/bash
# Imports condition ("Symptoms and causes") pages from mayoclinic.org as medical-condition structured
# documents (content/health-library/diseases-conditions/medical-condition/<slug>.plain.html).
#
#   1. runs the condition importer (tools/importer/import-condition.js) on the saved source pages into
#      a staging folder, migration-work/condition-staging, so no symptoms-causes page lands in content/
#   2. builds one structured document per page (build-medical-condition.mjs): schema check and
#      read-back included
#   3. registers the conditions (register-conditions.mjs), so other imports link to their documents
#
# Usage: import-medical-conditions.sh <urls-file> <snapshots-dir> [<out-dir>]
#   <urls-file>      one https://www.mayoclinic.org/diseases-conditions/<slug>/symptoms-causes/<id> per line
#   <snapshots-dir>  saved source pages (<dir>/www.mayoclinic.org/diseases-conditions/...)
#   <out-dir>        optional, default content/health-library/diseases-conditions/medical-condition
# BULK_IMPORT may point at run-bulk-import.js and BUNDLE at aem-import-bundle.sh (import tooling).
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
URLS="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
SNAPSHOTS="$(cd "$2" && pwd)"
OUT="${3:-$REPO/content/health-library/diseases-conditions/medical-condition}"
SKILL=/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts
BULK_IMPORT="${BULK_IMPORT:-$SKILL/run-bulk-import.js}"
BUNDLE="${BUNDLE:-$SKILL/aem-import-bundle.sh}"
STAGING="$REPO/migration-work/condition-staging"
mkdir -p "$STAGING"

cd "$REPO"
echo "1/3 importing $(grep -c . "$URLS") condition pages into $STAGING"
bash "$BUNDLE" --importjs tools/importer/import-condition.js > /dev/null
WORKSPACE_PATH="$STAGING" node "$BULK_IMPORT" --force --html-dir "$SNAPSHOTS" \
  --import-script "$REPO/tools/importer/import-condition.bundle.js" --urls "$URLS" \
  | grep -E "Saved content|Failures|completeness" || true

echo "2/3 building structured documents"
SLUGS=$(sed -E 's#.*/diseases-conditions/([^/]+)/.*#\1#' "$URLS" | paste -sd, -)
node tools/importer/structured/build-medical-condition.mjs --pages "$STAGING/content" \
  --snapshots "$SNAPSHOTS" --out "$OUT" --only "$SLUGS"

echo "3/3 registering the conditions"
node tools/importer/structured/register-conditions.mjs "$URLS"
echo "done: upload the new documents (and any new thumbnails in media/thumbnails) to DA, then re-import the A-Z letter pages so they link to them"
