# Use official Node.js runtime as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
