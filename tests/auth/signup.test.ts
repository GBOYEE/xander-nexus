import { test, expect } from '@playwright/test'
import { GET, POST } from '@/app/api/auth/signup/route'

test('signup creates first user', async () => {
  const res = await POST(new Request('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com', name: 'Test', password: 'pass123' })
  }))
  expect(res.status).toBe(200)
  const data = await res.json()
  expect(data.id).toBeDefined()
})
