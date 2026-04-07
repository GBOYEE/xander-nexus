import { NextResponse } from 'next/server'
import { getApplications } from '@/lib/marketer-store'

export async function GET() {
  const apps = await getApplications()
  const total = apps.length
  const sent = apps.filter(a => a.status === 'sent').length
  const failed = apps.filter(a => a.status === 'failed').length

  const metrics = `# HELP xander_applications_total Total applications\n# TYPE xander_applications_total gauge\nxander_applications_total ${total}\n# HELP xander_applications_sent Applications sent successfully\n# TYPE xander_applications_sent gauge\nxander_applications_sent ${sent}\n# HELP xander_applications_failed Applications failed\n# TYPE xander_applications_failed gauge\nxander_applications_failed ${failed}\n`

  return new NextResponse(metrics, { status: 200, headers: { 'Content-Type': 'text/plain' } })
}
