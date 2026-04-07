// @ts-nocheck
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export const GET = NextAuth(authOptions as any)
export const POST = NextAuth(authOptions as any)
