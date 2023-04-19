FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git make clang build-base python3
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

COPY ./tavla .yarnrc.yml yarn.lock ./tavla/
COPY ./.yarn ./tavla/.yarn
COPY ./shared ./shared

WORKDIR /app/tavla
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn

RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/tavla/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=deps --chown=nextjs:nodejs /app/tavla/.next/standalone .
COPY --from=deps --chown=nextjs:nodejs /app/tavla/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
