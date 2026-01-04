# frontend/Dockerfile

# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose React's default port
EXPOSE 3000

# Start React
CMD ["npm", "start"]