const OPENCLAW_GATEWAY = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789'

export async function openclawFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${OPENCLAW_GATEWAY}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  return res.json()
}

export const OpenClawClient = {
  listAgents: () => openclawFetch('/agents'),
  startAgent: (id: string) => openclawFetch(`/agents/${id}/start`, { method: 'POST' }),
  stopAgent: (id: string) => openclawFetch(`/agents/${id}/stop`, { method: 'POST' }),
}
