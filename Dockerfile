FROM node:25-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:25-alpine
WORKDIR /app
# Install Playwright system deps
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++ \
    && npm install -g playwright \
    && playwright install-deps chromium \
    && playwright install chromium \
    && apk del .build-deps

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
