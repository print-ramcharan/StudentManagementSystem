# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production Stage: Serve the app using the serve package
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/build /app/build

# Install serve
RUN npm install -g serve

# Expose the default port 3000
EXPOSE 8000

# Use a shell command to run the app with the serve package
CMD ["sh", "-c", "serve -s build -l 8000"]
