# Interactive Setup Guide

MCHostPanel now includes an interactive setup script that guides you through the complete configuration process.

## Quick Start

1. **Run the startup script:**
   ```bash
   ./start.sh
   ```

2. **Choose your setup method:**
   - **Interactive Setup** - Complete guided configuration (recommended)
   - **Quick Start** - Simple development setup

## Interactive Setup Features

The interactive setup script (`setup.sh`) provides a comprehensive configuration wizard that includes:

### 🚀 Deployment Modes
- **Development** - Quick setup for testing and development
- **Production** - Full production deployment with advanced options

### 🔒 SSL/HTTPS Configuration
- **No SSL** - HTTP only (not recommended for production)
- **Let's Encrypt** - Free SSL certificates (automatic setup)
- **Custom SSL** - Use your own SSL certificates

### 🌐 Domain & Port Configuration
- Custom domain setup
- Standard ports (80/443) or custom port configuration
- Automatic URL generation for frontend/backend communication

### 🗄️ Database Options
- **SQLite** - Simple file-based database (good for development/small deployments)
- **PostgreSQL** - Advanced database with better performance (recommended for production)

### 🦕 Pterodactyl Integration
- Guided Pterodactyl Panel URL configuration
- API key and admin token setup
- Automatic validation and testing

### ⚙️ Automatic Configuration
- Generates all necessary `.env` files
- Configures nginx for reverse proxy
- Sets up Docker Compose files
- Handles SSL certificate installation
- Creates secure passwords and secret keys

## Usage Examples

### Development Setup
```bash
./start.sh
# Choose: 1) Interactive Setup
# Select: Development mode
# The script will configure everything for local development
```

### Production Setup with SSL
```bash
./start.sh
# Choose: 1) Interactive Setup
# Select: Production mode
# Configure: Let's Encrypt SSL
# Enter: Your domain name
# Configure: Database preferences
# Enter: Pterodactyl Panel details
```

### Production Setup without SSL
```bash
./start.sh
# Choose: 1) Interactive Setup
# Select: Production mode
# Configure: No SSL (HTTP only)
# Enter: Your domain name
# Configure: Database preferences
# Enter: Pterodactyl Panel details
```

## Manual Configuration

If you prefer manual configuration, you can still use the Quick Start option or configure files manually:

1. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Edit the configuration files according to your needs

3. Run the deployment:
   ```bash
   # Development
   docker-compose -f docker-compose.dev.yml up --build
   
   # Production
   docker-compose up --build -d
   ```

## Post-Setup

After running the interactive setup:

1. **Wait for services to start** (may take a few minutes)
2. **Access your panel** using the provided URLs
3. **Create your first admin account**
4. **Configure Minecraft server templates**

## Management Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Update and rebuild
docker-compose up --build -d
```

## SSL Certificate Renewal

For Let's Encrypt certificates, set up automatic renewal:

```bash
# Add to crontab
sudo crontab -e

# Add this line for automatic renewal
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change ports in the interactive setup
   - Or stop conflicting services

2. **SSL certificate issues**
   - Ensure domain DNS points to your server
   - Check firewall allows ports 80/443
   - Verify Let's Encrypt rate limits

3. **Database connection issues**
   - Check database credentials
   - Ensure PostgreSQL container is running
   - Verify network connectivity

### Getting Help

- Check the logs: `docker-compose logs -f`
- Verify configuration files in `backend/.env` and `frontend/.env`
- Ensure all required services are running: `docker-compose ps`

## Security Notes

- Always use HTTPS in production
- Keep your secret keys secure
- Regularly update your system and Docker images
- Use strong passwords for database access
- Regularly backup your data and configuration files