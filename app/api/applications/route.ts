import { NextResponse } from 'next/server'
import { getApplications } from '@/lib/applications-store'

export async function GET() {
  const apps = getApplications()
  return NextResponse.json({ applications: apps })
}
