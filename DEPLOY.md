# Xander Nexus — Deployment Guide

## Prerequisites

- Docker & Docker Compose installed on the server
- Git repository cloned to `/root/.openclaw/workspace`
- Domain name (optional, for TLS)

## Initial Setup

1. **Environment configuration**

   ```bash
   cd /root/.openclaw/workspace
   cp xander-nexus/.env.example xander-nexus/.env
   ```

   Edit `xander-nexus/.env`:
   - `NEXTAUTH_SECRET`: generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: set to `http://localhost:3000` (or `https://yourdomain.com`)
   - `OPENROUTER_API_KEY`: obtain from openrouter.ai (for cover letters)
   - Optional: `LINKEDIN_COOKIE` for stealth (advanced)

2. **Bring up the stack**

   ```bash
   docker-compose up -d
   ```

   This starts:
   - Postgres (port 5432)
   - Redis (port 6379)
   - Nexus (port 3000)
   - Prometheus (port 9090)
   - Grafana (port 3001)

3. **Initialize database schema**

   ```bash
   cd xander-nexus
   npm run db:push
   ```

4. **Create admin account**

   Open `http://localhost:3000/signup` (or via SSH tunnel) and submit your details.

5. **Log in** and navigate to `/dashboard/marketer`.

6. **Import leads**: paste LinkedIn job URLs (one per line) into the textarea and click **Import**.

7. **Apply**: select leads, enter LinkedIn email/password, click **Apply to Selected**.

8. **Generate cover letters**: select a single lead, paste your resume text, click **Generate Cover Letter** (requires `OPENROUTER_API_KEY`).

## Observability

- Metrics: `http://localhost:3000/api/metrics` (Prometheus)
- Grafana: `http://localhost:3001` (admin/admin)
- Pre‑provisioned dashboard: “Xander Nexus”

## Production Hardening

- Add reverse proxy (Nginx/Caddy) for TLS termination and path routing.
- Set strong passwords for Postgres and Grafana; use Docker secrets.
- Configure backups: `docker exec -t <postgres_container> pg_dumpall > backup.sql`
- Add Sentry for error tracking (set `SENTRY_DSN` in `.env`).
- Enable rate limiting in Nexus (e.g., `express-rate-limit` middleware).
- Add mTLS between services for zero‑trust network.

## CI/CD

GitHub Actions runs on push to `main`:
- Lint
- Build
- Playwright browser install

To release a new image, push to Docker Hub and update `docker-compose.yml`.

## Services Details

- **Nexus** (Next.js 15): main UI + APIs
- **OpenClaw Gateway**: placeholder (needs Dockerfile)
- **aiopsx**: placeholder (needs Dockerfile)
- **HiveSec**: placeholder (needs Dockerfile)

## Troubleshooting

- Nexus logs: `docker logs <nexus_container>`
- Database connection errors: ensure `DATABASE_URL` matches Postgres credentials.
- Auth issues: verify `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` correct.
- Playwright failures: ensure container has required dependencies (included in Dockerfile).
