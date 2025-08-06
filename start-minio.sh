#!/bin/bash

# MinIO Startup Script for BoomersHub

echo "🚀 Starting MinIO for BoomersHub..."

# Create MinIO data directory if it doesn't exist
echo "📁 Creating MinIO data directory..."
mkdir -p ~/minio/data

# Check if MinIO container is already running
if docker ps | grep -q minio; then
    echo "✅ MinIO is already running"
    echo "🌐 MinIO Console: http://localhost:9090"
    echo "🔑 Username: root"
    echo "🔑 Password: password"
    exit 0
fi

# Check if MinIO container exists but is stopped
if docker ps -a | grep -q minio; then
    echo "🔄 Starting existing MinIO container..."
    docker start minio
else
    echo "🐳 Creating and starting MinIO container..."
    docker run \
        -p 9000:9000 \
        -p 9090:9090 \
        --name minio \
        -v ~/minio/data:/data \
        -e "MINIO_ROOT_USER=root" \
        -e "MINIO_ROOT_PASSWORD=password" \
        -d \
        quay.io/minio/minio server /data --console-address ":9090"
fi

# Wait for MinIO to start
echo "⏳ Waiting for MinIO to start..."
sleep 5

# Check if MinIO is running
if docker ps | grep -q minio; then
    echo "✅ MinIO started successfully!"
    echo ""
    echo "🌐 MinIO Console: http://localhost:9090"
    echo "🔑 Username: root"
    echo "🔑 Password: password"
    echo ""
    echo "📦 API Endpoint: http://localhost:9000"
    echo "🔑 Access Key: root"
    echo "🔑 Secret Key: password"
    echo ""
    echo "📝 Next steps:"
    echo "1. Open MinIO console and create 'boomershub' bucket"
    echo "2. Upload images to the bucket using property IDs as folders"
    echo "3. Start your application server"
else
    echo "❌ Failed to start MinIO"
    echo "Check Docker logs: docker logs minio"
    exit 1
fi 