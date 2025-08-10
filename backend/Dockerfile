# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose port (should match your .env PORT)
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
