# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of MCHostPanel
- FastAPI backend with JWT authentication
- React frontend with modern UI/UX
- Pterodactyl Panel integration
- User registration and login system
- Server management (create, start, stop, restart, delete)
- Dashboard with server overview and statistics
- Account management page
- Docker containerization
- Nginx reverse proxy configuration
- Production-ready deployment setup
- Comprehensive documentation
- Minecraft-themed animations and styling

### Features
- **Authentication System**
  - Secure JWT-based authentication
  - Bcrypt password hashing
  - User registration with Pterodactyl sync
  - Profile management

- **Server Management**
  - Create servers with custom configurations
  - Real-time server status monitoring
  - Start/stop/restart server controls
  - Server deletion with confirmation

- **User Interface**
  - Responsive design for all devices
  - Modern React components with animations
  - Minecraft-themed styling
  - Toast notifications for user feedback
  - Loading states and error handling

- **Integration**
  - Seamless Pterodactyl Panel integration
  - Automatic user creation in Pterodactyl
  - Server synchronization between systems
  - Configurable server defaults

- **Deployment**
  - Docker containerization
  - Docker Compose for easy deployment
  - Nginx reverse proxy
  - SSL/HTTPS support
  - Environment-based configuration

### Technical Stack
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React, Styled Components, Framer Motion
- **Authentication**: JWT, bcrypt
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: PostgreSQL (production), SQLite (development)