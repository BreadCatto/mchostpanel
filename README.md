# MCHostPanel - Professional Minecraft Server Hosting Panel

A modern, production-ready Minecraft server hosting panel built with FastAPI and React. Seamlessly integrates with Pterodactyl Panel for comprehensive server management.

## 🚀 Features

- **Modern UI/UX**: React-based frontend with Minecraft-themed animations
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Pterodactyl Integration**: Full synchronization with Pterodactyl Panel API
- **Server Management**: Create, start, stop, restart, and delete Minecraft servers
- **User Dashboard**: Intuitive dashboard for managing multiple servers
- **Account Management**: Complete user profile and settings management
- **Production Ready**: Docker containerization with nginx reverse proxy
- **Responsive Design**: Mobile-friendly interface with modern animations

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│◄──►│  FastAPI Backend│◄──►│ Pterodactyl API │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│     Nginx       │    │   PostgreSQL    │    │  Minecraft      │
│  Reverse Proxy  │    │    Database     │    │   Servers       │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Installation

### Prerequisites

- Docker and Docker Compose
- Pterodactyl Panel instance
- Domain name (for production deployment)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/BreadCatto/mchostpanel.git
   cd mchostpanel
   ```

2. **Run the interactive setup**
   ```bash
   ./start.sh
   ```
   
   Choose option 1 for **Interactive Setup** (recommended) or option 2 for **Quick Start**.

#### Interactive Setup (Recommended)

The interactive setup provides a guided configuration wizard that handles:
- SSL/HTTPS configuration (Let's Encrypt or custom certificates)
- Domain and port configuration
- Database selection (SQLite or PostgreSQL)
- Pterodactyl Panel integration
- Automatic generation of all configuration files

Simply run `./start.sh`, choose option 1, and follow the prompts!

#### Manual Configuration (Quick Start)

If you prefer manual configuration:
1. **Configure environment variables**
   ```bash
   # Backend configuration
   cp backend/.env.example backend/.env
   
   # Frontend configuration
   cp frontend/.env.example frontend/.env
   ```

2. **Update configuration files**
   
   Edit `backend/.env`:
   ```env
   # Application Settings
   APP_NAME=MCHostPanel
   APP_DESCRIPTION=Professional Minecraft Server Hosting Panel
   DEBUG=False
   HOST=0.0.0.0
   PORT=8000
   
   # Security
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # Pterodactyl API Settings
   PTERODACTYL_URL=https://your-pterodactyl-panel.com
   PTERODACTYL_API_KEY=your-pterodactyl-api-key
   PTERODACTYL_ADMIN_TOKEN=your-pterodactyl-admin-token
   
   # Database
   DATABASE_URL=postgresql://mchostpanel:mchostpanel_password@db:5432/mchostpanel
   
   # CORS Settings
   CORS_ORIGINS=["http://localhost:3000", "https://your-domain.com"]
   
   # Frontend URL
   FRONTEND_URL=https://your-domain.com
   ```

   Edit `frontend/.env`:
   ```env
   REACT_APP_API_URL=https://your-domain.com
   REACT_APP_NAME=MCHostPanel
   REACT_APP_DESCRIPTION=Professional Minecraft Server Hosting Panel
   ```

3. **Configure server settings**
   
   Edit `config.json` to customize default server configurations:
   ```json
   {
     "server_config": {
       "default_memory": 1024,
       "default_disk": 2048,
       "default_cpu": 100,
       "default_databases": 1,
       "default_allocations": 1,
       "default_backups": 1,
       "default_egg": 5,
       "default_nest": 1,
       "startup_command": "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
       "image": "ghcr.io/pterodactyl/yolks:java_17",
       "environment": {
         "SERVER_JARFILE": "server.jar",
         "VANILLA_VERSION": "latest"
       }
     },
     "app_config": {
       "app_name": "MCHostPanel",
       "app_description": "Professional Minecraft Server Hosting Panel",
       "default_node": 1,
       "max_servers_per_user": 3,
       "registration_enabled": true
     }
   }
   ```

4. **Deploy with Docker Compose**
   ```bash
   # Production deployment
   docker-compose up -d
   
   # Development mode
   docker-compose -f docker-compose.dev.yml up
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Development Setup

### Backend Development

1. **Setup Python environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the backend**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Development

1. **Setup Node.js environment**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the frontend**
   ```bash
   npm start
   ```

## 🔐 Pterodactyl Integration

### API Key Setup

1. **Application API Key** (for user operations):
   - Go to your Pterodactyl panel → Account → API Credentials
   - Create a new Application API key
   - Set permissions: `read`, `write` for users and servers

2. **Client API Key** (for server management):
   - Go to your Pterodactyl panel → Account → API Credentials
   - Create a new Client API key
   - Set permissions: All server permissions

### Required Pterodactyl Configuration

- Ensure you have at least one Node configured
- Ensure you have at least one Nest and Egg configured
- Note the IDs for default node, nest, and egg to use in `config.json`

## 🚀 Production Deployment

### SSL Configuration

1. **Generate SSL certificates** (using Let's Encrypt):
   ```bash
   # Install certbot
   sudo apt install certbot
   
   # Generate certificates
   sudo certbot certonly --standalone -d your-domain.com
   
   # Copy certificates
   mkdir ssl
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
   ```

2. **Update nginx configuration**
   - Uncomment the HTTPS server block in `nginx.conf`
   - Update the server name to your domain

3. **Update environment variables**
   - Set `DEBUG=False` in backend `.env`
   - Update CORS origins and frontend URL

### Security Considerations

- Change all default passwords and secret keys
- Use strong, unique passwords for database
- Enable SSL/TLS for all communications
- Regularly update dependencies
- Monitor logs for suspicious activity
- Implement rate limiting (consider using nginx rate limiting)

## 📖 API Documentation

The API documentation is automatically generated and available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/servers/` - List user servers
- `POST /api/servers/` - Create new server
- `POST /api/servers/{id}/start` - Start server
- `POST /api/servers/{id}/stop` - Stop server
- `POST /api/servers/{id}/restart` - Restart server
- `DELETE /api/servers/{id}` - Delete server

## 🎨 Customization

### Theming

The frontend uses styled-components with a customizable theme located in `frontend/src/styles/GlobalStyles.js`. You can modify:

- Colors and gradients
- Typography
- Spacing and layout
- Component styles

### Branding

Update the following files to customize branding:
- `frontend/public/manifest.json` - App metadata
- `frontend/public/index.html` - Page title and meta
- `config.json` - App name and description
- Environment variables for app name

## 🐛 Troubleshooting

### Common Issues

1. **Pterodactyl API errors**
   - Verify API keys have correct permissions
   - Check Pterodactyl URL is accessible
   - Ensure Pterodactyl panel is running

2. **Database connection errors**
   - Check database credentials
   - Ensure PostgreSQL container is running
   - Verify network connectivity

3. **CORS errors**
   - Update CORS_ORIGINS in backend environment
   - Ensure frontend URL is correct

4. **Authentication issues**
   - Verify SECRET_KEY is set
   - Check token expiration settings
   - Clear browser local storage

### Logs

View application logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Pterodactyl Panel for the excellent server management API
- React and FastAPI communities for excellent documentation
- All contributors who help improve this project

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.