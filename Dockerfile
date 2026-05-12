# Multi-stage build: Frontend + Backend
# Build frontend React app
FROM node:20-bookworm-slim AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend .
RUN npm run build

# Backend stage
FROM node:20-bookworm-slim AS backend

ENV NODE_ENV=production
ENV Port=3001

WORKDIR /app

# Copy backend dependencies and source
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend .

# Copy built frontend static files to serve from backend
COPY --from=frontend-build /frontend/build /app/public

# Non-root user
USER node

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]
