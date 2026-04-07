# xander-nexus — Unified Control Plane for AI Agents

[![CI](https://github.com/GBOYEE/xander-nexus/actions/workflows/ci.yml/badge.svg)](https://github.com/GBOYEE/xander-nexus/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)](https://www.python.org)
[![Docker](https://img.shields.io/badge/Docker-✓-blue?logo=docker&logoColor=white)](https://www.docker.com)

Unified dashboard to manage autonomous AI agent systems: OpenClaw, xander-operator, aiopsx, HiveSec — all in one place.

## 🚀 What Problem This Solves

Managing multiple AI systems means juggling multiple dashboards, logs, and control panels. xander-nexus provides a single pane of glass to monitor health, start/stop agents, run security scans, and view operations metrics.

## ⚙️ How It Works

- **Next.js 15** frontend with shadcn/ui components
- **FastAPI** backend (Python) for orchestration
- **PostgreSQL** for state persistence
- **Redis** for real-time pub/sub
- **WebSocket** for live updates
- **Docker Compose** for one-command deployment

Modules:
- Dashboard overview (health of all systems)
- Agents management (lifecycle control)
- Security hub (HiveSec integration)
- Tools studio (xander-operator primitives)
- Operations metrics (Prometheus)
- Marketer agent (job automation)

## 📦 Quick Start

```bash
# Clone and run
git clone https://github.com/GBOYEE/xander-nexus.git
cd xander-nexus
cp .env.example .env
# Edit .env with your database and LLM settings
docker compose up -d
```

Open: http://localhost:3000 (frontend) and http://localhost:8000 (API)

## 🧪 Development

```bash
# Install deps
pip install -r requirements.txt
npm install  # in app/

# Run frontend
npm run dev

# Run API
uvicorn app.main:app --reload
```

## 📂 Structure

```
xander-nexus/
├── app/               # Next.js app (frontend)
│   ├── (dashboard)/  # Dashboard pages
│   ├── api/           # API routes (FastAPI via Next.js)
│   └── components/    # UI components
├── scripts/           # DB migrations, seed data
├── docker-compose.yml
└── README.md
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and PR guidelines.

## 📄 License

MIT — see [LICENSE](LICENSE).
