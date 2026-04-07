import { NextResponse } from 'next/server'

// In production, this would query OpenClaw gateway
const MOCK_AGENTS = [
  { id: 'agent1', name: 'Research Agent', status: 'running', uptime: 3600, lastActive: new Date().toISOString() },
  { id: 'agent2', name: 'Security Monitor', status: 'stopped', uptime: 0, lastActive: new Date().toISOString() },
]

export async function GET() {
  // TODO: fetch from OpenClaw gateway: GET /agents
  return NextResponse.json({ agents: MOCK_AGENTS })
}
