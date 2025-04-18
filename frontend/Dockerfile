# Dockerfile (frontend)

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env .env 
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight HTTP server to serve the static files
RUN npm install -g serve

# Expose the port that `serve` uses
EXPOSE 3000

# Serve the built app
CMD ["serve", "-s", "build"]
