#!/usr/bin/env bash
# Imports the Symptoms landing page (https://www.mayoclinic.org/symptoms) to
# content/health-library/symptoms.plain.html: H1, Symptom Checker / First Aid tiles, the A-Z list
# of symptoms linked to their medical-symptom documents (/health-library/symptoms/<slug>, built by
# tools/importer/structured/build-medical-symptom.mjs) and the donation banner.
#
# Usage: import-symptoms-index.sh [<snapshots-dir>]
#   <snapshots-dir>  saved source page as <dir>/www.mayoclinic.org/symptoms.html, used when the live
#                    page is bot-protected (default migration-work/symptoms/landing-snapshot)
# BULK_IMPORT may point at run-bulk-import.js and BUNDLE at aem-import-bundle.sh (import tooling).
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
SNAPSHOTS="${1:-$REPO/migration-work/symptoms/landing-snapshot}"
SKILL=/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts
BULK_IMPORT="${BULK_IMPORT:-$SKILL/run-bulk-import.js}"
BUNDLE="${BUNDLE:-$SKILL/aem-import-bundle.sh}"
STAGING="$REPO/migration-work/symptoms/landing-staging"
OUT="$REPO/content/health-library/symptoms.plain.html"
mkdir -p "$STAGING"

cd "$REPO"
bash "$BUNDLE" --importjs tools/importer/import-symptoms-index.js > /dev/null
WORKSPACE_PATH="$STAGING" node "$BULK_IMPORT" --force --html-dir "$SNAPSHOTS" \
  --import-script "$REPO/tools/importer/import-symptoms-index.bundle.js" \
  --urls tools/importer/urls-symptoms-index.txt \
  | grep -E "Saved content|Failures|completeness" || true

# The importer leaves the share image empty when the DA media copy can't be fetched without a
# login: use the shared Mayo Clinic card, as on the other migrated pages.
node -e '
const fs = require("fs");
const [from, to] = process.argv.slice(1);
const card = "https://content.da.live/charronadobe/mayo-rdda/media/mayoclinic/mc_twittercard_120x120.jpg";
const html = fs.readFileSync(from, "utf8").replace("<div>Image</div><div><picture><img src=\"\"", `<div>Image</div><div><picture><img src="${card}"`);
fs.writeFileSync(to, html);
' "$STAGING/content/health-library/symptoms.plain.html" "$OUT"
echo "wrote $OUT"
