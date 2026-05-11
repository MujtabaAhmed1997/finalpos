# Production image for the POS API (Express + Sequelize).
# Build from repo root or backend folder:
#   docker build -t pos-backend ./backend
# Run (provide secrets via env file or -e):
#   docker run --env-file .env -p 3001:3001 pos-backend

FROM node:20-bookworm-slim AS base

ENV NODE_ENV=production
# Matches server.js (uses process.env.Port with capital P)
ENV Port=3001

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Application source
COPY . .

# Non-root user from official Node image
USER node

EXPOSE 3001

CMD ["node", "server.js"]
