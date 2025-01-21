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

# Copy the wait-for-mysql script
COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

# Expose the port your backend runs on
EXPOSE 5000

# Start the application
CMD ["npx", "nodemon", "src/app.ts"]
#CMD ["npx", "nodemon", "--exec", "npx", "ts-node", "src/app.ts"]
