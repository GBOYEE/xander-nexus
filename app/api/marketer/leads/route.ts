import { NextRequest, NextResponse } from 'next/server'
import { getLeads, saveLead } from '@/lib/marketer-store'

export async function GET() {
  const leads = await getLeads()
  return NextResponse.json({ leads })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, title, company, source, location, salary, description } = body
    if (!url || !title) {
      return NextResponse.json({ error: 'url and title required' }, { status: 400 })
    }
    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      url,
      title,
      company: company || 'Unknown',
      source: source || 'manual',
      location,
      salary,
      description,
      fetchedAt: new Date(),
      status: 'new' as const,
    }
    await saveLead(lead)
    return NextResponse.json({ lead })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
