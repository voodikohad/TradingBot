# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (production only)
RUN npm install --production

# Copy application source
COPY index.js ./
COPY src ./src

# Create logs directory
RUN mkdir -p logs

# Expose port (Railway/Render use PORT env var)
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
