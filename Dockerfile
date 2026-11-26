# Multi-stage Dockerfile to build and run both React frontend and Node.js backend

# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ .

# Build React app
RUN npm run build

# Stage 2: Build/prepare the backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Stage 3: Final runtime image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built React frontend from builder
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Copy backend app files
COPY backend/ ./backend/

# Copy backend node_modules from builder
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Ensure public directory exists for static files
RUN mkdir -p ./backend/public || true

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port
EXPOSE 5000

# Change to backend directory and start the server
WORKDIR /app/backend

# Start the Express server
CMD ["node", "server.js"]
