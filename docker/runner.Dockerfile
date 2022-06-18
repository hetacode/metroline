FROM node:16-alpine AS build

COPY ./ /repo/

WORKDIR /repo

RUN apk add --no-cache git \
  && npm ci \
  && npm run build \
  && npm prune --production

FROM node:16-alpine

COPY --from=build /repo/dist/runner.js /app/dist/
COPY --from=build /repo/dist/runner.js.map /app/dist/
COPY --from=build /repo/node_modules /app/node_modules

WORKDIR /app

LABEL maintainer="pmbot.io"

CMD ["node", "dist/runner.js"]
