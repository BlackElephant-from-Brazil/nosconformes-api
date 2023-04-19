FROM postgres:latest

RUN apt-get update && apt-get install -y nodejs npm

ENV POSTGRES_USER=nosconformes
ENV POSTGRES_PASSWORD=n0W7I8$zK@9s
ENV POSTGRES_DB=nosconformes

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "start:dev"]