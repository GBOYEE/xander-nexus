const HIVESEC_API = process.env.HIVESEC_API_URL || 'http://localhost:9000'

export async function hivesecFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${HIVESEC_API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  return res.json()
}

export const HiveSecClient = {
  startScan: () => hivesecFetch('/scan', { method: 'POST' }),
  getScans: () => hivesecFetch('/scans'),
}
