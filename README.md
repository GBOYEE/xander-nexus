# Xander Nexus

Unified control plane for autonomous AI agents.

## What it is

Xander Nexus ties together your existing AI ecosystem:

- **OpenClaw** – agent runtime & gateway
- **xander-operator** – browser automation tools
- **aiopsx** – deployment & monitoring
- **HiveSec** – security & compliance

Features a single dashboard to manage agents, monitor metrics, test tools, and run security scans.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes (or separate FastAPI)
- **Database**: PostgreSQL (planned)
- **Realtime**: Socket.io (planned)
- **Auth**: NextAuth.js (planned)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment and edit
cp .env.example .env.local
# Edit .env.local with your service URLs and API keys

# Run dev server
npm run dev
```

Open http://localhost:3000/dashboard

## Project Structure

```
xander-nexus/
├── app/
│   ├── (dashboard)/           # Authenticated dashboard routes
│   │   ├── agents/            # Agent manager
│   │   ├── tools/             # Tool editor & test runner
│   │   ├── operations/        # Metrics & deployment controls
│   │   ├── security/          # Security hub
│   │   └── settings/          # Integration configuration
│   ├── api/                   # REST & streaming endpoints
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/                # Sidebar, Header
│   ├── ui/                    # shadcn/ui components
│   └── ...
├── lib/
│   ├── api/                   # Clients for OpenClaw, aiopsx, HiveSec
│   └── utils.ts
└── data/                      # Local storage (if using file-based persistence)
```

## Roadmap

- [ ] Full integration with OpenClaw gateway (WebSocket)
- [ ] Real-time logs streaming
- [ ] PostgreSQL schema + user management
- [ ] Plugin marketplace
- [ ] Cost monitoring dashboard
- [ ] Advanced tool studio with drag-and-drop
- [ ] Authentication & multi-tenancy

## License

MIT
