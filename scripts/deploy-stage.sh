#!/bin/bash

SERVER_FOLDER_DIR="/home/dev/SAC/stage/fe"

echo "Deploying to Staging server"

cd ${SERVER_FOLDER_DIR}

echo "Pull docker compose"
docker pull registry.savvycom.vn/kgi-sac/web:stage-release

echo "Run docker"
docker rm -f sac-web-stage || true
docker run -p 4402:80 -d --name sac-web-stage registry.savvycom.vn/kgi-sac/web:stage-release

echo "Remove old docker data"
docker system prune -f

echo "Finished copying the build files"