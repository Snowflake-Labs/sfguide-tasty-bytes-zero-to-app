FROM node:latest

WORKDIR /src/
COPY package.json /src/package.json

RUN npm install

ENV PORT=3001
EXPOSE 3001

COPY ./src /src/src
COPY ./public /src/public

CMD ["npm", "start"]
