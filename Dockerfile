FROM node:carbon-alpine

RUN apk add --no-cache --virtual .gyp python make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production && npm install pm2 -g

COPY . .

EXPOSE 8080

CMD [ "pm2-runtime", "process.json" ]