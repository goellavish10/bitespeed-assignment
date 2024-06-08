ARG PORT=9000

FROM node:18-alpine

WORKDIR /usr/apps/bitespeed_assignment

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE $PORT

CMD ["npm", "run", "start"]

