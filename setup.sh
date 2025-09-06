#!/bin/bash

# MCHostPanel Interactive Setup Script
# This script will guide you through setting up MCHostPanel based on your requirements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration variables
SETUP_MODE=""
USE_SSL=""
DOMAIN=""
USE_CUSTOM_PORT=""
FRONTEND_PORT="3000"
BACKEND_PORT="8000"
NGINX_HTTP_PORT="80"
NGINX_HTTPS_PORT="443"
DATABASE_TYPE=""
DB_NAME="mchostpanel"
DB_USER="mchostpanel"
DB_PASSWORD=""
PTERODACTYL_URL=""
PTERODACTYL_API_KEY=""
PTERODACTYL_ADMIN_TOKEN=""
SECRET_KEY=""
SSL_EMAIL=""
SSL_METHOD=""

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print header
print_header() {
    clear
    print_color $CYAN "╔══════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║                    MCHostPanel Setup                         ║"
    print_color $CYAN "║          Professional Minecraft Server Hosting Panel        ║"
    print_color $CYAN "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# Function to validate domain name
validate_domain() {
    local domain=$1
    if [[ $domain =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate email
validate_email() {
    local email=$1
    if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to generate random password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Function to generate secret key
generate_secret_key() {
    openssl rand -hex 32
}

# Function to check prerequisites
check_prerequisites() {
    print_header
    print_color $BLUE "🔍 Checking prerequisites..."
    echo ""

    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        print_color $YELLOW "⚠️  Warning: Running as root. This is not recommended for security reasons."
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_color $RED "❌ Setup cancelled."
            exit 1
        fi
        echo ""
    fi

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_color $RED "❌ Docker is not installed."
        print_color $YELLOW "Please install Docker first: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_color $GREEN "✅ Docker is installed"

    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_color $RED "❌ Docker Compose is not installed."
        print_color $YELLOW "Please install Docker Compose first: https://docs.docker.com/compose/install/"
        exit 1
    fi
    print_color $GREEN "✅ Docker Compose is installed"

    # Check if openssl is installed
    if ! command -v openssl &> /dev/null; then
        print_color $RED "❌ OpenSSL is not installed."
        print_color $YELLOW "Please install OpenSSL first."
        exit 1
    fi
    print_color $GREEN "✅ OpenSSL is installed"

    # Check Docker daemon
    if ! docker info &> /dev/null; then
        print_color $RED "❌ Docker daemon is not running."
        print_color $YELLOW "Please start Docker daemon first."
        exit 1
    fi
    print_color $GREEN "✅ Docker daemon is running"

    echo ""
    print_color $GREEN "🎉 All prerequisites are met!"
    echo ""
    read -p "Press Enter to continue..."
}

# Function to choose setup mode
choose_setup_mode() {
    print_header
    print_color $BLUE "🚀 Choose your deployment mode:"
    echo ""
    echo "1) Development - Quick setup for testing and development"
    echo "   • Uses SQLite database"
    echo "   • No SSL required"
    echo "   • Direct port access"
    echo "   • Hot reload enabled"
    echo ""
    echo "2) Production - Full production deployment"
    echo "   • Choose between SQLite or PostgreSQL"
    echo "   • SSL/HTTPS support"
    echo "   • Domain configuration"
    echo "   • Nginx reverse proxy"
    echo ""
    
    while true; do
        read -p "Enter your choice [1-2]: " choice
        case $choice in
            1)
                SETUP_MODE="development"
                print_color $GREEN "✅ Development mode selected"
                break
                ;;
            2)
                SETUP_MODE="production"
                print_color $GREEN "✅ Production mode selected"
                break
                ;;
            *)
                print_color $RED "❌ Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done
    echo ""
    read -p "Press Enter to continue..."
}

# Function to configure SSL
configure_ssl() {
    if [[ "$SETUP_MODE" == "development" ]]; then
        USE_SSL="false"
        return
    fi

    print_header
    print_color $BLUE "🔒 SSL/HTTPS Configuration:"
    echo ""
    print_color $YELLOW "SSL provides encrypted connections and is recommended for production."
    echo ""
    echo "Choose SSL configuration:"
    echo "1) No SSL - HTTP only (not recommended for production)"
    echo "2) Let's Encrypt - Free SSL certificates (recommended)"
    echo "3) Custom SSL - Provide your own certificates"
    echo ""

    while true; do
        read -p "Enter your choice [1-3]: " choice
        case $choice in
            1)
                USE_SSL="false"
                print_color $YELLOW "⚠️  HTTP only selected. This is not secure for production!"
                break
                ;;
            2)
                USE_SSL="true"
                SSL_METHOD="letsencrypt"
                print_color $GREEN "✅ Let's Encrypt SSL selected"
                break
                ;;
            3)
                USE_SSL="true"
                SSL_METHOD="custom"
                print_color $GREEN "✅ Custom SSL selected"
                break
                ;;
            *)
                print_color $RED "❌ Invalid choice. Please enter 1, 2, or 3."
                ;;
        esac
    done
    echo ""
    read -p "Press Enter to continue..."
}

# Function to configure domain
configure_domain() {
    print_header
    print_color $BLUE "🌐 Domain Configuration:"
    echo ""

    if [[ "$SETUP_MODE" == "development" ]]; then
        DOMAIN="localhost"
        USE_CUSTOM_PORT="true"
        print_color $GREEN "✅ Development mode: Using localhost with custom ports"
        echo ""
        read -p "Press Enter to continue..."
        return
    fi

    print_color $YELLOW "Enter your domain configuration:"
    echo ""

    # Get domain name
    while true; do
        read -p "Enter your domain name (e.g., myminecraft.com): " domain_input
        if [[ -z "$domain_input" ]]; then
            print_color $RED "❌ Domain name cannot be empty."
            continue
        fi
        
        if validate_domain "$domain_input"; then
            DOMAIN="$domain_input"
            print_color $GREEN "✅ Domain: $DOMAIN"
            break
        else
            print_color $RED "❌ Invalid domain format. Please enter a valid domain name."
        fi
    done

    echo ""
    print_color $BLUE "Port Configuration:"
    echo ""
    echo "Choose how users will access your panel:"
    echo "1) Standard ports - HTTP (80) and HTTPS (443)"
    echo "2) Custom ports - Specify custom port numbers"
    echo ""

    while true; do
        read -p "Enter your choice [1-2]: " choice
        case $choice in
            1)
                USE_CUSTOM_PORT="false"
                NGINX_HTTP_PORT="80"
                NGINX_HTTPS_PORT="443"
                print_color $GREEN "✅ Standard ports selected"
                break
                ;;
            2)
                USE_CUSTOM_PORT="true"
                echo ""
                read -p "Enter HTTP port (default 8080): " http_port
                NGINX_HTTP_PORT="${http_port:-8080}"
                
                if [[ "$USE_SSL" == "true" ]]; then
                    read -p "Enter HTTPS port (default 8443): " https_port
                    NGINX_HTTPS_PORT="${https_port:-8443}"
                fi
                print_color $GREEN "✅ Custom ports selected"
                break
                ;;
            *)
                print_color $RED "❌ Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done

    # SSL email for Let's Encrypt
    if [[ "$SSL_METHOD" == "letsencrypt" ]]; then
        echo ""
        while true; do
            read -p "Enter email for Let's Encrypt notifications: " email_input
            if validate_email "$email_input"; then
                SSL_EMAIL="$email_input"
                print_color $GREEN "✅ Email: $SSL_EMAIL"
                break
            else
                print_color $RED "❌ Invalid email format."
            fi
        done
    fi

    echo ""
    read -p "Press Enter to continue..."
}

# Function to configure database
configure_database() {
    print_header
    print_color $BLUE "🗄️  Database Configuration:"
    echo ""

    if [[ "$SETUP_MODE" == "development" ]]; then
        DATABASE_TYPE="sqlite"
        print_color $GREEN "✅ Development mode: Using SQLite database"
        echo ""
        read -p "Press Enter to continue..."
        return
    fi

    print_color $YELLOW "Choose your database:"
    echo ""
    echo "1) SQLite - Simple file-based database (good for small deployments)"
    echo "2) PostgreSQL - Advanced database with better performance (recommended for production)"
    echo ""

    while true; do
        read -p "Enter your choice [1-2]: " choice
        case $choice in
            1)
                DATABASE_TYPE="sqlite"
                print_color $GREEN "✅ SQLite selected"
                break
                ;;
            2)
                DATABASE_TYPE="postgresql"
                print_color $GREEN "✅ PostgreSQL selected"
                
                echo ""
                print_color $BLUE "PostgreSQL Configuration:"
                
                read -p "Database name (default: $DB_NAME): " db_name_input
                DB_NAME="${db_name_input:-$DB_NAME}"
                
                read -p "Database username (default: $DB_USER): " db_user_input
                DB_USER="${db_user_input:-$DB_USER}"
                
                while true; do
                    read -p "Database password (leave empty to generate): " db_pass_input
                    if [[ -z "$db_pass_input" ]]; then
                        DB_PASSWORD=$(generate_password)
                        print_color $GREEN "✅ Generated database password: $DB_PASSWORD"
                        break
                    else
                        DB_PASSWORD="$db_pass_input"
                        print_color $GREEN "✅ Database password set"
                        break
                    fi
                done
                break
                ;;
            *)
                print_color $RED "❌ Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done
    echo ""
    read -p "Press Enter to continue..."
}

# Function to configure Pterodactyl
configure_pterodactyl() {
    print_header
    print_color $BLUE "🦕 Pterodactyl Panel Integration:"
    echo ""
    print_color $YELLOW "MCHostPanel requires a Pterodactyl Panel instance to manage Minecraft servers."
    print_color $YELLOW "Please ensure you have a working Pterodactyl Panel installation."
    echo ""

    while true; do
        read -p "Enter your Pterodactyl Panel URL (e.g., https://panel.example.com): " ptero_url
        if [[ -n "$ptero_url" ]]; then
            # Remove trailing slash
            PTERODACTYL_URL="${ptero_url%/}"
            print_color $GREEN "✅ Pterodactyl URL: $PTERODACTYL_URL"
            break
        else
            print_color $RED "❌ Pterodactyl URL cannot be empty."
        fi
    done

    echo ""
    print_color $BLUE "API Configuration:"
    print_color $YELLOW "You need to create API keys in your Pterodactyl Panel:"
    print_color $YELLOW "1. Go to Account Settings > API Credentials"
    print_color $YELLOW "2. Create a new Application API Key with read/write permissions"
    echo ""

    while true; do
        read -p "Enter your Pterodactyl API Key: " ptero_api
        if [[ -n "$ptero_api" ]]; then
            PTERODACTYL_API_KEY="$ptero_api"
            print_color $GREEN "✅ API Key configured"
            break
        else
            print_color $RED "❌ API Key cannot be empty."
        fi
    done

    while true; do
        read -p "Enter your Pterodactyl Admin Token: " ptero_admin
        if [[ -n "$ptero_admin" ]]; then
            PTERODACTYL_ADMIN_TOKEN="$ptero_admin"
            print_color $GREEN "✅ Admin Token configured"
            break
        else
            print_color $RED "❌ Admin Token cannot be empty."
        fi
    done

    echo ""
    read -p "Press Enter to continue..."
}

# Function to show configuration summary
show_summary() {
    print_header
    print_color $BLUE "📋 Configuration Summary:"
    echo ""
    
    print_color $CYAN "Deployment Mode:" && echo "  $SETUP_MODE"
    print_color $CYAN "Domain:" && echo "  $DOMAIN"
    
    if [[ "$USE_SSL" == "true" ]]; then
        print_color $CYAN "SSL/HTTPS:" && echo "  Enabled ($SSL_METHOD)"
        if [[ "$SSL_METHOD" == "letsencrypt" ]]; then
            print_color $CYAN "SSL Email:" && echo "  $SSL_EMAIL"
        fi
    else
        print_color $CYAN "SSL/HTTPS:" && echo "  Disabled"
    fi
    
    if [[ "$USE_CUSTOM_PORT" == "true" ]]; then
        print_color $CYAN "Ports:" && echo "  HTTP: $NGINX_HTTP_PORT, HTTPS: $NGINX_HTTPS_PORT"
    else
        print_color $CYAN "Ports:" && echo "  Standard (80/443)"
    fi
    
    print_color $CYAN "Database:" && echo "  $DATABASE_TYPE"
    if [[ "$DATABASE_TYPE" == "postgresql" ]]; then
        print_color $CYAN "DB Details:" && echo "  Name: $DB_NAME, User: $DB_USER"
    fi
    
    print_color $CYAN "Pterodactyl:" && echo "  $PTERODACTYL_URL"
    
    echo ""
    print_color $YELLOW "⚠️  Please review the configuration above carefully."
    echo ""
    
    while true; do
        read -p "Continue with this configuration? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_color $GREEN "✅ Configuration confirmed!"
            break
        elif [[ $REPLY =~ ^[Nn]$ ]] || [[ -z $REPLY ]]; then
            print_color $RED "❌ Setup cancelled. Please run the script again."
            exit 1
        else
            print_color $RED "❌ Please answer y or n."
        fi
    done
    echo ""
    read -p "Press Enter to continue with installation..."
}

# Function to generate configurations
generate_configurations() {
    print_header
    print_color $BLUE "⚙️  Generating configuration files..."
    echo ""

    # Generate secret key if not set
    if [[ -z "$SECRET_KEY" ]]; then
        SECRET_KEY=$(generate_secret_key)
    fi

    # Generate backend .env
    print_color $YELLOW "📄 Generating backend/.env..."
    
    cat > backend/.env << EOF
# Application Settings
APP_NAME=MCHostPanel
APP_DESCRIPTION=Professional Minecraft Server Hosting Panel
DEBUG=$([ "$SETUP_MODE" == "development" ] && echo "True" || echo "False")
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Pterodactyl API Settings
PTERODACTYL_URL=$PTERODACTYL_URL
PTERODACTYL_API_KEY=$PTERODACTYL_API_KEY
PTERODACTYL_ADMIN_TOKEN=$PTERODACTYL_ADMIN_TOKEN

# Database
EOF

    if [[ "$DATABASE_TYPE" == "sqlite" ]]; then
        echo "DATABASE_URL=sqlite:///./mchostpanel.db" >> backend/.env
    else
        echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@db:5432/$DB_NAME" >> backend/.env
    fi

    # CORS and Frontend URL
    if [[ "$SETUP_MODE" == "development" ]]; then
        cat >> backend/.env << EOF

# CORS Settings
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF
    else
        local frontend_url
        if [[ "$USE_SSL" == "true" ]]; then
            if [[ "$USE_CUSTOM_PORT" == "true" && "$NGINX_HTTPS_PORT" != "443" ]]; then
                frontend_url="https://$DOMAIN:$NGINX_HTTPS_PORT"
            else
                frontend_url="https://$DOMAIN"
            fi
        else
            if [[ "$USE_CUSTOM_PORT" == "true" && "$NGINX_HTTP_PORT" != "80" ]]; then
                frontend_url="http://$DOMAIN:$NGINX_HTTP_PORT"
            else
                frontend_url="http://$DOMAIN"
            fi
        fi
        
        cat >> backend/.env << EOF

# CORS Settings
CORS_ORIGINS=["$frontend_url"]

# Frontend URL
FRONTEND_URL=$frontend_url
EOF
    fi

    # Generate frontend .env
    print_color $YELLOW "📄 Generating frontend/.env..."
    
    if [[ "$SETUP_MODE" == "development" ]]; then
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_NAME=MCHostPanel
REACT_APP_DESCRIPTION=Professional Minecraft Server Hosting Panel
EOF
    else
        local api_url
        if [[ "$USE_SSL" == "true" ]]; then
            if [[ "$USE_CUSTOM_PORT" == "true" && "$NGINX_HTTPS_PORT" != "443" ]]; then
                api_url="https://$DOMAIN:$NGINX_HTTPS_PORT"
            else
                api_url="https://$DOMAIN"
            fi
        else
            if [[ "$USE_CUSTOM_PORT" == "true" && "$NGINX_HTTP_PORT" != "80" ]]; then
                api_url="http://$DOMAIN:$NGINX_HTTP_PORT"
            else
                api_url="http://$DOMAIN"
            fi
        fi
        
        cat > frontend/.env << EOF
REACT_APP_API_URL=$api_url
REACT_APP_NAME=MCHostPanel
REACT_APP_DESCRIPTION=Professional Minecraft Server Hosting Panel
EOF
    fi

    print_color $GREEN "✅ Configuration files generated successfully!"
    echo ""
}

# Function to configure nginx
configure_nginx() {
    if [[ "$SETUP_MODE" == "development" ]]; then
        return
    fi

    print_color $YELLOW "📄 Configuring nginx..."
    
    # Backup original nginx.conf
    cp nginx.conf nginx.conf.backup

    # Generate new nginx.conf
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen $NGINX_HTTP_PORT;
        server_name $DOMAIN;
EOF

    if [[ "$USE_SSL" == "true" ]]; then
        cat >> nginx.conf << EOF

        # Redirect HTTP to HTTPS
        return 301 https://\$server_name:\$request_uri;
    }

    server {
        listen $NGINX_HTTPS_PORT ssl http2;
        server_name $DOMAIN;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
EOF
    fi

    cat >> nginx.conf << EOF

        # API routes
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check for backend
        location /health {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Backend docs
        location /docs {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            
            # Support for React Router
            try_files \$uri \$uri/ /index.html;
        }

        # WebSocket support
        location /ws/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

    print_color $GREEN "✅ Nginx configuration updated!"
    echo ""
}

# Function to setup SSL certificates
setup_ssl() {
    if [[ "$USE_SSL" != "true" ]]; then
        return
    fi

    print_color $YELLOW "🔒 Setting up SSL certificates..."
    
    # Create ssl directory if it doesn't exist
    mkdir -p ssl

    if [[ "$SSL_METHOD" == "letsencrypt" ]]; then
        print_color $BLUE "📜 Setting up Let's Encrypt certificates..."
        
        # Check if certbot is installed
        if ! command -v certbot &> /dev/null; then
            print_color $RED "❌ Certbot is not installed."
            print_color $YELLOW "Please install certbot first:"
            print_color $YELLOW "Ubuntu/Debian: sudo apt install certbot"
            print_color $YELLOW "CentOS/RHEL: sudo yum install certbot"
            print_color $YELLOW "macOS: brew install certbot"
            echo ""
            print_color $YELLOW "After installing certbot, run this command to get certificates:"
            print_color $CYAN "sudo certbot certonly --standalone -d $DOMAIN --email $SSL_EMAIL --agree-tos --non-interactive"
            print_color $YELLOW "Then copy the certificates:"
            print_color $CYAN "sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem"
            print_color $CYAN "sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem"
            print_color $CYAN "sudo chown \$(whoami):\$(whoami) ssl/*.pem"
            echo ""
            read -p "Press Enter after setting up the certificates..."
        else
            # Attempt to get certificates automatically
            print_color $YELLOW "🚀 Attempting to get Let's Encrypt certificates..."
            
            if sudo certbot certonly --standalone -d "$DOMAIN" --email "$SSL_EMAIL" --agree-tos --non-interactive; then
                sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/cert.pem
                sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/key.pem
                sudo chown $(whoami):$(whoami) ssl/*.pem
                print_color $GREEN "✅ Let's Encrypt certificates obtained successfully!"
            else
                print_color $RED "❌ Failed to obtain Let's Encrypt certificates automatically."
                print_color $YELLOW "Please manually run the following commands:"
                print_color $CYAN "sudo certbot certonly --standalone -d $DOMAIN --email $SSL_EMAIL --agree-tos --non-interactive"
                print_color $CYAN "sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem"
                print_color $CYAN "sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem"
                print_color $CYAN "sudo chown \$(whoami):\$(whoami) ssl/*.pem"
                echo ""
                read -p "Press Enter after setting up the certificates..."
            fi
        fi
    elif [[ "$SSL_METHOD" == "custom" ]]; then
        print_color $BLUE "📜 Setting up custom SSL certificates..."
        print_color $YELLOW "Please place your SSL certificates in the ssl/ directory:"
        print_color $CYAN "  ssl/cert.pem - Your SSL certificate (full chain)"
        print_color $CYAN "  ssl/key.pem  - Your private key"
        echo ""
        read -p "Press Enter after placing your certificates..."
    fi

    # Verify certificates exist
    if [[ -f "ssl/cert.pem" && -f "ssl/key.pem" ]]; then
        print_color $GREEN "✅ SSL certificates are in place!"
    else
        print_color $RED "❌ SSL certificates not found in ssl/ directory."
        print_color $YELLOW "Please ensure cert.pem and key.pem are present before starting the application."
    fi
    echo ""
}

# Function to update docker-compose for production
update_docker_compose() {
    if [[ "$SETUP_MODE" == "development" ]]; then
        return
    fi

    print_color $YELLOW "📄 Updating docker-compose.yml..."

    # Backup original docker-compose.yml
    cp docker-compose.yml docker-compose.yml.backup

    # Generate new docker-compose.yml
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - ./config.json:/app/config.json
    env_file:
      - ./backend/.env
EOF

    if [[ "$DATABASE_TYPE" == "postgresql" ]]; then
        cat >> docker-compose.yml << EOF
    depends_on:
      - db
EOF
    fi

    cat >> docker-compose.yml << EOF
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
    restart: unless-stopped
EOF

    if [[ "$DATABASE_TYPE" == "postgresql" ]]; then
        cat >> docker-compose.yml << EOF

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: $DB_NAME
      POSTGRES_USER: $DB_USER
      POSTGRES_PASSWORD: $DB_PASSWORD
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
EOF
    fi

    cat >> docker-compose.yml << EOF

  nginx:
    image: nginx:alpine
    ports:
      - "$NGINX_HTTP_PORT:80"
EOF

    if [[ "$USE_SSL" == "true" ]]; then
        cat >> docker-compose.yml << EOF
      - "$NGINX_HTTPS_PORT:443"
EOF
    fi

    cat >> docker-compose.yml << EOF
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
EOF

    if [[ "$USE_SSL" == "true" ]]; then
        cat >> docker-compose.yml << EOF
      - ./ssl:/etc/nginx/ssl
EOF
    fi

    cat >> docker-compose.yml << EOF
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
EOF

    if [[ "$DATABASE_TYPE" == "postgresql" ]]; then
        cat >> docker-compose.yml << EOF

volumes:
  postgres_data:
EOF
    fi

    print_color $GREEN "✅ Docker Compose configuration updated!"
    echo ""
}

# Function to start the application
start_application() {
    print_header
    print_color $BLUE "🚀 Starting MCHostPanel..."
    echo ""

    if [[ "$SETUP_MODE" == "development" ]]; then
        print_color $YELLOW "🔧 Starting in development mode..."
        docker-compose -f docker-compose.dev.yml up --build -d
    else
        print_color $YELLOW "🏭 Starting in production mode..."
        docker-compose up --build -d
    fi

    echo ""
    print_color $GREEN "🎉 MCHostPanel is starting up!"
    echo ""

    # Wait a moment for services to start
    print_color $YELLOW "⏳ Waiting for services to initialize..."
    sleep 10

    # Show access information
    print_color $BLUE "📱 Access Information:"
    echo ""

    if [[ "$SETUP_MODE" == "development" ]]; then
        print_color $GREEN "Frontend: http://localhost:3000"
        print_color $GREEN "Backend API: http://localhost:8000"
        print_color $GREEN "API Docs: http://localhost:8000/docs"
    else
        local access_url
        if [[ "$USE_SSL" == "true" ]]; then
            if [[ "$USE_CUSTOM_PORT" == "true" && "$NGINX_HTTPS_PORT" != "443" ]]; then
                access_url="https://$DOMAIN:$NGINX_HTTPS_PORT"
            else
                access_url="https://$DOMAIN"
            fi
        else
            if [[ "$USE_CUSTOM_PORT" == "true" && "$NGINX_HTTP_PORT" != "80" ]]; then
                access_url="http://$DOMAIN:$NGINX_HTTP_PORT"
            else
                access_url="http://$DOMAIN"
            fi
        fi
        
        print_color $GREEN "Panel: $access_url"
        print_color $GREEN "API Docs: $access_url/docs"
        
        if [[ "$DATABASE_TYPE" == "postgresql" ]]; then
            echo ""
            print_color $BLUE "🗄️  Database Information:"
            print_color $CYAN "Database: $DB_NAME"
            print_color $CYAN "Username: $DB_USER"
            print_color $CYAN "Password: $DB_PASSWORD"
            print_color $YELLOW "⚠️  Please save these credentials securely!"
        fi
    fi

    echo ""
    print_color $YELLOW "📝 Next Steps:"
    print_color $CYAN "1. Wait for all services to fully start (may take a few minutes)"
    print_color $CYAN "2. Access the panel using the URLs above"
    print_color $CYAN "3. Create your first admin account"
    print_color $CYAN "4. Configure your Minecraft server templates"
    echo ""
    
    print_color $BLUE "🔧 Management Commands:"
    print_color $CYAN "View logs: docker-compose logs -f"
    print_color $CYAN "Stop services: docker-compose down"
    print_color $CYAN "Restart services: docker-compose restart"
    echo ""
    
    print_color $GREEN "✨ Setup completed successfully!"
    print_color $YELLOW "Thank you for using MCHostPanel!"
}

# Main function
main() {
    # Trap to handle interrupts
    trap 'echo -e "\n${RED}❌ Setup interrupted. Exiting...${NC}"; exit 1' INT

    print_header
    print_color $GREEN "Welcome to MCHostPanel Interactive Setup!"
    print_color $YELLOW "This script will guide you through setting up your Minecraft hosting panel."
    echo ""
    read -p "Press Enter to begin..."

    # Run setup steps
    check_prerequisites
    choose_setup_mode
    configure_ssl
    configure_domain
    configure_database
    configure_pterodactyl
    show_summary
    generate_configurations
    configure_nginx
    setup_ssl
    update_docker_compose
    start_application
}

# Run main function
main "$@"