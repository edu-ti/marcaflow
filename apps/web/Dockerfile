FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/packages/utils/node_modules ./packages/utils/node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN corepack enable pnpm --filter=web build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/packages ./packages

USER nodejs

EXPOSE 3000

CMD ["node", "apps/web/node_modules/.bin/next", "start"]