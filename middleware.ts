import { NextRequest, NextResponse } from 'next/server'

const requests = new Map<string, number>()
const RATE_LIMIT = 100 // per minute per IP

// Reset counts every minute
setInterval(() => {
  requests.clear()
}, 60_000)

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'
  const key = `${ip}-${Math.floor(Date.now() / 60000)}`
  const count = requests.get(key) ?? 0
  if (count >= RATE_LIMIT) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  requests.set(key, count + 1)
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/(.*)'],
  runtime: 'nodejs' as const,
}
