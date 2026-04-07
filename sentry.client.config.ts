import { init as sentryInit } from '@sentry/nextjs'

sentryInit({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
