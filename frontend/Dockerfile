# # Build Stage
# FROM node:20-alpine AS build
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# # Production Stage
# FROM node:20-alpine
# WORKDIR /app
# COPY --from=build /app/build /app/build

# # Install serve
# RUN npm install -g serve

# # Expose port
# EXPOSE 8000

# # Add health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
#   CMD wget --spider --quiet http://localhost:8000/health.html || exit 1


# # Run the app
# CMD ["sh", "-c", "serve -s build -l 8000"]

# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app

# ✅ Make sure this directory exists first
RUN mkdir -p /app

# Copy built static files
COPY --from=build /app/build /app/build

# ✅ Copy serve.json to current working directory (/app)
COPY serve.json .

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 8000

# Healthcheck (optional — Koyeb might use it)
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --spider --quiet http://localhost:8000 || exit 1

# Run the app with `serve` and serve.json
CMD ["serve", "-s", "build", "-l", "8000"]

