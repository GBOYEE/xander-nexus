// @ts-nocheck
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const result = await db.execute('SELECT * FROM users WHERE email = $1 LIMIT 1', [credentials.email])
        const user = result.rows[0]
        if (!user) return null
        const valid = await compare(credentials.password, user.password_hash)
        if (!valid) return null
        return { id: String(user.id), email: user.email, name: user.name }
      }
    })
  ],
  session: { strategy: 'jwt' as const },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) { if (user) token.id = user.id; return token },
    async session({ session, token }) { if (token.id) (session.user as any).id = token.id; return session }
  },
  secret: process.env.NEXTAUTH_SECRET
}
