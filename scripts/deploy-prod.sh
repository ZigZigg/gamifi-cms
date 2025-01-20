echo "Build image"
docker build -f Dockerfile.staging --pull -t web-fe:production-latest .

echo "Run docker"
docker rm -f sac-web || true
docker run -p 4401:80 -d --name sac-web web-fe:production-latest

echo "Remove old docker data"
docker system prune -f

echo "Finished copying the build files"