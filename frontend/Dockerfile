# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/build /app/build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 8000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --spider --quiet http://localhost:8000/health.html || exit 1


# Run the app
CMD ["sh", "-c", "serve -s build -l 8000"]
