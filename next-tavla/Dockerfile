FROM alpine AS base
WORKDIR /app

RUN apk add --update nodejs 
RUN apk add --no-cache g++ make py3-pip libc6-compat yarn

FROM base AS deps
WORKDIR /app

COPY . ./

RUN yarn --version
COPY yarn.lock ./
RUN yarn 

FROM deps AS builder

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

COPY --chown=app:app --from=builder /app/.next/standalone src/
COPY --chown=app:app --from=builder /app/public src/public
COPY --chown=app:app --from=builder /app/.next/static src/.next/static

ENV PORT 3000
EXPOSE 3000

CMD ["node", "src/server.js"]
