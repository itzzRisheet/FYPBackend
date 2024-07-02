<<<<<<< HEAD
FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8080

CMD node server.js
=======
FROM node:18.19.1-alpine3.19
WORKDIR /app
COPY . .
RUN yarn install 
EXPOSE 8080
CMD ["node", "server.js"]
>>>>>>> 122458da077f9a2bea816e71ac74a528264faa11
