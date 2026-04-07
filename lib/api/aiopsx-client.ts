const AIOPSX_API = process.env.AIOPSX_API_URL || 'http://localhost:8080'

export async function aiopsxFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${AIOPSX_API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  return res.json()
}

export const AiopsxClient = {
  getMetrics: () => aiopsxFetch('/metrics'),
  scaleAgents: (count: number) => aiopsxFetch('/scale', { method: 'POST', body: JSON.stringify({ count }) }),
}
