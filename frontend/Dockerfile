FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the production build
RUN npm install -g serve

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S react -u 1001
RUN chown -R react:nodejs /app
USER react

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Serve the application
CMD ["serve", "-s", "build", "-l", "3000"]