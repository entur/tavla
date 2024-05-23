FROM alpine:3.18 AS base
WORKDIR /app

RUN apk add --update nodejs && \
    apk add --no-cache g++ make py3-pip libc6-compat yarn

FROM base AS deps
WORKDIR /app

COPY . .

RUN yarn

FROM deps AS builder

ENV NEXT_TELEMETRY_DISABLED 1

ARG ENV
ENV NEXT_PUBLIC_ENV=$ENV

ARG POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=$POSTHOG_KEY

ARG POSTHOG_HOST
ENV NEXT_PUBLIC_POSTHOG_HOST=$POSTHOG_HOST

RUN yarn build

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1000 app && \
    adduser --system --uid 1000 app

RUN mkdir -p /app/src/.next/cache && \
    chmod 777 /app/src/.next/cache

USER app

COPY --chown=app:app --from=builder /app/.next/standalone src/
COPY --chown=app:app --from=builder /app/public src/public
COPY --chown=app:app --from=builder /app/.next/static src/.next/static

ENV PORT 3000
EXPOSE 3000

CMD ["node", "src/server.js"]
