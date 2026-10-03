#!/usr/bin/env bash
# Makes the web images from the originals in assets/source/.
# Needs macOS `sips` and `cwebp` (install with: brew install webp).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets/source
OUT=src/assets/images
PUB=public
mkdir -p "$OUT" "$PUB"

cwebp -quiet -q 85 -resize 120 0  "$SRC/logo.jpg"        -o "$OUT/logo.webp"
cwebp -quiet -q 75 -resize 640 0  "$SRC/house.jpg"       -o "$OUT/hero-house-640.webp"
cwebp -quiet -q 75                "$SRC/house.jpg"       -o "$OUT/hero-house-1024.webp"
cwebp -quiet -q 80 -resize 800 0  "$SRC/report.jpg"      -o "$OUT/report-sample-800.webp"
cwebp -quiet -q 80 -resize 1200 0 "$SRC/report.jpg"      -o "$OUT/report-sample-1200.webp"
cwebp -quiet -q 80 -resize 960 0  "$SRC/video-thumb.jpg" -o "$OUT/video-thumb.webp"

# Square icons: pad the logo to a square with the brand blue, then resize.
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
sips -s format png --padToHeightWidth 886 886 --padColor 243292 "$SRC/logo.jpg" --out "$TMP/logo-square.png" >/dev/null
sips -z 32 32   "$TMP/logo-square.png" --out "$PUB/favicon-32.png" >/dev/null
sips -z 180 180 "$TMP/logo-square.png" --out "$PUB/apple-touch-icon.png" >/dev/null

# Open Graph image: a center crop of the house photo at about 1.91:1.
sips -c 496 948 "$SRC/house.jpg" --out "$PUB/og-image.jpg" >/dev/null

echo "Done."
