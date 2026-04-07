# xander-nexus documentation

## Architecture Overview

xander-nexus is a monolithic application with separate frontend (Next.js) and backend (FastAPI) that communicate via HTTP and WebSocket.

### Components

- **Frontend:** Next.js 15 app with shadcn/ui components, located in `app/`
- **Backend:** FastAPI service exposing REST and WebSocket endpoints
- **Database:** PostgreSQL for persistent state (users, leads, applications, scans)
- **Cache/Queue:** Redis for pub/sub and temporary state
- **Reverse Proxy:** Nginx (in prod) routes `/` to frontend and `/api` to backend

### Data Flow

1. User loads dashboard → Next.js renders pages
2. Frontend calls `/api/*` endpoints for data
3. Backend reads/writes to Postgres, publishes events to Redis
4. WebSocket pushes live updates (agent status, scan results)

### Deployment

See main README for Docker Compose setup.

## Configuration

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `REDIS_URL` | yes | Redis connection string |
| `SECRET_KEY` | yes | Session signing secret |
| `OPENROUTER_API_KEY` | optional | For LLM features (cover letter gen) |

## Development Guide

- Backend code lives in `app/api/` and `app/lib/`
- Frontend pages in `app/(dashboard)/` and components in `app/components/`
- Database models defined with Drizzle ORM in `app/db/`
