#!/usr/bin/env bash
set -euo pipefail

studio_url="http://127.0.0.1:4319/"
studio_log="/tmp/nathan-tutors-content-studio.log"

if curl --fail --silent --show-error "$studio_url" >/dev/null 2>&1; then
  exit 0
fi

nohup npm run content-editor -- --no-open >"$studio_log" 2>&1 &

for _ in $(seq 1 30); do
  if curl --fail --silent "$studio_url" >/dev/null 2>&1; then
    exit 0
  fi
  sleep 1
done

cat "$studio_log"
exit 1
