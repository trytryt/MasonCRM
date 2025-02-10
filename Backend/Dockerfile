# Use Node.js LTS image
FROM node:18.16.1

# --- NETFREE CERT INTSALL ---
ADD https://netfree.link/dl/unix-ca.sh /home/netfree-unix-ca.sh
RUN cat  /home/netfree-unix-ca.sh | sh
ENV NODE_EXTRA_CA_CERTS=/etc/ca-bundle.crt
ENV REQUESTS_CA_BUNDLE=/etc/ca-bundle.crt
ENV SSL_CERT_FILE=/etc/ca-bundle.crt
# --- END NETFREE CERT INTSALL ---

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
