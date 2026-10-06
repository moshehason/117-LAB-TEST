#!/usr/bin/env bash
set -euo pipefail

OUT="${1:?usage: generate_117_story.sh OUTPUT.mp4}"
mkdir -p "$(dirname "$OUT")"
DATE_LOCAL="$(TZ=Asia/Jerusalem date +%F)"

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg missing" >&2; exit 10; }
command -v ffprobe >/dev/null 2>&1 || { echo "ffprobe missing" >&2; exit 11; }
python3 -c 'import PIL' >/dev/null 2>&1 || { echo "Pillow missing" >&2; exit 12; }

python3 "$(dirname "$0")/generate_weird_117.py" "$OUT"

V_CODEC="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$OUT")"
A_CODEC="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$OUT")"
WH="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$OUT")"
DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")"

[[ "$V_CODEC" == "h264" ]] || { echo "QA fail video codec=$V_CODEC" >&2; exit 21; }
[[ "$A_CODEC" == "aac" ]] || { echo "QA fail audio codec=$A_CODEC" >&2; exit 22; }
[[ "$WH" == "1080x1920" ]] || { echo "QA fail dimensions=$WH" >&2; exit 23; }
awk -v d="$DUR" 'BEGIN { exit !(d >= 6.8 && d <= 7.2) }' || { echo "QA fail duration=$DUR" >&2; exit 24; }
ffmpeg -v error -i "$OUT" -f null - >/dev/null 2>&1 || { echo "QA fail full decode" >&2; exit 25; }

SHA="$(sha256sum "$OUT" | awk '{print $1}')"
SIZE="$(stat -c%s "$OUT")"
META="${OUT%.mp4}.json"
cat > "$META" <<JSON
{
  "date": "$DATE_LOCAL",
  "kind": "117-daily-weird-organism",
  "width": 1080,
  "height": 1920,
  "duration_seconds": 7,
  "video_codec": "h264",
  "audio_codec": "aac",
  "audio_present": true,
  "sha256": "$SHA",
  "bytes": $SIZE,
  "source": "procedural-original",
  "safe_for_story": true,
  "concept": "black 117 organism with fluorescent pink internal tissue and tendrils"
}
JSON

echo "PASS $OUT $SHA"
