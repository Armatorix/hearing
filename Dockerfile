FROM node:16.17.1-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# production env
FROM nginx:mainline-alpine-slim
COPY --from=builder /app/build /usr/share/nginx/html

COPY ./scripts/env-config-maker.sh ./
COPY ./scripts/app-cmd.sh ./entrypoint.sh

CMD ["./entrypoint.sh"]