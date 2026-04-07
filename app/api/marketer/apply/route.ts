import { NextRequest, NextResponse } from 'next/server'
import { applyJob } from '@/lib/tools/job-apply'
import { getLeadById, saveApplication } from '@/lib/marketer-store'
import type { Application } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  try {
    const { leadIds, email, password } = await req.json()
    if (!Array.isArray(leadIds) || !email || !password) {
      return NextResponse.json({ error: 'leadIds array, email, password required' }, { status: 400 })
    }

    const results = []
    for (const id of leadIds) {
      const lead = await getLeadById(id)
      if (!lead) continue
      const platform = lead.source === 'linkedin' ? 'linkedin' : 'generic'
      const result = await applyJob(platform, lead.url, { email, password })
      const app: Application = {
        id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        leadId: lead.id,
        platform,
        sentAt: new Date(),
        status: result.success ? 'sent' : 'failed',
        body: result.message,
        subject: null,
        notes: null,
      }
      await saveApplication(app)
      results.push({ leadId: lead.id, success: result.success, message: result.message })
    }
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
