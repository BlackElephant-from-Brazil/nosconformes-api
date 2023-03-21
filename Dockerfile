FROM node:18-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# TODO: https://www.tomray.dev/nestjs-docker-compose-postgres to implement this dockerfile