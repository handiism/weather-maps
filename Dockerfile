FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx

RUN rm -r /usr/share/nginx/html/*

COPY --from=builder /app/build/. /usr/share/nginx/html
