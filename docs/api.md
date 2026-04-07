# API Reference

Base URL: `http://localhost:8000` (dev) or `/api` (production via proxy)

##健康检查

- `GET /health` → `{status: "ok", timestamp: "...", version: "..."}`

## Agents

- `GET /api/agents` → list all agents with status
- `POST /api/agents/{id}/start` → start an agent
- `POST /api/agents/{id}/stop` → stop an agent

## Marketer

- `GET /api/marketer/leads` → list leads
- `POST /api/marketer/leads` → bulk import leads (body: `[{url, title, source}]`)
- `GET /api/marketer/applications` → list applications
- `POST /api/marketer/apply` → apply to selected leads (body: `{leadIds[], email, password}`)
- `POST /api/marketer/cover-letter` → generate cover letter (body: `{jobDescription, resumeText}`)

## Security

- `GET /api/security/scans` → list scans
- `POST /api/security/scans` → trigger new scan

All endpoints (except `/health`) require authentication via NextAuth session cookie.
