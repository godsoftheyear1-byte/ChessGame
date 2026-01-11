FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package.json ./
RUN npm install

# Copy server code
COPY server/server.js ./

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
