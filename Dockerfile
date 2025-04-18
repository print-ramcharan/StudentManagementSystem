# ---------- Step 1: Build React frontend ----------
    FROM node:18 AS frontend-build

    WORKDIR /app/frontend
    
    # Install frontend dependencies
    COPY frontend/package*.json ./
    RUN npm install
    
    # Build the frontend
    COPY frontend/ .
    RUN npm run build
    
    
    # ---------- Step 2: Set up backend with static frontend ----------
    FROM node:18
    
    WORKDIR /app
    
    # Install backend dependencies
    COPY backend/package*.json ./
    RUN npm install
    
    # Copy backend source
    COPY backend/ .
    
    # Copy built frontend into backend's public directory
    COPY --from=frontend-build /app/frontend/build ./public
    
    # Environment variables
    ENV NODE_ENV=production
    ENV PORT=6969
    
    EXPOSE 6969
    
    # Start backend server
    CMD ["node", "server.js"]
    