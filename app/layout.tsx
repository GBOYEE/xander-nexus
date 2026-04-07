import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import * as Sentry from '@sentry/nextjs'

type SessionUser = {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

type Session = {
  user?: SessionUser
  expires: string
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xander Nexus',
  description: 'Unified control plane for autonomous AI agents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sentry.ErrorBoundary fallback={<p style={{color:'red'}}>Something went wrong</p>}>
          <SessionProvider>{children}</SessionProvider>
        </Sentry.ErrorBoundary>
      </body>
    </html>
  )
}
