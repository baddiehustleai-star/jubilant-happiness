# Use official Node.js LTS image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application files
COPY server.js ./
COPY api ./api

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the server
CMD ["node", "server.js"]
