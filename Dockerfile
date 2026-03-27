FROM node:18-alpine

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy source files
COPY . .

# Expose port
EXPOSE 5000

# Start command
CMD ["node", "src/server.js"]
