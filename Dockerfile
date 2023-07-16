FROM alpine:edge

RUN echo https://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories
RUN apk update
RUN apk add nodejs npm openscad

WORKDIR /app/out
WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm install

COPY index.html .
COPY server.mjs .
COPY generate.mjs .

WORKDIR /app/data
COPY ./data/model.scad .
COPY ./data/settings.mjs .

EXPOSE 3000
CMD node server.mjs