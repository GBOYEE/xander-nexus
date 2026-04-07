import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const existing = await db.select().from(users).limit(1).execute()
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Signup disabled' }, { status: 403 })
    }

    const { email, name, password } = await req.json()
    if (!email || !name || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const passwordHash = await hash(password, 10)
    const [user] = await db.insert(users).values({ email, name, passwordHash }).returning().execute()
    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
