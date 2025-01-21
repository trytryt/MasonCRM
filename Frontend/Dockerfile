# Use Node.js LTS image
FROM node:18

# Set the working directory
WORKDIR /src

# Copy package files and install dependencies
COPY package*.json ./
RUN apt-get update && apt-get install -y ca-certificates
RUN npm config set strict-ssl false
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port your frontend runs on
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
