# Security Policy

## Supported Versions

We currently support the following versions of MCHostPanel with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in MCHostPanel, please report it by emailing us at security@mchostpanel.com or by opening a security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

When reporting a vulnerability, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- Affected versions
- Any potential impact assessment
- Suggested fixes (if you have any)

## Security Measures

MCHostPanel implements several security measures:

### Authentication & Authorization
- JWT-based authentication with configurable expiration
- Bcrypt password hashing with salt
- Secure session management
- Role-based access control

### API Security
- CORS configuration for cross-origin requests
- Request validation and sanitization
- Rate limiting (recommended via nginx)
- SQL injection prevention through SQLAlchemy ORM

### Infrastructure Security
- Docker containerization for isolation
- Non-root user execution in containers
- HTTPS/SSL support with nginx
- Environment variable configuration
- Secure database connections

### Data Protection
- Password encryption at rest
- Secure API key storage
- Environment-based configuration
- No hardcoded secrets

## Best Practices

To ensure the security of your MCHostPanel installation:

1. **Use HTTPS**: Always deploy with SSL/TLS certificates
2. **Strong Passwords**: Use strong, unique passwords for all accounts
3. **Regular Updates**: Keep all dependencies up to date
4. **Secure Configuration**: Review and harden all configuration files
5. **Monitor Logs**: Regularly check application and access logs
6. **Backup Strategy**: Implement regular backups with encryption
7. **Network Security**: Use firewalls and restrict network access
8. **Environment Isolation**: Keep production and development environments separate

## Reporting Guidelines

We appreciate responsible disclosure of security vulnerabilities. We will:

- Acknowledge receipt of your report within 48 hours
- Provide an estimated timeline for fixes
- Keep you informed of our progress
- Credit you for the discovery (if desired)

Thank you for helping keep MCHostPanel secure!