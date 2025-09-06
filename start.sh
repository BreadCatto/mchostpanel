#!/bin/bash

# MCHostPanel Startup Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

echo ""
print_color $CYAN "╔══════════════════════════════════════════════════════════════╗"
print_color $CYAN "║                    MCHostPanel                               ║"
print_color $CYAN "║          Professional Minecraft Server Hosting Panel        ║"
print_color $CYAN "╚══════════════════════════════════════════════════════════════╝"
echo ""

print_color $BLUE "Choose your setup method:"
echo ""
echo "1) Interactive Setup - Complete guided configuration"
echo "   • SSL/HTTPS configuration"
echo "   • Domain and port setup"
echo "   • Database selection (SQLite/PostgreSQL)"
echo "   • Pterodactyl integration"
echo "   • Production-ready deployment"
echo ""
echo "2) Quick Start - Simple development setup"
echo "   • Basic configuration with defaults"
echo "   • Development mode only"
echo "   • Manual configuration required"
echo ""

while true; do
    read -p "Enter your choice [1-2]: " choice
    case $choice in
        1)
            print_color $GREEN "🚀 Starting Interactive Setup..."
            echo ""
            exec ./setup.sh
            ;;
        2)
            print_color $GREEN "🚀 Starting Quick Setup..."
            echo ""
            break
            ;;
        ""|q|Q|quit|exit)
            print_color $YELLOW "👋 Goodbye!"
            exit 0
            ;;
        *)
            print_color $RED "❌ Invalid choice. Please enter 1 or 2."
            ;;
    esac
done

# Quick Start (original functionality)
print_color $BLUE "🔍 Checking prerequisites..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_color $RED "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_color $RED "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_color $GREEN "✅ Prerequisites check passed!"
echo ""

# Create environment files if they don't exist
if [ ! -f backend/.env ]; then
    print_color $YELLOW "📄 Creating backend environment file..."
    cp backend/.env.example backend/.env
    print_color $YELLOW "⚠️  Please configure backend/.env with your Pterodactyl settings"
fi

if [ ! -f frontend/.env ]; then
    print_color $YELLOW "📄 Creating frontend environment file..."
    cp frontend/.env.example frontend/.env
fi

# Choose deployment mode
print_color $BLUE "Select deployment mode:"
echo "1) Development (with hot reload)"
echo "2) Production (with nginx and database)"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        print_color $YELLOW "🔧 Starting in development mode..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    2)
        print_color $YELLOW "🏭 Starting in production mode..."
        docker-compose up --build -d
        echo ""
        print_color $GREEN "✅ MCHostPanel is running!"
        print_color $CYAN "📱 Frontend: http://localhost:3000"
        print_color $CYAN "🔧 Backend API: http://localhost:8000"
        print_color $CYAN "📚 API Docs: http://localhost:8000/docs"
        ;;
    *)
        print_color $RED "❌ Invalid choice"
        exit 1
        ;;
esac