#!/bin/bash

# MCHostPanel Startup Script

echo "🚀 Starting MCHostPanel..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📄 Creating backend environment file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please configure backend/.env with your Pterodactyl settings"
fi

if [ ! -f frontend/.env ]; then
    echo "📄 Creating frontend environment file..."
    cp frontend/.env.example frontend/.env
fi

# Choose deployment mode
echo "Select deployment mode:"
echo "1) Development (with hot reload)"
echo "2) Production (with nginx and database)"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo "🔧 Starting in development mode..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    2)
        echo "🏭 Starting in production mode..."
        docker-compose up --build -d
        echo "✅ MCHostPanel is running!"
        echo "📱 Frontend: http://localhost:3000"
        echo "🔧 Backend API: http://localhost:8000"
        echo "📚 API Docs: http://localhost:8000/docs"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac