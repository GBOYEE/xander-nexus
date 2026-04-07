import { NextRequest, NextResponse } from 'next/server'
import { applyJob } from '@/lib/tools/job-apply'
import { addApplication } from '@/lib/applications-store'

export async function POST(req: NextRequest) {
  try {
    const { platform, jobUrl, email, password, resumePath } = await req.json()
    if (!platform || !jobUrl || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await applyJob(platform, jobUrl, { email, password }, resumePath)

    // Store application record
    addApplication({
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      platform,
      jobUrl,
      email,
      success: result.success,
      message: result.message,
      screenshot: result.screenshot,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Apply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
