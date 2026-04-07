import { test as baseTest, expect } from '@playwright/test'

baseTest.describe('Nexus API health', () => {
  baseTest('health endpoint returns ok', async ({ request }) => {
    const res = await request.get('http://localhost:3000/api/health')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.status).toBe('ok')
  })
})
