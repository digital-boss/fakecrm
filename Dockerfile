FROM node:16

# app directory
WORKDIR /app

COPY . .
RUN npm ci --only=production

EXPOSE 3000
CMD [ "node", "src/server.js" ]