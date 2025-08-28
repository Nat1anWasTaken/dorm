# Multi-stage Dockerfile for Next.js 15 + pnpm

# Base image with Corepack (pnpm) enabled
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-bookworm-slim AS base

ENV PNPM_HOME="/pnpm" \
    PATH="${PNPM_HOME}:$PATH"
RUN corepack enable

WORKDIR /app

# Install dependencies with pnpm using cached store
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
# Use a cache mount for pnpm store to speed up rebuilds
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Build the Next.js app
FROM base AS build
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runtime image
FROM node:${NODE_VERSION}-bookworm-slim AS runner
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

# Copy only what's needed to run the server
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY next.config.ts ./next.config.ts

# Run as non-root user for safety
USER node

EXPOSE 3000

# Use Next.js directly to avoid needing pnpm in runtime image
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]

