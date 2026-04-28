FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/utils/package.json ./packages/utils/
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/utils/node_modules ./packages/utils/node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=builder /app/packages/utils/node_modules ./packages/utils/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/

USER nodejs

EXPOSE 3001

CMD ["node", "dist/apps/api/src/main.js"]