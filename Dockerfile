FROM node:14-alpine
WORKDIR /app/db
COPY db/ .
RUN npm install
WORKDIR /app/server
COPY server/ .
RUN npm install
ENTRYPOINT ["node", "index.js"]

