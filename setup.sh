#!/bin/bash

# BoomersHub Task - Setup Script
# This script will set up the full-stack application

set -e

echo "🚀 BoomersHub Task - Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install:all

# Create .env file for server if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo ""
    echo "🔧 Creating server environment file..."
    cp server/env.example server/.env
    echo "✅ Created server/.env"
    echo "⚠️  Please update the database credentials in server/.env"
else
    echo "✅ Server environment file already exists"
fi

# Build shared package
echo ""
echo "🔨 Building shared package..."
cd shared && npm run build && cd ..

# Build server
echo ""
echo "🔨 Building server..."
cd server && npm run build && cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update database credentials in server/.env"
echo "2. Start the database (MySQL or Docker)"
echo "3. Run database migrations: cd server && npm run db:migrate"
echo "4. Seed the database: cd server && npm run db:seed"
echo "5. Start development servers: npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:3001"
echo "   - Health Check: http://localhost:3001/api/health"
echo ""
echo "📚 For more information, see README.md" 