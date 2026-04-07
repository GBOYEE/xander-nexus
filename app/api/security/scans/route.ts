import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // TODO: trigger HiveSec scan
  return NextResponse.json({ success: true, scanId: `scan_${Date.now()}` })
}

export async function GET() {
  // Return mock scans
  const scans = [
    { id: '1', timestamp: new Date().toISOString(), status: 'passed', findings: 0, summary: 'All checks passed' },
  ]
  return NextResponse.json({ scans })
}
