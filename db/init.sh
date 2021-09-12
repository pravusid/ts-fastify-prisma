#!/usr/bin/env bash

export DEV_CONTAINER_NAME="ts-fp"

docker \
  run \
  -d \
  --name $DEV_CONTAINER_NAME \
  -p 3306:3306 \
  -v "$(pwd)"/scripts/:/docker-entrypoint-initdb.d/ \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
  -e MYSQL_USER=tfp \
  -e MYSQL_PASSWORD=test@tfp \
  -e MYSQL_DATABASE=tfp \
  -e LANG=C.UTF-8 \
  mariadb:latest \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

docker logs -f $DEV_CONTAINER_NAME
