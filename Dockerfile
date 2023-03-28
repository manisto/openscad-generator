FROM node:lts

WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm install

COPY index.html .
COPY server.mjs .
COPY generate.mjs .
COPY swatch.scad .