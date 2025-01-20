#!/bin/bash

SERVER_FOLDER_DIR="/home/dev/SAC/fe"

echo "Deploying to Dev server"

cd ${SERVER_FOLDER_DIR}

echo "Pull docker compose"
docker pull registry.savvycom.vn/kgi-sac/web:develop-release

echo "Run docker"
docker rm -f sac-web-dev || true
docker run -p 4174:80 -d --name sac-web-dev registry.savvycom.vn/kgi-sac/web:develop-release

echo "Remove old docker data"
docker system prune -f

echo "Finished copying the build files"