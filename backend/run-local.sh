
export HOST="127.0.0.1"
export PORT="3001"
export BACKEND_API_KEY="super_secret_key"
export REDIS_PASSWORD="super_secret_redis_pw"
export REDIS_MASTER_SERVICE_HOST="127.0.0.1"
export REDIS_MASTER_SERVICE_PORT="6379"
export REDIS_REPLICAS_SERVICE_HOST="127.0.0.1"
export REDIS_REPLICAS_SERVICE_PORT="6380"

echo "Starting Rust backend with local configuration..."
echo "Backend will be available at: http://127.0.0.1:3001"
echo "API Key: super_secret_key"
echo ""

cargo run