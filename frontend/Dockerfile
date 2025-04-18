# Use official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or package*.json) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Set the environment variable to make React listen on all interfaces
ENV HOST=0.0.0.0

# Copy the rest of the application code into the container
COPY . .

# Expose the React development server port
EXPOSE 3000

# Start the React app and ensure it listens on all network interfaces (0.0.0.0)
CMD ["npm", "start"]
