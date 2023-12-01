FROM node:latest

WORKDIR /src/app
COPY package.json /src/app/package.json

RUN npm install

ENV PORT=3000
EXPOSE 3000

COPY . /src/app

CMD ["npm", "run", "serve"]
