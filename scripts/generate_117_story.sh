#!/usr/bin/env bash
set -euo pipefail

OUT="${1:?usage: generate_117_story.sh OUTPUT.mp4}"
mkdir -p "$(dirname "$OUT")"

DATE_LOCAL="$(TZ=Asia/Jerusalem date +%F)"
DAY="$(TZ=Asia/Jerusalem date +%j)"
SEED=$((10#$DAY))
FREQ1=$((105 + SEED % 25))
FREQ2=$((210 + SEED % 47))
SHIFT=$((8 + SEED % 15))
RATE=$((24 + SEED % 7))

FONT_CANDIDATES=(
  /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
  /usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf
  /usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf
)
FONT="${FONT_CANDIDATES[$((SEED % ${#FONT_CANDIDATES[@]}))]}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg missing" >&2
  exit 10
fi
if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ffprobe missing" >&2
  exit 11
fi
if [[ ! -f "$FONT" ]]; then
  echo "font missing: $FONT" >&2
  exit 12
fi

ffmpeg -hide_banner -loglevel error -y   -f lavfi -i "color=c=white:s=1080x1920:r=${RATE}:d=6"   -f lavfi -i "sine=frequency=${FREQ1}:sample_rate=48000:duration=6"   -f lavfi -i "sine=frequency=${FREQ2}:sample_rate=48000:duration=6"   -f lavfi -i "anoisesrc=color=pink:amplitude=0.035:sample_rate=48000:duration=6"   -filter_complex "
    [0:v]
      drawtext=fontfile='${FONT}':text='117':fontsize=500:fontcolor=gray@0.24:
        x='(w-text_w)/2+${SHIFT}+18*sin(2*PI*t/2.9)':
        y='(h-text_h)/2-18+12*cos(2*PI*t/3.7)',
      drawtext=fontfile='${FONT}':text='117':fontsize=500:fontcolor=black:
        x='(w-text_w)/2+10*sin(2*PI*t/2.7)':
        y='(h-text_h)/2-24+8*cos(2*PI*t/3.1)',
      noise=alls=1.0:allf=t,
      format=yuv420p[v];
    [1:a][2:a][3:a]
      amix=inputs=3:weights='1 0.45 0.18':normalize=0,
      tremolo=f=4.7:d=0.28,
      afade=t=in:st=0:d=0.25,
      afade=t=out:st=5.45:d=0.55,
      volume=0.72[a]
  "   -map "[v]" -map "[a]"   -c:v libx264 -preset medium -crf 20 -profile:v high -level 4.1   -c:a aac -b:a 128k -ar 48000 -ac 2   -movflags +faststart -shortest "$OUT"

# Hard QA: dimensions, codecs, duration, audio presence, decodability.
V_CODEC="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$OUT")"
A_CODEC="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$OUT")"
WH="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$OUT")"
DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")"

[[ "$V_CODEC" == "h264" ]] || { echo "QA fail video codec=$V_CODEC" >&2; exit 21; }
[[ "$A_CODEC" == "aac" ]] || { echo "QA fail audio codec=$A_CODEC" >&2; exit 22; }
[[ "$WH" == "1080x1920" ]] || { echo "QA fail dimensions=$WH" >&2; exit 23; }
awk -v d="$DUR" 'BEGIN { exit !(d >= 5.8 && d <= 6.2) }' || { echo "QA fail duration=$DUR" >&2; exit 24; }
ffmpeg -v error -i "$OUT" -f null - >/dev/null 2>&1 || { echo "QA fail full decode" >&2; exit 25; }

SHA="$(sha256sum "$OUT" | awk '{print $1}')"
SIZE="$(stat -c%s "$OUT")"
META="${OUT%.mp4}.json"
cat > "$META" <<JSON
{
  "date": "$DATE_LOCAL",
  "kind": "117-daily-emergency-fallback",
  "width": 1080,
  "height": 1920,
  "duration_seconds": 6,
  "video_codec": "h264",
  "audio_codec": "aac",
  "audio_present": true,
  "sha256": "$SHA",
  "bytes": $SIZE,
  "source": "procedural-original",
  "safe_for_story": true
}
JSON

echo "PASS $OUT $SHA"
