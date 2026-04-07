import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export function withErrorHandling(handler: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      logger.error('Request failed', { error: error instanceof Error ? error.message : String(error), url: req.url, method: req.method })
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
