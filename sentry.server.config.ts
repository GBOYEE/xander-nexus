import { init as sentryInit } from '@sentry/nextjs'

sentryInit({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
