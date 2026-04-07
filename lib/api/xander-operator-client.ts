const OPERATOR_API = process.env.OPERATOR_API_URL || 'http://localhost:3001'

export async function operatorFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${OPERATOR_API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  return res.json()
}

export const OperatorClient = {
  listTools: () => operatorFetch('/tools'),
  testTool: (toolId: string, input: any) => operatorFetch(`/tools/${toolId}/test`, { method: 'POST', body: JSON.stringify(input) }),
  createTool: (tool: any) => operatorFetch('/tools', { method: 'POST', body: JSON.stringify(tool) }),
}
