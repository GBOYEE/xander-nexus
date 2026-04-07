import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // TODO: call OpenClaw gateway to stop agent
  return NextResponse.json({ success: true, message: `Agent ${id} stopped` })
}
