echo "Build image"
docker build -f Dockerfile --pull -t registry.savvycom.vn/kgi-sac/web:develop-release .

echo "Run docker"
docker rm -f sac-web-dev || true
docker run -p 4174:80 -d --name sac-web-dev registry.savvycom.vn/kgi-sac/web:develop-release

echo "Remove old docker data"
docker system prune -f

echo "Finished copying the build files"