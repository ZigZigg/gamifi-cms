echo "Build image"
docker build -f Dockerfile.staging --pull -t registry.savvycom.vn/kgi-sac/web:stage-release .

echo "Run docker"
docker rm -f sac-web-stage || true
docker run -p 4402:80 -d --name sac-web-stage registry.savvycom.vn/kgi-sac/web:stage-release

echo "Remove old docker data"
docker system prune -f

echo "Finished copying the build files"