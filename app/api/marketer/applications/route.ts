import { NextResponse } from 'next/server'
import { getApplications } from '@/lib/marketer-store'

export async function GET() {
  const apps = await getApplications()
  return NextResponse.json({ applications: apps })
}
