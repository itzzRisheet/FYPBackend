FROM node:slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8080

CMD node server.js