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

RUN yarn build

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

# We copy the built NextJS app assets from the builder stage
# NextJS produces a backend server and a frontend app
COPY --chown=app:app --from=builder /app/.next/standalone src/
COPY --chown=app:app --from=builder /app/public src/public
COPY --chown=app:app --from=builder /app/.next/static src/.next/static

# Set the port that the NextJS app will run on
# You should choose a port that is supported by your cloud provider
ENV PORT 3000
# Expose the port to the outside world
EXPOSE 3000

# Finally, we run the NextJS app
CMD ["node", "src/server.js"]