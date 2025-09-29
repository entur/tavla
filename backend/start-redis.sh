#!/bin/bash

# Script to start Redis master/replica setup for local development

echo "Starting Redis Master and Replica for local development..."

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "Redis is not installed. Install Redis to continue."
    exit 1
fi

# Kill any existing Redis processes
echo "Stopping any existing Redis processes..."
pkill redis-server 2>/dev/null || true

# Wait a bit for processes to stop
sleep 2

# Start Redis master in background
echo "Starting Redis Master on port 6379..."
redis-server $(dirname "$0")/redis-master.conf --daemonize yes

# Wait for master to start
sleep 2

# Start Redis replica in background
echo "Starting Redis Replica on port 6380..."
redis-server $(dirname "$0")/redis-replica.conf --daemonize yes

# Wait for replica to start
sleep 2

# Initialize active_boards counter
echo "Initializing active_boards counter..."
redis-cli -p 6379 -a super_secret_redis_pw SET active_boards 0

echo "Redis setup complete!"
echo "Master: localhost:6379"
echo "Replica: localhost:6380"
echo "Password: super_secret_redis_pw"
echo ""
echo "To stop Redis, run: pkill redis-server"