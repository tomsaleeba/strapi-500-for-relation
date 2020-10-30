#!/bin/bash
set -euo pipefail
cd `dirname "$0"`

port=${PORT:-1337}

echo "starting docker postgres"
containerId=$(docker run \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=strapi \
  -e POSTGRES_USER=postgres \
  -p 45432:5432 \
  -d \
  postgres:12)

trap "docker rm -fv $containerId" EXIT

sleep 5

function doTest {
  sleep 10 # hopefully this is long enough

  echo "doing test"
  curl \
    localhost:$port/employees \
    -H 'content-type:application/json' \
    -d '{"department":"99a"}'
}
doTest &

echo "starting strapi"
yarn develop
