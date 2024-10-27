FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY /src/index.ts ./

EXPOSE 8000
CMD [ "npm", "run", "dev" ]