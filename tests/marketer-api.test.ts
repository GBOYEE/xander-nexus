import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'

// Simple test runner because we're not installing Jest
describe('Marketer API tests', () => {
  it('should return 200 on health endpoint', async () => {
    const res = await fetch('http://localhost:3000/api/health')
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.strictEqual(data.status, 'ok')
  })

  it('should create a lead via POST /api/marketer/leads', async () => {
    const lead = {
      url: 'https://linkedin.com/jobs/123',
      title: 'Test Job',
      company: 'TestCo',
      source: 'manual'
    }
    const res = await fetch('http://localhost:3000/api/marketer/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    })
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert(data.lead.id)
    assert.strictEqual(data.lead.title, lead.title)
  })

  it('should list leads via GET /api/marketer/leads', async () => {
    const res = await fetch('http://localhost:3000/api/marketer/leads')
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert(Array.isArray(data.leads))
  })
})
