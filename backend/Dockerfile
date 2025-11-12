# Use Node.js LTS version
FROM node:20-slim

# Create and set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
