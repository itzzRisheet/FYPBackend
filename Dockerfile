FROM node:18.19.1-alpine3.19
WORKDIR /app
COPY . .
RUN yarn install 
EXPOSE 8080
CMD ["node", "server.js"]
